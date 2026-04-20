import { forwardRef, lazy, Suspense } from 'react';
import type { MapRef } from 'react-map-gl/mapbox';
import type { ServiceAreaRadarMapProps } from './ServiceAreaRadarMap.tsx';

const ServiceAreaRadarMapImpl = lazy(async () => {
  const m = await import('./ServiceAreaRadarMap.tsx');
  return { default: m.ServiceAreaRadarMap };
});

function RadarFallback({
  shellClassName = '',
  className = '',
}: Pick<ServiceAreaRadarMapProps, 'shellClassName' | 'className'>) {
  return (
    <div
      className={
        `bg-gradient-to-br from-npf-surface via-zinc-100 to-zinc-200 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 ${shellClassName} ${className}`.trim()
      }
      aria-hidden
    />
  );
}

/**
 * Mapbox + react-map-gl are heavy; load them only when this mounts so the home JS payload stays smaller.
 */
export const ServiceAreaRadarMap = forwardRef<MapRef, ServiceAreaRadarMapProps>(
  function ServiceAreaRadarMapLazy(props, ref) {
    return (
      <Suspense
        fallback={<RadarFallback shellClassName={props.shellClassName} className={props.className} />}
      >
        <ServiceAreaRadarMapImpl ref={ref} {...props} />
      </Suspense>
    );
  },
);
