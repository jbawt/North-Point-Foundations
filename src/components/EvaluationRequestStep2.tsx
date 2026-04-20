import { motion, useReducedMotion } from 'framer-motion';
import type { Map as MapboxMap } from 'mapbox-gl';
import type { KeyboardEvent } from 'react';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { Marker, type MapRef } from 'react-map-gl/mapbox';
import { useForm } from 'react-hook-form';
import { SERVICE_RADAR_MAP_VIEW } from '../content/serviceAreaRadarNodes.ts';
import { ServiceAreaRadarMap } from './ServiceAreaRadarMap.lazy.tsx';
import { EvaluationRequestProgress } from './EvaluationRequestProgress.tsx';

const NPF_NAVY = '#1a365d';

/** Minimum characters before we auto-fly the map to the best geocode match (allows short town names). */
const GEOCODE_MIN_CHARS = 4;
const GEOCODE_DEBOUNCE_MS = 700;
const SUGGEST_MIN_CHARS = 3;
const SUGGEST_DEBOUNCE_MS = 280;
const SUGGEST_LIMIT = 6;

type GeocodeCoords = { lng: number; lat: number };

type MapboxGeocodeFeature = {
  id: string;
  place_name: string;
  center: [number, number];
  place_type?: string[];
};

function zoomForGeocodeFeature(feature: { place_type?: string[] }): number {
  const types = feature.place_type ?? [];
  if (types.includes('address')) return 16.5;
  if (types.includes('postcode')) return 12.8;
  if (types.includes('place') || types.includes('district')) return 11.2;
  if (types.includes('locality') || types.includes('neighborhood')) return 13.5;
  return 13;
}

export type EvaluationRequestStep2Values = {
  propertyAddress: string;
};

export type EvaluationRequestStep2Props = {
  onBack?: () => void;
  onContinue?: (data: EvaluationRequestStep2Values) => void;
  defaultValues?: Partial<EvaluationRequestStep2Values>;
  className?: string;
};

/**
 * Light base style; on load we nudge background and road line colors toward a navy-forward
 * consultancy palette where Mapbox allows simple paint overrides.
 */
function applyConsultationMapStyling(map: MapboxMap) {
  const style = map.getStyle();
  if (!style?.layers) return;

  for (const layer of style.layers) {
    if (layer.type === 'background') {
      try {
        map.setPaintProperty(layer.id, 'background-color', '#f2f4f7');
      } catch {
        /* optional layer */
      }
      continue;
    }

    if (layer.type !== 'line') continue;
    const id = layer.id;
    if (!/(road|street|highway|primary|secondary|trunk|motorway|tertiary|link)/i.test(id)) continue;
    try {
      map.setPaintProperty(layer.id, 'line-color', NPF_NAVY);
    } catch {
      /* data-driven expression layers — skip */
    }
    try {
      map.setPaintProperty(layer.id, 'line-opacity', 0.88);
    } catch {
      /* skip */
    }
  }
}

