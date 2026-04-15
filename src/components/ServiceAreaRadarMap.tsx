import { motion } from 'framer-motion';
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  forwardRef,
} from 'react';
import Map, { Marker, type MapRef } from 'react-map-gl/mapbox';
import type { Map as MapboxMap } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import { SITE } from '../content/siteCopy';
import {
  getServiceRadarBounds,
  SERVICE_RADAR_GLOBE_INTRO_VIEW,
  SERVICE_RADAR_MAP_VIEW,
  SERVICE_RADAR_NODES,
  type ServiceRadarNode,
} from '../content/serviceAreaRadarNodes';

export type ServiceAreaRadarVariant = 'interactive' | 'backdrop' | 'form';

export type ServiceRadarInitialView = Partial<{
  longitude: number;
  latitude: number;
  zoom: number;
  bearing: number;
  pitch: number;
}>;

export type ServiceAreaRadarMapProps = {
  variant: ServiceAreaRadarVariant;
  /** Appended to the outer wrapper (e.g. `pointer-events-none absolute inset-0` for decorative maps). */
  shellClassName?: string;
  className?: string;
  /** Merged over the default regional view (e.g. zoom out on a specific page). */
  initialViewState?: ServiceRadarInitialView;
  /**
   * Interactive maps only: start at a world view, then animate to fit all service nodes when the
   * map becomes visible (respects `prefers-reduced-motion`).
   */
  introFlyFromGlobe?: boolean;
  /** Called once the underlying Mapbox map is ready (style loaded). */
  onMapReady?: (map: MapboxMap) => void;
  children?: React.ReactNode;
  'aria-hidden'?: boolean;
};

const MAP_STYLE_URL =
  import.meta.env.VITE_MAPBOX_STYLE_URL ?? 'mapbox://styles/mapbox/light-v11';

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

function formatStatsBlock(node: ServiceRadarNode): string {
  const { stats } = node;
  const resp = String(stats.responseHrs).padStart(2, '0');
  return [
    `LOCALITY    ${node.name}`,
    `PROJECTS    ${stats.projectsYtd}`,
    `AVG_RADIUS  ${stats.avgRadiusKm} km`,
    `RESPONSE    ${resp} h`,
    `STATUS      ${stats.status}`,
  ].join('\n');
}

function RadarNodeMarker({ node, index }: { node: ServiceRadarNode; index: number }) {
  const [hover, setHover] = useState(false);
  const scale = node.pulseScale ?? 1;
  const duration = `${(2.55 / scale).toFixed(2)}s`;
  const maxScale = `${(3.15 * scale).toFixed(2)}`;
  const stagger = index * 0.38;

  const ringStyle = {
    '--npf-radar-duration': duration,
    '--npf-radar-max-scale': maxScale,
    '--npf-radar-delay': `${stagger}s`,
  } as React.CSSProperties;

  const echoStyle = {
    ...ringStyle,
    '--npf-radar-echo-offset': `${0.95 / scale}s`,
  } as React.CSSProperties;

  return (
    <Marker longitude={node.coords[0]} latitude={node.coords[1]} anchor="center">
      <div className="pointer-events-auto relative flex h-0 w-0 items-center justify-center">
        <button
          type="button"
          className="relative flex h-0 w-0 cursor-default items-center justify-center border-0 bg-transparent p-0 outline-none"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onFocus={() => setHover(true)}
          onBlur={() => setHover(false)}
          aria-label={`${node.name} service radar node`}
        >
          <span className="npf-radar-ping-disk" style={ringStyle} />
          <span className="npf-radar-ping-disk npf-radar-ping-disk--echo" style={echoStyle} />
          <motion.span
            className="absolute z-[1] block h-3 w-3 rounded-full bg-[#BE1E2D] shadow-[0_0_14px_rgba(190,30,45,0.95),0_0_28px_rgba(255,100,110,0.35)]"
            animate={{ scale: [1, 1.1, 1], opacity: [1, 0.88, 1] }}
            transition={{ duration: 2.1 / scale, repeat: Infinity, ease: 'easeInOut' }}
          />
        </button>

        {hover ? (
          <div
            className="pointer-events-none absolute left-1/2 top-5 z-[80] w-[15.5rem] -translate-x-1/2 rounded-lg border border-[#BE1E2D]/25 bg-white/95 px-3 py-2.5 text-left shadow-[0_12px_40px_-12px_rgba(0,0,0,0.35)] backdrop-blur-md dark:border-white/15 dark:bg-zinc-950/95"
            role="status"
          >
            <p
              className="mb-1.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-npf-muted"
              style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}
            >
              Operational stats
            </p>
            <pre
              className="m-0 whitespace-pre text-[10px] leading-snug text-npf-charcoal dark:text-zinc-100"
              style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}
            >
              {formatStatsBlock(node)}
            </pre>
          </div>
        ) : null}
      </div>
    </Marker>
  );
}

