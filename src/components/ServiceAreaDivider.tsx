import { motion, useReducedMotion } from 'framer-motion';
import { useId } from 'react';
import { SITE, serviceAreasSentence } from '../content/siteCopy.ts';
import { ProjectServiceMap } from './ProjectServiceMap.tsx';

const VIEWPORT = { once: true, amount: 0.25 } as const;

export function ServiceAreaDivider() {
  const reduceMotion = useReducedMotion();
  const labelId = useId();

  return (
    <section
      className="relative m-0 w-full border-y border-npf-border bg-white"
      style={{
        boxShadow: `inset 0 1px 0 rgba(26,26,26,0.06), inset 0 -1px 0 rgba(26,26,26,0.06)`,
      }}
      aria-labelledby={labelId}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.45]"
        aria-hidden
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(26,26,26,0.035) 2px,
            rgba(26,26,26,0.035) 3px
          )`,
        }}
      />

      <div className="relative z-[1] border-b border-npf-border bg-white py-4 sm:py-5 md:py-6">
        <div className="mx-auto flex max-w-[88rem] flex-row flex-wrap items-center justify-between gap-x-8 gap-y-4 px-5 sm:px-8 lg:gap-x-12">
          <div className="min-w-0 flex-1 basis-full space-y-2 sm:space-y-3 sm:basis-[min(100%,26rem)] lg:max-w-2xl">
            <div className="flex flex-wrap items-center gap-3">
              <span
                className="inline-flex h-2 w-2 shrink-0 rounded-full bg-[#BE1E2D]"
                style={{ boxShadow: '0 0 10px rgba(190,30,45,0.55)' }}
                aria-hidden
              />
              <p
                id={labelId}
                className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#BE1E2D] sm:text-xs"
                style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}
              >
                Proof of service · Operational map
              </p>
            </div>
            <p className="text-sm leading-relaxed text-npf-muted sm:text-base">
              Recent project locations across{' '}
              <strong className="font-medium text-npf-charcoal">{serviceAreasSentence()}</strong>.
              Explore the map to see where we&apos;ve delivered work — then read what homeowners say
              below.
            </p>
          </div>

          <ul
            className="flex shrink-0 flex-wrap items-center justify-end gap-2 basis-full sm:basis-auto sm:max-w-none lg:max-w-[min(100%,28rem)]"
            aria-label="Communities we serve"
          >
            {SITE.serviceAreas.map((area, i) => (
              <motion.li
                key={area}
                initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={VIEWPORT}
                transition={{ delay: 0.04 * i, duration: 0.4, ease: 'easeOut' }}
              >
                <span className="inline-flex items-center rounded-md border border-npf-border bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-npf-charcoal shadow-sm sm:px-3 sm:text-[11px]">
                  {area}
                </span>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>

      <div className="relative z-[1] w-full">
        <ProjectServiceMap />
      </div>
    </section>
  );
}
