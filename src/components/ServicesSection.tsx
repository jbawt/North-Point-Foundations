import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  REPAIR_PLAN_ANNOTATIONS,
  REPAIR_PLAN_MARKERS,
  REPAIR_PLAN_OUTLINE_D,
  REPAIR_PLAN_VIEWBOX,
} from '../content/repairPlanBlueprint.ts';
import { SITE } from '../content/siteCopy.ts';
import { ServiceIcon } from './ServiceIcon.tsx';

const VIEWPORT = { once: true, amount: 0.28 } as const;

const NORTH_POINT_RED = '#BE1E2D';
const STROKE_GLOW = 'drop-shadow(0 0 5px rgba(190, 30, 45, 0.5))';

const DRAW_DURATION_S = 2;
const REVEAL_DELAY_S = DRAW_DURATION_S;

const listContainerAnimated = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 1.05,
    },
  },
};

const listContainerReduced = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0,
      delayChildren: 0,
    },
  },
};

const listItemAnimated = {
  hidden: { x: -28, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

const listItemReduced = {
  hidden: { x: 0, opacity: 1 },
  visible: { x: 0, opacity: 1 },
};

export function ServicesSection() {
  const reduceMotion = useReducedMotion();

  const pathTarget = { pathLength: 1 as const };
  const pathInitial = reduceMotion ? pathTarget : { pathLength: 0 as const };
  const pathTransition = reduceMotion
    ? { duration: 0 }
    : { duration: DRAW_DURATION_S, ease: 'easeInOut' as const };

  const revealTransition = (extraDelay = 0) =>
    reduceMotion
      ? { duration: 0 }
      : { delay: REVEAL_DELAY_S + extraDelay, duration: 0.5, ease: 'easeOut' as const };

  return (
    <section
      className="border-b border-npf-border bg-npf-surface py-16 text-npf-charcoal sm:py-20 md:py-24"
      aria-labelledby="services-section-heading"
    >
      <div className="mx-auto grid max-w-[88rem] gap-12 px-5 sm:px-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.52fr)] md:items-center md:gap-14 lg:gap-16">
        <div className="space-y-8 md:max-w-xl">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#BE1E2D]">
              What we do
            </p>
            <h2
              id="services-section-heading"
              className="text-3xl font-bold tracking-tight text-npf-charcoal sm:text-4xl"
            >
              Professional Solutions
            </h2>
            <p className="text-sm leading-relaxed text-npf-muted sm:text-base">
              Foundation repair and waterproofing engineered for Central Alberta conditions — from
              exterior sealing to drainage and structural stabilization.
            </p>
          </div>

          <motion.ul
            className="space-y-4"
            variants={reduceMotion ? listContainerReduced : listContainerAnimated}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
            aria-label="Core services"
          >
            {SITE.services.map((service) => (
              <motion.li
                key={service.name}
                variants={reduceMotion ? listItemReduced : listItemAnimated}
                className="flex gap-3.5 border-l-2 border-[#BE1E2D]/40 pl-4 sm:gap-4"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-npf-border bg-white text-npf-red shadow-sm sm:h-12 sm:w-12">
                  <ServiceIcon icon={service.icon} className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold tracking-tight text-npf-charcoal">{service.name}</p>
                  <p className="mt-0.5 text-sm text-npf-muted">{service.blurb}</p>
                </div>
              </motion.li>
            ))}
          </motion.ul>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              className="inline-flex min-h-11 items-center justify-center rounded-lg bg-npf-red px-6 py-2.5 text-sm font-semibold text-white shadow-sm shadow-npf-red/20 transition hover:bg-npf-red-dark hover:shadow-npf-red/30 active:translate-y-px focus:outline-none"
              to="/services"
            >
              View all services
            </Link>
            <a
              className="inline-flex min-h-11 items-center justify-center rounded-lg border border-npf-border bg-white px-6 py-2.5 text-sm font-semibold text-npf-charcoal shadow-sm transition hover:bg-white hover:shadow-md active:translate-y-px focus:outline-none"
              href={SITE.quotePhoneTel}
            >
              Get a quote
            </a>
          </div>
        </div>

        <div className="relative aspect-[4/3] min-h-[22rem] w-full overflow-hidden rounded-xl border border-npf-border bg-white shadow-sm shadow-npf-charcoal/5 sm:min-h-[25rem] md:min-h-[29rem] lg:min-h-[34rem]">
          <div
            className="pointer-events-none absolute inset-0 z-[1]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(26,26,26,0.14) 1px, transparent 1px),
                linear-gradient(90deg, rgba(26,26,26,0.14) 1px, transparent 1px)
              `,
              backgroundSize: '24px 24px',
            }}
            aria-hidden
          />

          <div className="relative z-10 flex h-full min-h-[12rem] w-full items-center justify-center px-4 py-4 sm:min-h-0 sm:px-6 sm:py-6 lg:px-8">
            <svg
              className="h-full w-full max-h-[min(100%,560px)] max-w-full"
              viewBox={REPAIR_PLAN_VIEWBOX}
              preserveAspectRatio="xMidYMid meet"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="Residential floor plan schematic with repair scope callouts"
              style={{ filter: STROKE_GLOW }}
            >
              <title>Floor plan schematic — repair scope</title>

              <motion.path
                d={REPAIR_PLAN_OUTLINE_D}
                fill="none"
                stroke={NORTH_POINT_RED}
                strokeWidth={2.35}
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={pathInitial}
                animate={reduceMotion ? pathTarget : undefined}
                whileInView={reduceMotion ? undefined : pathTarget}
                transition={pathTransition}
                viewport={VIEWPORT}
              />

              {REPAIR_PLAN_MARKERS.map((m, i) => (
                <motion.circle
                  key={`m-${i}`}
                  cx={m.cx}
                  cy={m.cy}
                  r={4.75}
                  fill="#1d4ed8"
                  stroke="#93c5fd"
                  strokeWidth={0.95}
                  initial={{ opacity: reduceMotion ? 1 : 0, scale: reduceMotion ? 1 : 0.6 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={revealTransition(0.04 + i * 0.02)}
                  viewport={VIEWPORT}
                />
              ))}

              {REPAIR_PLAN_ANNOTATIONS.map((ann, i) => (
                <motion.text
                  key={ann.key}
                  x={ann.x}
                  y={ann.y}
                  textAnchor={ann.textAnchor ?? 'start'}
                  fontSize={11.5}
                  fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
                  fill="#1e293b"
                  className="select-none [text-rendering:geometricPrecision]"
                  initial={{ opacity: reduceMotion ? 1 : 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={revealTransition(0.22 + i * 0.04)}
                  viewport={VIEWPORT}
                >
                  {ann.lines.map((line, li) => (
                    <tspan key={li} x={ann.x} dy={li === 0 ? 0 : 13}>
                      {line}
                    </tspan>
                  ))}
                </motion.text>
              ))}
            </svg>
          </div>

          <p className="pointer-events-none absolute bottom-3 left-3 z-20 font-mono text-[10px] font-medium tracking-wide text-[#BE1E2D] sm:bottom-4 sm:left-4 sm:text-[11px]">
            RED DEER, AB
          </p>
        </div>
      </div>
    </section>
  );
}