export const ServiceAreaRadarMap = forwardRef<MapRef, ServiceAreaRadarMapProps>(
  function ServiceAreaRadarMap(
    {
      variant,
      shellClassName = '',
      className = '',
      initialViewState: initialViewStateProp,
      introFlyFromGlobe = false,
      onMapReady,
      children,
      'aria-hidden': ariaHidden,
    },
    ref,
  ) {
    const token = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
    const labelId = useId();
    const wrapRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<MapRef | null>(null);
    const introIoRef = useRef<IntersectionObserver | null>(null);
    const narrowViewport = useNarrowViewport();

    const staticInteractions =
      variant === 'backdrop' || (variant === 'interactive' && narrowViewport);

    const setMapRef = useCallback(
      (instance: MapRef | null) => {
        mapRef.current = instance;
        if (typeof ref === 'function') {
          ref(instance);
        } else if (ref != null) {
          (ref as React.MutableRefObject<MapRef | null>).current = instance;
        }
      },
      [ref],
    );

    const onMapLoad = useCallback(
      (e: { target: MapboxMap }) => {
        const map = e.target;

        const afterStyle = () => {
          onMapReady?.(map);

          if (!introFlyFromGlobe || variant !== 'interactive') return;

          const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

          const flyToServiceArea = () => {
            map.resize();
            map.fitBounds(getServiceRadarBounds(), {
              padding: { top: 44, bottom: 56, left: 44, right: 44 },
              duration: reduceMotion ? 0 : 5200,
              maxZoom: 10,
              essential: true,
            });
          };

          if (reduceMotion) {
            flyToServiceArea();
            return;
          }

          const el = wrapRef.current;
          if (!el) {
            requestAnimationFrame(flyToServiceArea);
            return;
          }

          introIoRef.current?.disconnect();

          const tryInView = () => {
            const r = el.getBoundingClientRect();
            return r.top < window.innerHeight && r.bottom > 0;
          };

          if (tryInView()) {
            requestAnimationFrame(flyToServiceArea);
            return;
          }

          introIoRef.current = new IntersectionObserver(
            (entries) => {
              if (entries[0]?.isIntersecting) {
                introIoRef.current?.disconnect();
                introIoRef.current = null;
                flyToServiceArea();
              }
            },
            { threshold: 0.06, rootMargin: '80px 0px' },
          );
          introIoRef.current.observe(el);
        };

        if (map.isStyleLoaded()) afterStyle();
        else map.once('style.load', afterStyle);
      },
      [introFlyFromGlobe, onMapReady, variant],
    );

    useEffect(() => {
      return () => {
        introIoRef.current?.disconnect();
        introIoRef.current = null;
      };
    }, []);

    useEffect(() => {
      const el = wrapRef.current;
      if (!el || !token) return;

      const ro = new ResizeObserver(() => {
        mapRef.current?.resize();
      });
      ro.observe(el);
      return () => ro.disconnect();
    }, [token]);

    if (!token) {
      if (variant === 'backdrop') {
        return (
          <div
            ref={wrapRef}
            className={`pointer-events-none absolute inset-0 overflow-hidden bg-gradient-to-br from-npf-surface via-zinc-100 to-zinc-200 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 ${shellClassName} ${className}`}
            aria-hidden={ariaHidden ?? true}
          >
            <div
              className="absolute inset-0 opacity-[0.35] [background-image:linear-gradient(rgba(190,30,45,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(190,30,45,0.05)_1px,transparent_1px)] [background-size:40px_40px]"
              aria-hidden
            />
            <p className="absolute bottom-6 left-1/2 max-w-[90%] -translate-x-1/2 text-center font-mono text-[9px] uppercase tracking-[0.28em] text-npf-muted dark:text-zinc-400 sm:text-[10px]">
              {SITE.region} · map preview (add VITE_MAPBOX_ACCESS_TOKEN)
            </p>
          </div>
        );
      }

      return (
        <div
          ref={wrapRef}
          className={
            `relative flex min-h-[min(55vh,420px)] w-full flex-col items-center justify-center gap-3 bg-white px-6 py-14 text-center text-npf-charcoal dark:bg-zinc-950 dark:text-zinc-100 ${shellClassName} ${className}`.trim()
          }
          aria-labelledby={labelId}
          aria-hidden={ariaHidden}
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
            to load the service area map. See{' '}
            <code className="rounded border border-npf-border bg-npf-surface px-1.5 py-0.5 text-xs">
              .env.example
            </code>
            .
          </p>
          <p className="max-w-lg text-xs leading-relaxed text-npf-muted">
            Service area includes {SITE.serviceAreas.join(', ')}.
          </p>
        </div>
      );
    }

    const heightClass =
      variant === 'backdrop' || variant === 'form'
        ? 'h-full min-h-0'
        : 'h-[min(52vh,480px)] min-h-[300px] sm:min-h-[360px] md:min-h-[400px]';

    const outerClass =
      `relative isolate w-full ${heightClass} ${shellClassName} ${className}`.trim();

    const hideFromAt = ariaHidden ?? variant === 'backdrop';

    const initialViewState =
      introFlyFromGlobe && variant === 'interactive'
        ? { ...SERVICE_RADAR_GLOBE_INTRO_VIEW, ...initialViewStateProp }
        : { ...SERVICE_RADAR_MAP_VIEW, ...initialViewStateProp };

    return (
      <div
        ref={wrapRef}
        className={outerClass}
        aria-hidden={hideFromAt ? true : undefined}
        aria-labelledby={hideFromAt ? undefined : labelId}
      >
        {!hideFromAt ? (
          <span id={labelId} className="sr-only">
            Map showing service-area radar nodes across {SITE.region}.
          </span>
        ) : null}

        <Map
          ref={setMapRef}
          mapboxAccessToken={token}
          mapStyle={MAP_STYLE_URL}
          initialViewState={initialViewState}
          style={{
            width: '100%',
            height: '100%',
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
          onLoad={onMapLoad}
        >
          {SERVICE_RADAR_NODES.map((node, i) => (
            <RadarNodeMarker key={node.id} node={node} index={i} />
          ))}
          {children}
        </Map>
      </div>
    );
  },
);