export function EvaluationRequestStep2({
  onBack,
  onContinue,
  defaultValues,
  className = '',
}: EvaluationRequestStep2Props) {
  const reduceMotion = useReducedMotion();
  const headingId = useId();
  const listboxId = useId();
  const mapRef = useRef<MapRef>(null);
  const [addressPin, setAddressPin] = useState<GeocodeCoords | null>(null);
  const [suggestions, setSuggestions] = useState<MapboxGeocodeFeature[]>([]);
  const [suggestOpen, setSuggestOpen] = useState(false);
  const [highlightIdx, setHighlightIdx] = useState(0);
  const [suggestLoading, setSuggestLoading] = useState(false);

  const token = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<EvaluationRequestStep2Values>({
    defaultValues: {
      propertyAddress: defaultValues?.propertyAddress ?? '',
    },
    mode: 'onSubmit',
  });

  const propertyAddress = watch('propertyAddress');

  const applyGeocodeFeatureToMap = useCallback(
    (feature: { center: [number, number]; place_type?: string[] }) => {
      const [lng, lat] = feature.center;
      setAddressPin({ lng, lat });
      const map = mapRef.current?.getMap();
      if (!map) return;
      const zoom = zoomForGeocodeFeature(feature);
      const fly = () => {
        map.flyTo({
          center: [lng, lat],
          zoom,
          duration: reduceMotion ? 0 : 1500,
          essential: true,
        });
      };
      if (map.isStyleLoaded()) fly();
      else map.once('load', fly);
    },
    [reduceMotion],
  );

  /** Debounced suggestions while typing (Mapbox autocomplete). */
  useEffect(() => {
    if (!token) return;
    const query = propertyAddress?.trim() ?? '';
    if (query.length < SUGGEST_MIN_CHARS) {
      setSuggestions([]);
      setSuggestOpen(false);
      setSuggestLoading(false);
      return;
    }

    const ac = new AbortController();
    setSuggestLoading(true);
    const timer = window.setTimeout(async () => {
      try {
        const path = encodeURIComponent(query);
        const url = new URL(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${path}.json`,
        );
        url.searchParams.set('access_token', token);
        url.searchParams.set('autocomplete', 'true');
        url.searchParams.set('country', 'CA');
        url.searchParams.set('limit', String(SUGGEST_LIMIT));
        url.searchParams.set(
          'proximity',
          `${SERVICE_RADAR_MAP_VIEW.longitude},${SERVICE_RADAR_MAP_VIEW.latitude}`,
        );
        url.searchParams.set('types', 'address,postcode,place,locality,neighborhood,district');

        const res = await fetch(url.toString(), { signal: ac.signal });
        if (!res.ok) {
          setSuggestions([]);
          return;
        }
        const data = (await res.json()) as { features?: MapboxGeocodeFeature[] };
        const list = (data.features ?? []).filter(
          (f) => f.center && f.center.length >= 2 && f.place_name,
        );
        if (ac.signal.aborted) return;
        setSuggestions(list);
        setHighlightIdx(0);
        setSuggestOpen(list.length > 0);
      } catch {
        if (!ac.signal.aborted) setSuggestions([]);
      } finally {
        if (!ac.signal.aborted) setSuggestLoading(false);
      }
    }, SUGGEST_DEBOUNCE_MS);

    return () => {
      ac.abort();
      window.clearTimeout(timer);
    };
  }, [propertyAddress, token]);

  /** When enough text is typed (address or city), fly to the best geocode match. */
  useEffect(() => {
    if (!token) return;
    const query = propertyAddress?.trim() ?? '';
    if (query.length < GEOCODE_MIN_CHARS) {
      setAddressPin(null);
      return;
    }

    const ac = new AbortController();
    const timer = window.setTimeout(async () => {
      try {
        const path = encodeURIComponent(query);
        const url = new URL(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${path}.json`,
        );
        url.searchParams.set('access_token', token);
        url.searchParams.set('country', 'CA');
        url.searchParams.set('limit', '1');
        url.searchParams.set(
          'proximity',
          `${SERVICE_RADAR_MAP_VIEW.longitude},${SERVICE_RADAR_MAP_VIEW.latitude}`,
        );
        url.searchParams.set('types', 'address,postcode,place,locality,neighborhood,district');

        const res = await fetch(url.toString(), { signal: ac.signal });
        if (!res.ok) return;
        const data = (await res.json()) as {
          features?: Array<{ center?: [number, number]; place_type?: string[] }>;
        };
        const feature = data.features?.[0];
        if (!feature?.center || feature.center.length < 2) return;
        if (ac.signal.aborted) return;

        applyGeocodeFeatureToMap(feature as { center: [number, number]; place_type?: string[] });
      } catch {
        /* aborted or network */
      }
    }, GEOCODE_DEBOUNCE_MS);

    return () => {
      ac.abort();
      window.clearTimeout(timer);
    };
  }, [propertyAddress, token, applyGeocodeFeatureToMap]);

  const onRadarMapReady = useCallback((map: MapboxMap) => {
    const apply = () => {
      applyConsultationMapStyling(map);
    };
    if (map.isStyleLoaded()) apply();
    else map.once('style.load', apply);
  }, []);

  const blurCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clearBlurCloseTimer = () => {
    if (blurCloseTimer.current != null) {
      window.clearTimeout(blurCloseTimer.current);
      blurCloseTimer.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (blurCloseTimer.current != null) {
        window.clearTimeout(blurCloseTimer.current);
        blurCloseTimer.current = null;
      }
    };
  }, []);

  const selectSuggestion = useCallback(
    (feature: MapboxGeocodeFeature) => {
      clearBlurCloseTimer();
      setValue('propertyAddress', feature.place_name, { shouldValidate: true, shouldDirty: true });
      setSuggestions([]);
      setSuggestOpen(false);
      applyGeocodeFeatureToMap(feature);
    },
    [applyGeocodeFeatureToMap, setValue],
  );

  const onAddressKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Escape') {
        setSuggestOpen(false);
        return;
      }
      if (!suggestOpen || suggestions.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlightIdx((v) => Math.min(suggestions.length - 1, v + 1));
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightIdx((v) => Math.max(0, v - 1));
        return;
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        const f = suggestions[highlightIdx];
        if (f) selectSuggestion(f);
      }
    },
    [highlightIdx, selectSuggestion, suggestOpen, suggestions],
  );

  const {
    onChange: addrOnChange,
    onBlur: addrOnBlur,
    ref: addrRef,
    name: addrName,
  } = register('propertyAddress', {
    required: 'Please enter a street address or a city / town.',
    validate: (v) =>
      v.trim().length >= 3
        ? true
        : 'Enter at least 3 characters — a street address or a city / town name is fine.',
  });

  return (
    <div
      className={`bg-npf-surface text-npf-navy ${className}`}
      style={{ fontFamily: 'var(--font-npf-consult-body)' }}
    >
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
        <header className="mb-8 sm:mb-10">
          <p
            className="text-[11px] font-semibold uppercase tracking-[0.22em] text-npf-navy/70 sm:text-xs"
            style={{ fontFamily: 'var(--font-npf-consult-body)' }}
          >
            Request a quote
          </p>
          <h2
            id={headingId}
            className="mt-2 text-2xl font-semibold leading-tight tracking-tight text-npf-navy sm:text-3xl"
            style={{ fontFamily: 'var(--font-npf-consult-heading)' }}
          >
            Where is the property?
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-npf-navy/80 sm:text-[15px]">
            Use the map to confirm the area, then enter either a{' '}
            <span className="font-semibold text-npf-navy">street address</span> (with city and postal code if
            you have them) or just the <span className="font-semibold text-npf-navy">city or town</span> — whichever
            you are comfortable sharing — so we can align your quote with the right service area.
          </p>
        </header>

        <EvaluationRequestProgress activeStepIndex={1} className="mb-8 sm:mb-10" />

        <form
          noValidate
          onSubmit={handleSubmit((data) => onContinue?.(data))}
          aria-labelledby={headingId}
        >
          <div className="overflow-visible rounded-lg border border-npf-navy/20 bg-white shadow-[0_1px_2px_rgba(26,54,93,0.06),0_8px_28px_-10px_rgba(26,54,93,0.15)] dark:border-zinc-600/80 dark:bg-zinc-900/95 dark:shadow-black/35">
            {!token ? (
              <div className="flex min-h-[min(52vh,400px)] flex-col items-center justify-center gap-3 px-6 py-12 text-center">
                <p className="max-w-md text-sm leading-relaxed text-npf-navy/80">
                  Add{' '}
                  <code className="rounded border border-npf-navy/15 bg-npf-consult-canvas px-1.5 py-0.5 text-xs">
                    VITE_MAPBOX_ACCESS_TOKEN
                  </code>{' '}
                  to your environment to display the regional map.
                </p>
              </div>
            ) : (
              <div className="relative isolate h-[min(52vh,420px)] min-h-[280px] w-full overflow-hidden rounded-t-lg sm:min-h-[360px]">
                <ServiceAreaRadarMap
                  ref={mapRef}
                  variant="form"
                  className="h-full w-full"
                  onMapReady={onRadarMapReady}
                >
                  {addressPin ? (
                    <Marker longitude={addressPin.lng} latitude={addressPin.lat} anchor="center">
                      <span
                        className="block h-3.5 w-3.5 rounded-full border-2 border-white bg-npf-classic-red shadow-md ring-1 ring-npf-navy/20"
                        title="Matched location"
                        aria-hidden
                      />
                    </Marker>
                  ) : null}
                </ServiceAreaRadarMap>
                <div className="pointer-events-none absolute bottom-3 left-3 right-3 z-10 sm:left-auto sm:right-4 sm:top-4 sm:w-auto">
                  <p className="rounded-md border border-npf-navy/10 bg-white/95 px-3 py-2 text-[10px] font-medium uppercase tracking-[0.14em] text-npf-navy/70 shadow-sm backdrop-blur-sm dark:border-zinc-600/60 dark:bg-zinc-900/95 dark:text-zinc-300 sm:text-[11px]">
                    Pin appears for your matched location
                  </p>
                </div>
              </div>
            )}

            <div className="rounded-b-lg border-t border-npf-navy/10 p-5 sm:p-6">
              <label
                htmlFor="evaluation-property-address"
                className="block text-[11px] font-bold uppercase tracking-[0.14em] text-npf-navy sm:text-xs"
              >
                Street address or city / town
              </label>
              <div className="relative mt-2">
                <input
                  id="evaluation-property-address"
                  type="text"
                  name={addrName}
                  ref={addrRef}
                  role="combobox"
                  aria-expanded={suggestOpen && (suggestions.length > 0 || suggestLoading)}
                  aria-controls={listboxId}
                  aria-autocomplete="list"
                  aria-activedescendant={
                    suggestOpen && suggestions[highlightIdx]
                      ? `${listboxId}-opt-${highlightIdx}`
                      : undefined
                  }
                  autoComplete="off"
                  placeholder="e.g. 123 Example St, Red Deer, AB — or Red Deer, Lacombe, Ponoka…"
                  className={
                    'w-full rounded-md border-2 border-npf-navy bg-white px-4 py-3 text-sm text-npf-navy shadow-inner placeholder:text-npf-navy/35 ' +
                    'transition-[box-shadow,border-color] duration-200 ease-out focus:border-npf-navy focus:outline-none focus:ring-2 focus:ring-npf-navy/20 dark:border-zinc-500 dark:bg-zinc-900/90 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-400 dark:focus:ring-zinc-600/30 sm:text-[15px]'
                  }
                  onChange={(e) => {
                    addrOnChange(e);
                    setSuggestOpen(true);
                  }}
                  onFocus={() => {
                    clearBlurCloseTimer();
                    if (suggestions.length > 0) setSuggestOpen(true);
                  }}
                  onBlur={(e) => {
                    addrOnBlur(e);
                    blurCloseTimer.current = window.setTimeout(() => {
                      setSuggestOpen(false);
                      blurCloseTimer.current = null;
                    }, 200);
                  }}
                  onKeyDown={onAddressKeyDown}
                />
                {suggestOpen && (suggestLoading || suggestions.length > 0) ? (
                  <ul
                    id={listboxId}
                    role="listbox"
                    className="absolute left-0 right-0 top-full z-30 mt-1 max-h-60 overflow-y-auto rounded-md border border-npf-navy/20 bg-white py-1 shadow-lg dark:border-zinc-600 dark:bg-zinc-900"
                  >
                    {suggestions.map((f, i) => (
                      <li key={f.id} role="presentation" className="px-0.5">
                        <button
                          type="button"
                          role="option"
                          id={`${listboxId}-opt-${i}`}
                          aria-selected={i === highlightIdx}
                          className={
                            'flex w-full cursor-pointer px-3 py-2.5 text-left text-sm leading-snug text-npf-navy transition-colors ' +
                            (i === highlightIdx ? 'bg-npf-navy/[0.07]' : 'hover:bg-npf-navy/[0.05]')
                          }
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => selectSuggestion(f)}
                        >
                          {f.place_name}
                        </button>
                      </li>
                    ))}
                    {suggestLoading && suggestions.length === 0 ? (
                      <li className="px-3 py-2.5 text-sm text-npf-navy/60" role="status">
                        Searching locations…
                      </li>
                    ) : null}
                  </ul>
                ) : null}
              </div>
              {errors.propertyAddress ? (
                <p className="mt-2 text-sm font-medium text-npf-classic-red" role="alert">
                  {errors.propertyAddress.message}
                </p>
              ) : null}
            </div>
          </div>

          <div className="mt-10 flex flex-col-reverse gap-3 sm:mt-12 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <motion.button
              type="button"
              onClick={() => onBack?.()}
              className={
                'w-full rounded-md border-2 border-npf-navy bg-transparent px-6 py-3.5 text-center text-[12px] font-bold uppercase tracking-[0.12em] text-npf-navy ' +
                'transition-[background-color,color,box-shadow] duration-200 ease-out hover:bg-npf-navy/[0.04] focus:outline-none focus-visible:ring-2 focus-visible:ring-npf-navy/25 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f5f7fa] sm:w-auto sm:min-w-[10rem]'
              }
              whileHover={reduceMotion ? undefined : { scale: 1.02 }}
              whileTap={reduceMotion ? undefined : { scale: 0.99 }}
              transition={{ type: 'spring', stiffness: 420, damping: 24 }}
            >
              Back
            </motion.button>
            <motion.button
              type="submit"
              className={
                'w-full rounded-md border border-npf-classic-red/90 bg-npf-classic-red px-6 py-3.5 text-center text-[11px] font-bold uppercase leading-snug tracking-[0.1em] text-white shadow-[0_2px_0_rgba(0,0,0,0.06)] ' +
                'transition-[box-shadow,filter] duration-200 ease-out hover:shadow-[0_6px_24px_-6px_rgba(190,30,45,0.45)] focus:outline-none focus-visible:ring-2 focus-visible:ring-npf-classic-red focus-visible:ring-offset-2 focus-visible:ring-offset-[#f5f7fa] sm:w-auto sm:min-w-[16rem] sm:text-[12px] sm:tracking-[0.12em]'
              }
              whileHover={reduceMotion ? undefined : { scale: 1.02 }}
              whileTap={reduceMotion ? undefined : { scale: 0.99 }}
              transition={{ type: 'spring', stiffness: 420, damping: 24 }}
            >
              Continue to final details
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );
}
