import { ServiceIcon } from './ServiceIcon.tsx';
import type { ServiceDetail } from '../content/siteCopy.ts';

type ServiceTileProps = {
  service: ServiceDetail;
};

export function ServiceTile({ service }: ServiceTileProps) {
  return (
    <div className="group relative overflow-hidden flex items-start gap-4 rounded-xl border border-npf-border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-npf-red/30 hover:shadow-md hover:shadow-npf-charcoal/5 before:pointer-events-none before:absolute before:inset-0 before:opacity-0 before:transition-opacity before:duration-300 before:ease-out before:bg-[radial-gradient(120%_120%_at_20%_0%,color-mix(in_srbg,var(--color-npf-red)_20%,transparent),transparent_55%)] group-hover:before:opacity-100">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-npf-surface/70 text-npf-red transition group-hover:bg-white group-hover:transition-transform group-hover:duration-300 group-hover:rotate-6 group-hover:scale-110">
        <ServiceIcon icon={service.icon} className="h-7 w-7 transition-transform duration-300 group-hover:rotate-6" />
      </div>
      <div>
        <p className="text-base font-semibold text-npf-charcoal transition-colors group-hover:text-npf-red">
          {service.name}
        </p>
        <p className="mt-1 text-sm leading-relaxed text-npf-muted">{service.blurb}</p>
      </div>
    </div>
  );
}

