import { useEffect, useRef } from 'react';
import Map, { Marker, type MapRef } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { RECENT_PROJECT_PINS } from '../content/recentProjectPins.ts';
import { SITE } from '../content/siteCopy.ts';

const NPF_SIGNAL = '#BE1E2D';

/** Matches `ProjectServiceMap` — Central Alberta service corridor */
const SERVICE_AREA_VIEW = {
  longitude: -113.8111,
  latitude: 52.33,
  zoom: 8.85,
} as const;

type Props = {
  className?: string;
  /** When true, draws the same red project pins as the home proof-of-service map (decorative only). */
  showPins?: boolean;
};

/**
 * Read-only Mapbox basemap for decorative backgrounds (no pan/zoom; pointer-events none).
 */
export function ServiceAreaBackdropMap({ className = '', showPins = false }: Props) {
  const token = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
  const mapStyle =
    import.meta.env.VITE_MAPBOX_STYLE_URL ?? 'mapbox://styles/mapbox/light-v11';
  const wrapRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapRef>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      mapRef.current?.resize();
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  if (!token) {
    return (
      <div
        className={`pointer-events-none absolute inset-0 overflow-hidden bg-gradient-to-br from-npf-surface via-zinc-100 to-zinc-200 ${className}`}
        aria-hidden
      >
        <div
          className="absolute inset-0 opacity-[0.35] [background-image:linear-gradient(rgba(190,30,45,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(190,30,45,0.05)_1px,transparent_1px)] [background-size:40px_40px]"
          aria-hidden
        />
        <p className="absolute bottom-6 left-1/2 max-w-[90%] -translate-x-1/2 text-center font-mono text-[9px] uppercase tracking-[0.28em] text-npf-muted sm:text-[10px]">
          {SITE.region} · map preview (add VITE_MAPBOX_ACCESS_TOKEN)
        </p>
      </div>
    );
  }

  return (
    <div
      ref={wrapRef}
      className={`pointer-events-none absolute inset-0 min-h-0 min-w-0 ${className}`}
      aria-hidden
    >
      <Map
        ref={mapRef}
        mapboxAccessToken={token}
        mapStyle={mapStyle}
        initialViewState={SERVICE_AREA_VIEW}
        style={{ width: '100%', height: '100%' }}
        attributionControl
        reuseMaps
        dragPan={false}
        scrollZoom={false}
        boxZoom={false}
        dragRotate={false}
        touchZoomRotate={false}
        doubleClickZoom={false}
        keyboard={false}
      >
        {showPins
          ? RECENT_PROJECT_PINS.map((p) => (
              <Marker
                key={p.id}
                longitude={p.coords[0]}
                latitude={p.coords[1]}
                anchor="center"
              >
                <div className="pointer-events-none flex h-4 w-4 items-center justify-center" aria-hidden>
                  <span
                    className="npf-map-node-core npf-map-node-pulse"
                    style={{ backgroundColor: NPF_SIGNAL }}
                  />
                </div>
              </Marker>
            ))
          : null}
      </Map>
    </div>
  );
}
