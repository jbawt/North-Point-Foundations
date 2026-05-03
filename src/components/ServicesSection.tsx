import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  REPAIR_PLAN_ANNOTATIONS,
  REPAIR_PLAN_MARKERS,
  REPAIR_PLAN_OUTLINE_D,
  REPAIR_PLAN_VIEWBOX,
} from '../content/repairPlanBlueprint.ts';
import { SERVICE_DECK_FRAGMENT_IDS, SITE, type ServiceDetail } from '../content/siteCopy.ts';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion.ts';
import { ServiceIcon } from './ServiceIcon.tsx';

const VIEWPORT = { once: true, amount: 0.28 } as const;

const NORTH_POINT_RED = '#BE1E2D';
const STROKE_GLOW = 'drop-shadow(0 0 5px rgba(190, 30, 45, 0.5))';

const DRAW_DURATION_S = 2;

const LEFT_SERVICES = SITE.services.slice(0, 3);
const RIGHT_SERVICES = SITE.services.slice(3, 6);

const listContainerAnimated = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.12,
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
  const deckIdx = SITE.services.indexOf(service);
  const deckFragment =
    deckIdx >= 0 && deckIdx < SERVICE_DECK_FRAGMENT_IDS.length ? SERVICE_DECK_FRAGMENT_IDS[deckIdx] : undefined;
  const to = deckFragment ? `/services#${deckFragment}` : '/services';

  return (
    <Link
      to={to}
      className={
        `group flex min-h-[9.5rem] flex-col overflow-hidden rounded-xl border border-npf-border bg-white shadow-sm shadow-npf-charcoal/5 dark:bg-zinc-900 dark:shadow-black/20 ` +
        `transition-[transform,box-shadow,border-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ` +
        `hover:border-[#BE1E2D]/35 hover:shadow-[0_26px_58px_-28px_rgba(26,26,26,0.22),0_0_0_1px_rgba(190,30,45,0.07)] ` +
        `hover:[transform:translate3d(0,-6px,0)_scale(1.045)] ` +
        `motion-reduce:transition-[border-color,box-shadow] motion-reduce:hover:[transform:none] ` +
        `focus:outline-none focus-visible:ring-2 focus-visible:ring-[#BE1E2D]/35 focus-visible:ring-offset-2 focus-visible:ring-offset-npf-surface dark:focus-visible:ring-[#BE1E2D]/45 dark:focus-visible:ring-offset-zinc-950 ` +
        `sm:min-h-[10.5rem] lg:min-h-0 lg:h-full`
      }
    >
      <div className="flex items-center gap-3 border-b border-npf-border/80 bg-npf-surface/35 px-4 pt-3.5 pb-3 transition-[background-color] duration-300 group-hover:bg-npf-surface/55 sm:gap-3.5 sm:px-5 sm:pt-4 sm:pb-3.5">
        <div
          className={
            `flex h-10 w-10 shrink-0 origin-center items-center justify-center rounded-lg border border-npf-border/90 ` +
            `bg-white text-[#BE1E2D] shadow-sm will-change-transform dark:bg-zinc-800 ` +
            `transition-[transform,box-shadow,border-color] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ` +
            `group-hover:border-[#BE1E2D]/35 group-hover:shadow-md ` +
            `group-hover:[transform:translate3d(0,-4px,0)_scale(1.1)_rotate(5deg)] ` +
            `motion-reduce:duration-200 motion-reduce:ease-out motion-reduce:group-hover:[transform:translate3d(0,-1px,0)_scale(1.05)_rotate(0deg)] ` +
            `sm:h-11 sm:w-11 lg:h-10 lg:w-10 xl:h-11 xl:w-11`
          }
        >
          <ServiceIcon
            icon={service.icon}
            className={
              `h-5 w-5 origin-center transition-transform duration-500 ease-[cubic-bezier(0.38,1.65,0.55,1)] ` +
              `group-hover:scale-[1.08] motion-reduce:group-hover:scale-105 xl:h-6 xl:w-6`
            }
          />
        </div>
        <p className="min-w-0 flex-1 text-sm font-semibold leading-snug text-npf-charcoal transition-colors duration-300 group-hover:text-[#BE1E2D] dark:text-zinc-100 xl:text-base">
          {service.name}
        </p>
      </div>
      <div className="flex min-h-0 flex-1 flex-col justify-center px-4 py-3 sm:px-5 sm:py-4 lg:py-3 xl:py-4">
        <p className="text-xs font-medium leading-relaxed text-npf-charcoal/90 dark:text-zinc-200 sm:text-sm">
          {service.blurb}
        </p>
        <p className="mt-2 text-xs leading-relaxed text-npf-muted dark:text-zinc-400 sm:mt-2.5 sm:text-[13px] sm:leading-relaxed">
          {service.detail}
        </p>
      </div>
    </Link>
  );
}

