import { motion, useReducedMotion } from 'framer-motion';
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import Map, { Marker, type MapRef } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import {
  PROJECTS_LOGGED_DISPLAY,
  RECENT_PROJECT_PINS,
  type RecentProjectPin,
} from '../content/recentProjectPins.ts';

const NPF_SIGNAL = '#BE1E2D';
const MAP_CENTER = { longitude: -113.8111, latitude: 52.33, zoom: 8.95 };
const BEAM_PX = 52;
const POPUP_EST_HEIGHT = 118;
/** Space needed above the marker for popup + beam before we flip below. */
const POPUP_MARGIN_TOP = POPUP_EST_HEIGHT + BEAM_PX + 20;

function useNarrowViewport() {
  const query = '(max-width: 639px)';
  const subscribe = useCallback((onChange: () => void) => {
    const mq = window.matchMedia(query);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}

export function ProjectServiceMap() {
  const reduceMotion = useReducedMotion();
  const labelId = useId();
  const mapRef = useRef<MapRef>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const narrow = useNarrowViewport();
  const token = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
  const mapStyle =
    import.meta.env.VITE_MAPBOX_STYLE_URL ?? 'mapbox://styles/mapbox/light-v11';

  const [active, setActive] = useState<RecentProjectPin | null>(null);
  const [pixel, setPixel] = useState<{ x: number; y: number } | null>(null);
  const [flipUp, setFlipUp] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const hoverCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const syncActiveRef = useRef<() => void>(() => {});

  const clearHoverTimer = () => {
    if (hoverCloseTimer.current) {
      clearTimeout(hoverCloseTimer.current);
      hoverCloseTimer.current = null;
    }
  };

  const projectToPixel = useCallback((p: RecentProjectPin) => {
    const map = mapRef.current?.getMap();
    const el = wrapRef.current;
    if (!map || !el) return null;
    const pt = map.project(p.coords);
    return { x: pt.x, y: pt.y };
  }, []);

  const syncActivePixel = useCallback(() => {
    if (!active) {
      setPixel(null);
      return;
    }
    const next = projectToPixel(active);
    setPixel(next);
    if (next && wrapRef.current) {
      setFlipUp(next.y < POPUP_MARGIN_TOP);
    }
  }, [active, projectToPixel]);

  syncActiveRef.current = syncActivePixel;

  useEffect(() => {
    syncActivePixel();
  }, [syncActivePixel]);

  useEffect(() => {
    if (!mapReady) return;
    const map = mapRef.current?.getMap();
    if (!map) return;
    const onMove = () => syncActiveRef.current();
    map.on('move', onMove);
    map.on('zoom', onMove);
    map.on('rotate', onMove);
    map.on('pitch', onMove);
    map.on('resize', onMove);
    return () => {
      map.off('move', onMove);
      map.off('zoom', onMove);
      map.off('rotate', onMove);
      map.off('pitch', onMove);
      map.off('resize', onMove);
    };
  }, [mapReady]);

  useEffect(() => {
    if (!wrapRef.current || !token) return;
    const ro = new ResizeObserver(() => {
      mapRef.current?.resize();
      syncActivePixel();
    });
    ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, [syncActivePixel, token]);

  const staticInteractions = narrow;

  const onMarkerEnter = (p: RecentProjectPin) => {
    if (narrow) return;
    clearHoverTimer();
    setActive(p);
  };

  const onMarkerLeave = () => {
    if (narrow) return;
    clearHoverTimer();
    hoverCloseTimer.current = setTimeout(() => setActive(null), 160);
  };

  const onPopupEnter = () => {
    if (narrow) return;
    clearHoverTimer();
  };

  const onPopupLeave = () => {
    if (narrow) return;
    clearHoverTimer();
    hoverCloseTimer.current = setTimeout(() => setActive(null), 160);
  };

  const onMarkerTap = (p: RecentProjectPin) => {
    setActive((prev) => (prev?.id === p.id ? null : p));
  };

  if (!token) {
    return (
      <div
        ref={wrapRef}
        className="relative flex min-h-[min(55vh,420px)] w-full flex-col items-center justify-center gap-3 bg-white px-6 py-14 text-center text-npf-charcoal dark:bg-zinc-950 dark:text-zinc-100"
        aria-labelledby={labelId}
      >
        <p id={labelId} className="max-w-md text-sm leading-relaxed text-npf-muted">
          Add a Mapbox access token to{' '}
          <code className="rounded border border-npf-border bg-npf-surface px-1.5 py-0.5 text-xs text-npf-charcoal">
            .env
          </code>{' '}
          as{' '}
          <code className="rounded border border-npf-border bg-npf-surface px-1.5 py-0.5 text-xs text-npf-charcoal">
            VITE_MAPBOX_ACCESS_TOKEN
          </code>{' '}
          to load the live operational map. See{' '}
          <code className="rounded border border-npf-border bg-npf-surface px-1.5 py-0.5 text-xs">
            .env.example
          </code>
          .
        </p>
        <div
          className="mt-2 flex flex-wrap justify-center gap-2"
          aria-label="Recent project locations preview"
        >
          {RECENT_PROJECT_PINS.map((p) => (
            <span
              key={p.id}
              className="rounded-md border border-npf-border bg-npf-surface px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-npf-muted"
            >
              {p.city}
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={wrapRef}
      className="relative isolate h-[min(52vh,480px)] min-h-[300px] w-full sm:min-h-[360px] md:min-h-[400px]"
      aria-labelledby={labelId}
    >
      <span id={labelId} className="sr-only">
        Proof of service map showing recent foundation project locations in Central Alberta
      </span>

      <div
        className="pointer-events-none absolute right-3 top-3 z-30 max-w-[calc(100%-1.5rem)] rounded-md border border-npf-border bg-white/90 px-2.5 py-1.5 shadow-lg backdrop-blur-md dark:border-zinc-600 dark:bg-zinc-900/92 sm:right-4 sm:top-4 sm:px-3"
        style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}
      >
        <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-npf-muted sm:text-[10px]">
          <span className="text-npf-muted">Projects logged:</span>{' '}
          <span className="tabular-nums text-npf-charcoal">{PROJECTS_LOGGED_DISPLAY}</span>
        </p>
      </div>

      <Map
        ref={mapRef}
        mapboxAccessToken={token}
        mapStyle={mapStyle}
        initialViewState={MAP_CENTER}
        style={{
          width: '100%',
          height: '100%',
          // Let the page scroll vertically on narrow viewports while the map stays non-pannable.
          touchAction: staticInteractions ? 'pan-y' : undefined,
        }}
        attributionControl
        reuseMaps
        dragPan={!staticInteractions}
        scrollZoom={!staticInteractions}
        boxZoom={!staticInteractions}
        dragRotate={false}
        touchZoomRotate={!staticInteractions}
        doubleClickZoom={!staticInteractions}
        keyboard={!staticInteractions}
        onLoad={() => {
          setMapReady(true);
          queueMicrotask(() => syncActiveRef.current());
        }}
        onClick={() => {
          if (narrow) setActive(null);
        }}
      >
        {RECENT_PROJECT_PINS.map((p) => (
          <Marker
            key={p.id}
            longitude={p.coords[0]}
            latitude={p.coords[1]}
            anchor="center"
          >
            <button
              type="button"
              className="npf-map-node relative flex h-4 w-4 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-0 transition-[transform,filter] duration-200 ease-out hover:scale-[1.65] hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-npf-charcoal/50 motion-reduce:transition-none motion-reduce:hover:scale-100"
              aria-label={`${p.city}, ${p.type}. Tap for details.`}
              onMouseEnter={() => onMarkerEnter(p)}
              onMouseLeave={onMarkerLeave}
              onClick={(e) => {
                e.stopPropagation();
                onMarkerTap(p);
              }}
              onFocus={() => onMarkerEnter(p)}
              onBlur={onMarkerLeave}
            >
              <span
                className="npf-map-node-core"
                style={{ backgroundColor: NPF_SIGNAL }}
              />
            </button>
          </Marker>
        ))}
      </Map>

      {active && pixel && (
        <>
          <svg
            className="pointer-events-none absolute inset-0 z-20 overflow-visible"
            width="100%"
            height="100%"
            aria-hidden
          >
            <defs>
              <linearGradient id="npf-beam" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor={NPF_SIGNAL} stopOpacity="0.85" />
                <stop offset="100%" stopColor={NPF_SIGNAL} stopOpacity="0.15" />
              </linearGradient>
            </defs>
            {flipUp ? (
              <line
                x1={pixel.x}
                y1={pixel.y}
                x2={pixel.x}
                y2={pixel.y + BEAM_PX}
                stroke="url(#npf-beam)"
                strokeWidth={2}
                strokeDasharray="4 6"
                opacity={0.9}
              />
            ) : (
              <line
                x1={pixel.x}
                y1={pixel.y}
                x2={pixel.x}
                y2={pixel.y - BEAM_PX}
                stroke="url(#npf-beam)"
                strokeWidth={2}
                strokeDasharray="4 6"
                opacity={0.9}
              />
            )}
          </svg>

          <motion.div
            className="absolute z-30 w-[min(calc(100vw-2rem),16rem)] max-w-[16rem] rounded-xl border border-npf-border bg-white/92 px-3 py-2.5 shadow-xl backdrop-blur-xl dark:border-zinc-600 dark:bg-zinc-900/95 sm:w-64 sm:px-3.5 sm:py-3"
            style={{
              left: pixel.x,
              ...(flipUp
                ? { top: pixel.y + BEAM_PX + 6, transform: 'translateX(-50%)' }
                : { top: pixel.y - BEAM_PX - 6, transform: 'translate(-50%, -100%)' }),
            }}
            initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            onMouseEnter={onPopupEnter}
            onMouseLeave={onPopupLeave}
            role="status"
          >
            <p className="text-sm font-bold leading-tight text-npf-charcoal">{active.city}</p>
            <p className="mt-0.5 text-xs text-npf-muted">{active.type}</p>
            <div
              className="mt-2 inline-flex items-center gap-1.5 rounded-md border border-emerald-600/20 bg-emerald-600/8 px-2 py-1"
              style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}
            >
              <span
                className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600 shadow-[0_0_6px_rgba(5,150,105,0.45)]"
                aria-hidden
              />
              <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-emerald-800">
                Status: complete
              </span>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}
