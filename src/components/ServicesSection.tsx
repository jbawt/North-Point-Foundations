import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  REPAIR_PLAN_ANNOTATIONS,
  REPAIR_PLAN_MARKERS,
  REPAIR_PLAN_OUTLINE_D,
  REPAIR_PLAN_VIEWBOX,
} from '../content/repairPlanBlueprint.ts';
import { SITE, type ServiceDetail } from '../content/siteCopy.ts';
import { ServiceIcon } from './ServiceIcon.tsx';

const VIEWPORT = { once: true, amount: 0.28 } as const;

const NORTH_POINT_RED = '#BE1E2D';
const STROKE_GLOW = 'drop-shadow(0 0 5px rgba(190, 30, 45, 0.5))';

const DRAW_DURATION_S = 2;
const REVEAL_DELAY_S = DRAW_DURATION_S;

const LEFT_SERVICES = SITE.services.slice(0, 3);
const RIGHT_SERVICES = SITE.services.slice(3, 6);

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

const listItemAnimatedLeft = {
  hidden: { x: -28, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

const listItemAnimatedRight = {
  hidden: { x: 28, opacity: 0 },
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

function ServiceCard({ service }: { service: ServiceDetail }) {
  return (
    <div className="flex min-h-[9.5rem] flex-col rounded-xl border border-npf-border bg-white shadow-sm shadow-npf-charcoal/5 transition hover:border-[#BE1E2D]/25 hover:shadow-md sm:min-h-[10.5rem] lg:min-h-0 lg:h-full">
      <div className="flex items-center gap-3 border-b border-npf-border/80 bg-npf-surface/35 px-4 py-3 sm:gap-3.5 sm:px-5 sm:py-3.5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-npf-border/90 bg-white text-[#BE1E2D] shadow-sm sm:h-11 sm:w-11 lg:h-10 lg:w-10 xl:h-11 xl:w-11">
          <ServiceIcon icon={service.icon} className="h-5 w-5 xl:h-6 xl:w-6" />
        </div>
        <p className="min-w-0 flex-1 text-sm font-semibold leading-snug text-npf-charcoal xl:text-base">
          {service.name}
        </p>
      </div>
      <div className="flex min-h-0 flex-1 flex-col justify-center px-4 py-3 sm:px-5 sm:py-4 lg:py-3 xl:py-4">
        <p className="text-xs font-medium leading-relaxed text-npf-charcoal/90 sm:text-sm">{service.blurb}</p>
        <p className="mt-2 text-xs leading-relaxed text-npf-muted sm:mt-2.5 sm:text-[13px] sm:leading-relaxed">
          {service.detail}
        </p>
      </div>
    </div>
  );
}

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

  const leftItemVariants = reduceMotion ? listItemReduced : listItemAnimatedLeft;
  const rightItemVariants = reduceMotion ? listItemReduced : listItemAnimatedRight;

  return (
    <section
      className="border-b border-npf-border bg-npf-surface py-16 text-npf-charcoal sm:py-20 md:py-24"
      aria-labelledby="services-section-heading"
    >
      <div
        className="mx-auto flex max-w-[92rem] flex-col gap-8 px-5 sm:px-8 lg:grid lg:grid-cols-[minmax(0,0.92fr)_minmax(20rem,1.65fr)_minmax(0,0.92fr)] lg:items-stretch lg:gap-x-6 lg:gap-y-10 xl:max-w-[96rem] xl:gap-x-8"
      >
        <div className="order-1 mx-auto max-w-3xl text-center lg:order-none lg:col-span-3">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#BE1E2D]">What we do</p>
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
        </div>

        <motion.ul
          className="order-3 flex min-h-0 flex-col gap-4 lg:order-none lg:h-full lg:gap-3 xl:gap-4"
          variants={reduceMotion ? listContainerReduced : listContainerAnimated}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          aria-label="Core services, first group"
        >
          {LEFT_SERVICES.map((service) => (
            <motion.li
              key={service.name}
              variants={leftItemVariants}
              className="flex min-h-0 flex-1 flex-col lg:min-h-0"
            >
              <ServiceCard service={service} />
            </motion.li>
          ))}
        </motion.ul>

        <div className="order-2 flex w-full justify-center lg:order-none">
          <div className="relative aspect-[4/3] w-full max-w-[min(100%,640px)] min-h-[20rem] overflow-hidden rounded-xl border border-npf-border bg-white shadow-sm shadow-npf-charcoal/5 sm:min-h-[26rem] lg:max-w-none lg:min-h-[30rem] xl:min-h-[36rem] 2xl:min-h-[40rem]">
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

            <div className="relative z-10 flex h-full min-h-[14rem] w-full items-center justify-center px-3 py-3 sm:min-h-0 sm:px-5 sm:py-5 lg:px-6 lg:py-6">
              <svg
                className="h-full w-full max-h-[min(100%,720px)] max-w-full"
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

        <motion.ul
          className="order-4 flex min-h-0 flex-col gap-4 lg:order-none lg:h-full lg:gap-3 xl:gap-4"
          variants={reduceMotion ? listContainerReduced : listContainerAnimated}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          aria-label="Core services, second group"
        >
          {RIGHT_SERVICES.map((service) => (
            <motion.li
              key={service.name}
              variants={rightItemVariants}
              className="flex min-h-0 flex-1 flex-col lg:min-h-0"
            >
              <ServiceCard service={service} />
            </motion.li>
          ))}
        </motion.ul>

        <div className="order-5 flex flex-wrap justify-center gap-3 pt-2 lg:order-none lg:col-span-3">
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
    </section>
  );
}