export function ServicesSection() {
  const reduceMotion = usePrefersReducedMotion();
  /** Ref + `useInView` is more reliable on mobile than `whileInView` on nested SVG paths (IO + WebKit). */
  const blueprintSvgRef = useRef<SVGSVGElement>(null);
  const blueprintInView = useInView(blueprintSvgRef, {
    once: true,
    amount: 'some',
    margin: '0px 0px 25% 0px',
  });

  const pathTarget = { pathLength: 1 as const };
  const pathInitial = reduceMotion ? pathTarget : { pathLength: 0 as const };
  const pathTransition = reduceMotion
    ? { duration: 0 }
    : { duration: DRAW_DURATION_S, ease: 'easeInOut' as const };

  /** Dots + labels — short stagger only (no wait for path finish) so they track with the line draw. */
  const blueprintOverlayTransition = (extraDelay = 0) =>
    reduceMotion
      ? { duration: 0 }
      : { delay: extraDelay, duration: 0.42, ease: 'easeOut' as const };

  const leftItemVariants = reduceMotion ? listItemReduced : listItemAnimatedLeft;
  const rightItemVariants = reduceMotion ? listItemReduced : listItemAnimatedRight;

  return (
    <section
      className="border-b border-npf-border bg-npf-surface py-16 text-npf-charcoal dark:text-zinc-100 sm:py-20 md:py-24"
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
              className="text-3xl font-bold tracking-tight text-npf-charcoal dark:text-zinc-100 sm:text-4xl"
            >
              Professional Solutions
            </h2>
            <p className="text-sm leading-relaxed text-npf-muted dark:text-zinc-300 sm:text-base">
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
          <div className="group npf-sleek-lift relative aspect-[4/3] w-full max-w-[min(100%,640px)] min-h-[20rem] overflow-hidden rounded-xl border border-npf-border bg-white shadow-sm shadow-npf-charcoal/5 dark:bg-zinc-900 dark:shadow-black/25 sm:min-h-[26rem] lg:max-w-none lg:min-h-[30rem] xl:min-h-[36rem] 2xl:min-h-[40rem]">
            <div
              className={
                'pointer-events-none absolute inset-0 z-[1] [background-size:24px_24px] ' +
                '[background-image:linear-gradient(rgba(26,26,26,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(26,26,26,0.14)_1px,transparent_1px)] ' +
                'dark:[background-image:linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)]'
              }
              aria-hidden
            />

            <div
              className="relative z-10 flex h-full min-h-[14rem] w-full items-center justify-center px-3 py-3 transition-[transform,filter] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02] sm:min-h-0 sm:px-5 sm:py-5 lg:px-6 lg:py-6 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              style={{ filter: STROKE_GLOW }}
            >
              <svg
                ref={blueprintSvgRef}
                className="h-full w-full max-h-[min(100%,720px)] max-w-full transition-[filter] duration-500 group-hover:drop-shadow-[0_0_14px_rgba(190,30,45,0.35)] motion-reduce:transition-none motion-reduce:group-hover:drop-shadow-none"
                viewBox={REPAIR_PLAN_VIEWBOX}
                preserveAspectRatio="xMidYMid meet"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                role="img"
                aria-label="Residential floor plan schematic with repair scope callouts"
              >
                <title>Floor plan schematic — repair scope</title>

                <motion.path
                  d={REPAIR_PLAN_OUTLINE_D}
                  fill="none"
                  stroke={NORTH_POINT_RED}
                  strokeWidth={2.85}
                  vectorEffect="nonScalingStroke"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={pathInitial}
                  animate={reduceMotion ? pathTarget : blueprintInView ? pathTarget : pathInitial}
                  transition={pathTransition}
                />

                {REPAIR_PLAN_MARKERS.map((m, i) => (
                  <motion.circle
                    key={`m-${i}`}
                    cx={m.cx}
                    cy={m.cy}
                    r={4.75}
                    strokeWidth={0.95}
                    className="fill-blue-700 stroke-blue-200 dark:fill-sky-400 dark:stroke-sky-100"
                    initial={{ opacity: reduceMotion ? 1 : 0, scale: reduceMotion ? 1 : 0.6 }}
                    animate={
                      reduceMotion
                        ? { opacity: 1, scale: 1 }
                        : blueprintInView
                          ? { opacity: 1, scale: 1 }
                          : { opacity: 0, scale: 0.6 }
                    }
                    transition={blueprintOverlayTransition(0.05 + i * 0.035)}
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
                    className="select-none fill-[#1e293b] [text-rendering:geometricPrecision] dark:fill-zinc-100"
                    initial={{ opacity: reduceMotion ? 1 : 0 }}
                    animate={
                      reduceMotion ? { opacity: 1 } : blueprintInView ? { opacity: 1 } : { opacity: 0 }
                    }
                    transition={blueprintOverlayTransition(0.08 + i * 0.04)}
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
            className="npf-sleek-lift-subtle inline-flex min-h-11 items-center justify-center rounded-lg bg-npf-red px-6 py-2.5 text-sm font-semibold text-white shadow-sm shadow-npf-red/20 hover:bg-npf-red-dark hover:shadow-[0_16px_36px_-14px_rgba(188,44,38,0.55)] active:translate-y-px focus:outline-none"
            to="/services"
          >
            View all services
          </Link>
          <Link
            className="npf-sleek-lift-subtle inline-flex min-h-11 items-center justify-center rounded-lg border border-npf-border bg-white px-6 py-2.5 text-sm font-semibold text-npf-charcoal shadow-sm hover:border-[#BE1E2D]/25 hover:bg-white active:translate-y-px focus:outline-none dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
            to="/contact"
          >
            Get a quote
          </Link>
        </div>
      </div>
    </section>
  );
}
