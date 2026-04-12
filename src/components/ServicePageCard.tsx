import { motion, useReducedMotion } from 'framer-motion';
import { Check } from 'lucide-react';
import type { ServiceDetail } from '../content/siteCopy.ts';
import { ServiceIcon } from './ServiceIcon.tsx';

type ServicePageCardProps = {
  service: ServiceDetail;
  index: number;
};

export function ServicePageCard({ service, index }: ServicePageCardProps) {
  const reduceMotion = useReducedMotion();

  const motionProps = reduceMotion
    ? { initial: false as const }
    : {
        initial: { opacity: 0, y: 32 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.12, margin: '0px 0px -8% 0px' as const },
        transition: { duration: 0.52, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] as const },
      };

  return (
    <motion.article
      className={
        `group relative overflow-hidden rounded-2xl border border-npf-border bg-white shadow-sm shadow-npf-charcoal/[0.06] dark:bg-zinc-900 dark:shadow-black/25 ` +
        `transition-[transform,box-shadow,border-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ` +
        `hover:border-npf-red/35 hover:shadow-[0_28px_70px_-32px_rgba(26,26,26,0.28),0_0_0_1px_color-mix(in_srgb,var(--color-npf-red)_10%,transparent)] ` +
        `hover:[transform:translate3d(0,-8px,0)] ` +
        `motion-reduce:transition-[border-color,box-shadow] motion-reduce:hover:[transform:none]`
      }
      {...motionProps}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100"
        aria-hidden
        style={{
          background: `radial-gradient(90% 70% at 0% 0%, color-mix(in srgb, var(--color-npf-red) 14%, transparent), transparent 55%)`,
        }}
      />
      <div
        className="pointer-events-none absolute inset-y-4 left-0 w-px origin-top bg-gradient-to-b from-npf-red/0 via-npf-red/50 to-npf-red/0 opacity-60 transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100 group-hover:scale-y-110 motion-reduce:group-hover:scale-y-100"
        aria-hidden
      />
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-npf-red/[0.04] blur-3xl transition-transform duration-700 ease-out group-hover:translate-x-[-12px] group-hover:translate-y-[12px] motion-reduce:transition-none" />

      <div className="relative flex flex-col gap-6 p-6 sm:flex-row sm:gap-8 sm:p-8 lg:gap-10">
        <div className="flex shrink-0 flex-row items-start gap-4 sm:w-[min(100%,13rem)] sm:flex-col sm:items-stretch">
          <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-start">
            <span className="font-mono text-[11px] font-semibold tabular-nums tracking-widest text-npf-muted transition-colors duration-300 group-hover:text-npf-red sm:text-xs">
              {String(index + 1).padStart(2, '0')}
            </span>
          </div>
          <div
            className={
              `flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-npf-border/90 bg-npf-surface/50 text-npf-red shadow-sm ` +
              `transition-[transform,box-shadow,border-color,background-color] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ` +
              `group-hover:border-npf-red/30 group-hover:bg-white group-hover:shadow-md dark:group-hover:bg-zinc-800 ` +
              `group-hover:[transform:translate3d(0,-4px,0)_scale(1.06)_rotate(-4deg)] ` +
              `motion-reduce:duration-200 motion-reduce:group-hover:[transform:translate3d(0,-1px,0)_scale(1.03)_rotate(0deg)] ` +
              `sm:h-[4.75rem] sm:w-[4.75rem]`
            }
          >
            <ServiceIcon
              icon={service.icon}
              className={
                `h-8 w-8 transition-transform duration-500 ease-[cubic-bezier(0.38,1.65,0.55,1)] ` +
                `group-hover:scale-110 motion-reduce:group-hover:scale-105 sm:h-9 sm:w-9`
              }
            />
          </div>
        </div>

        <div className="min-w-0 flex-1 space-y-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-npf-charcoal transition-colors duration-300 group-hover:text-npf-red dark:text-zinc-100 sm:text-2xl">
              {service.name}
            </h2>
            <p className="mt-2 text-sm font-medium leading-relaxed text-npf-charcoal/90 dark:text-zinc-200 sm:text-base">
              {service.blurb}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-npf-muted sm:text-[15px] sm:leading-relaxed">{service.detail}</p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-npf-muted">What we focus on</p>
            <ul className="mt-3 space-y-2.5" role="list">
              {service.highlights.map((line, i) => (
                <li
                  key={line}
                  className={
                    `flex gap-3 text-sm leading-snug text-npf-charcoal/95 transition-[transform,color] duration-300 ease-out ` +
                    `group-hover:translate-x-1 sm:text-[15px] sm:leading-relaxed motion-reduce:group-hover:translate-x-0`
                  }
                  style={
                    reduceMotion
                      ? undefined
                      : { transitionDelay: `${40 + i * 45}ms` }
                  }
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-npf-red-soft text-npf-red transition-[transform,background-color] duration-300 group-hover:scale-105 motion-reduce:group-hover:scale-100">
                    <Check className="h-3 w-3" strokeWidth={2.5} aria-hidden />
                  </span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
