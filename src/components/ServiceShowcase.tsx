import {
  motion,
  useInView,
  useReducedMotion,
} from 'framer-motion';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaChevronDown } from 'react-icons/fa6';
import { SITE } from '../content/siteCopy.ts';
import { ServiceAreaBackdropMap } from './ServiceAreaBackdropMap.tsx';
import { ServiceIcon } from './ServiceIcon.tsx';
import type { ServiceIconId } from '../content/siteCopy.ts';

type SpecRow = { label: string; value: string };

type ShowcaseSection = {
  id: string;
  title: string;
  technicalDescription: string;
  specs: SpecRow[];
  icon: ServiceIconId;
  visualLabel: string;
};

/** Technical “spec sheet” + copy aligned to `SITE.services` order */
const SHOWCASE_SECTIONS: ShowcaseSection[] = [
  {
    id: 'exterior-waterproofing',
    title: 'Exterior Waterproofing',
    technicalDescription:
      'Below-grade envelope assembly: membrane continuity, drainage plane, and bulk-water management tied to positive exterior discharge. Engineered for freeze–thaw cycling and capillary break at the wall–soil interface.',
    specs: [
      { label: 'Membrane', value: '60-mil reinforced HDPE' },
      { label: 'Drainage', value: 'Geocomposite board + filter fabric' },
      { label: 'Warranty', value: '25-Year Transferable' },
      { label: 'Design load', value: 'Hydrostatic relief + perimeter intercept' },
    ],
    icon: 'waterproofing',
    visualLabel: 'Exterior membrane assembly — schematic render',
  },
  {
    id: 'crack-repair',
    title: 'Crack Repair',
    technicalDescription:
      'Structural stabilization and water-path mitigation via engineered injection resins or exterior closure, selected after crack mapping, movement history, and moisture tracing.',
    specs: [
      { label: 'Injection system', value: 'Low-viscosity polyurethane / epoxy' },
      { label: 'Prep standard', value: 'Routed chase + surface port grid' },
      { label: 'Performance', value: 'Elastic recovery −35°C to +40°C' },
      { label: 'QA', value: 'Pressure-monitored injection cycles' },
    ],
    icon: 'crack-repair',
    visualLabel: 'Injection plane — detail visualization',
  },
  {
    id: 'weeping-tile',
    title: 'Weeping Tile Install',
    technicalDescription:
      'Footing-level perimeter collector with continuous slope, cleanouts, and discharge to sump or daylight. Relieves hydrostatic head while preserving long-term service access.',
    specs: [
      { label: 'Pipe', value: '4″ perforated HDPE — socked' },
      { label: 'Slope', value: '≥ 1/8″ per ft to discharge' },
      { label: 'Bedding', value: 'Clear stone envelope — min. 6″ cover' },
      { label: 'Access', value: 'Inline cleanouts @ ≤ 50 ft' },
    ],
    icon: 'weeping-tile',
    visualLabel: 'Perimeter drain field — isometric',
  },
  {
    id: 'sump-systems',
    title: 'Sump Pump Systems',
    technicalDescription:
      'Primary + contingency pumping with check-valve isolation, freeze-conscious discharge routing, and basin geometry matched to inflow peaks and slab structure.',
    specs: [
      { label: 'Basin', value: '18″ × 24″ structural poly' },
      { label: 'Primary pump', value: '1/3 HP — 48 GPM @ 10′ head' },
      { label: 'Discharge', value: '1½″ PVC — freeze-guard exit' },
      { label: 'Backup', value: 'DC + charger (optional stack)' },
    ],
    icon: 'sump-pump',
    visualLabel: 'Sump chamber — cutaway schematic',
  },
  {
    id: 'window-wells',
    title: 'Window Well Repair',
    technicalDescription:
      'Rebuild of well structure, drainage interface, and wall joint continuity. Restores a drained, sealed reveal at below-grade openings.',
    specs: [
      { label: 'Shell', value: 'Galvanized steel / composite well' },
      { label: 'Drain tie', value: '4″ routed to weeping tile' },
      { label: 'Backfill', value: 'Clear stone — min. 12″ lift' },
      { label: 'Sealant', value: 'UV-stable flexible joint membrane' },
    ],
    icon: 'window-well',
    visualLabel: 'Well stack — sectional render',
  },
  {
    id: 'excavation',
    title: 'Excavation Work',
    technicalDescription:
      'Controlled trench exposure for exterior remediation: shoring as required, utility clearance, and specified backfill compaction to restore grade performance.',
    specs: [
      { label: 'Bench width', value: '≥ 24″ clear to footing' },
      { label: 'Spoil', value: 'Tracked — segregated topsoil' },
      { label: 'Backfill', value: 'Granular — lifts @ 8″ max' },
      { label: 'Compaction', value: 'Plate + jump — spec density' },
    ],
    icon: 'excavation',
    visualLabel: 'Trench geometry — site model',
  },
];

const END_DECK_SLIDE_INDEX = SHOWCASE_SECTIONS.length + 1;

const TYPE_MS = 38;

function useMatchMedia(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

function TerminalTypingTitle({
  text,
  active,
  reduceMotion,
  as: Tag = 'h2',
  id,
}: {
  text: string;
  active: boolean;
  reduceMotion: boolean;
  as?: 'h1' | 'h2';
  id?: string;
}) {
  const [display, setDisplay] = useState('');

  useEffect(() => {
    if (reduceMotion) {
      setDisplay(active ? text : '');
      return;
    }
    if (!active) {
      setDisplay('');
      return;
    }

    let cancelled = false;
    setDisplay('');

    const run = async () => {
      for (let i = 1; i <= text.length; i++) {
        if (cancelled) return;
        setDisplay(text.slice(0, i));
        await new Promise<void>((r) => setTimeout(r, TYPE_MS));
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [active, reduceMotion, text]);

  return (
    <Tag
      id={id}
      className="max-w-full overflow-x-auto font-mono text-2xl font-semibold tracking-tight text-npf-charcoal [scrollbar-width:none] [-ms-overflow-style:none] dark:text-zinc-100 sm:text-3xl md:text-4xl lg:text-[2.75rem] lg:leading-tight [&::-webkit-scrollbar]:hidden whitespace-nowrap"
    >
      <span className="text-[#BE1E2D]" aria-hidden>
        &gt;{' '}
      </span>
      <span>{display}</span>
      {!reduceMotion && active && display.length < text.length ? (
        <span className="ml-0.5 inline-block h-[1em] w-0.5 translate-y-0.5 animate-pulse bg-[#BE1E2D]" aria-hidden />
      ) : null}
    </Tag>
  );
}

function ShowcaseVisualPanel({
  icon,
  label,
  reduceMotion,
}: {
  icon: ServiceIconId;
  label: string;
  reduceMotion: boolean;
}) {
  return (
    <motion.div
      className={
        'relative flex aspect-[4/3] w-full max-w-xl items-center justify-center overflow-hidden rounded-2xl border border-[#BE1E2D]/25 ' +
        'bg-gradient-to-br from-white via-npf-surface to-zinc-100 shadow-[0_24px_64px_-28px_rgba(26,26,26,0.12),0_0_48px_-16px_rgba(190,30,45,0.18)] ' +
        'dark:from-zinc-900 dark:via-zinc-950 dark:to-black dark:shadow-[0_24px_64px_-28px_rgba(0,0,0,0.45),0_0_48px_-16px_rgba(190,30,45,0.22)] ' +
        'md:aspect-auto md:h-[min(36rem,52dvh)] md:max-w-none lg:h-[min(40rem,56dvh)]'
      }
      style={{ perspective: 1200 }}
      animate={
        reduceMotion
          ? undefined
          : {
              y: [0, -10, 0],
              rotateX: [0, 2.5, 0],
              rotateY: [0, -3, 0],
            }
      }
      transition={
        reduceMotion
          ? undefined
          : { duration: 10, repeat: Infinity, ease: 'easeInOut' }
      }
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.55] [background-image:linear-gradient(rgba(190,30,45,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(190,30,45,0.05)_1px,transparent_1px)] [background-size:32px_32px] dark:opacity-[0.35] dark:[background-image:linear-gradient(rgba(190,30,45,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(190,30,45,0.08)_1px,transparent_1px)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_115%,rgba(190,30,45,0.1),transparent_55%)]"
        aria-hidden
      />
      <div className="relative flex flex-col items-center gap-5 px-8 text-center">
        <div className="flex h-28 w-28 items-center justify-center rounded-2xl border border-[#BE1E2D]/35 bg-white text-[#BE1E2D] shadow-[0_8px_32px_-8px_rgba(190,30,45,0.25)] dark:bg-zinc-900 md:h-36 md:w-36">
          <ServiceIcon icon={icon} className="h-16 w-16 md:h-[4.5rem] md:w-[4.5rem]" />
        </div>
        <p className="max-w-xs font-mono text-[10px] uppercase tracking-[0.28em] text-npf-muted dark:text-zinc-400 sm:text-[11px]">
          {label}
        </p>
        <p className="font-mono text-xs text-npf-muted/90 dark:text-zinc-500">3D / render placeholder</p>
      </div>
    </motion.div>
  );
}

const DECK_TITLE = 'Service launch deck';

const tocBtnClass =
  'group flex w-full items-center gap-3 rounded-md border border-transparent px-2.5 py-2 text-left transition-colors ' +
  'hover:border-npf-border hover:bg-npf-surface/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#BE1E2D]/35 ' +
  'dark:hover:border-zinc-600 dark:hover:bg-zinc-800/80 dark:focus-visible:ring-[#BE1E2D]/40 sm:px-3 sm:py-2.5';

/** Mono slide index in a dark pill with white figures (TOC + fixed HUD). */
const SHOWCASE_INDEX_BADGE_SHARED =
  'inline-flex w-8 shrink-0 items-center justify-center rounded-md px-1 py-0.5 font-mono text-[10px] font-semibold tabular-nums tracking-wider text-white sm:w-9 sm:py-1 sm:text-[11px]';

const tocIndexClass = SHOWCASE_INDEX_BADGE_SHARED + ' bg-zinc-900 dark:bg-zinc-700';

const tocLabelClass =
  'min-w-0 flex-1 text-sm font-medium leading-snug text-npf-charcoal group-hover:text-[#BE1E2D] dark:text-zinc-100 dark:group-hover:text-[#f87171] sm:text-[15px]';

/** Below md, scroll-mt clears sticky nav; md+ deck pane sits under nav, so scroll-mt would inset snaps and add a gap. */
const SLIDE_SECTION_SHELL =
  'relative shrink-0 scroll-mt-[calc(5rem+1px)] border-b border-npf-border dark:border-zinc-800 sm:scroll-mt-[calc(7rem+1px)] md:scroll-mt-0 ' +
  'flex min-h-0 w-full flex-col overflow-hidden px-5 py-16 sm:px-8 md:h-full md:min-h-0 md:px-10 ' +
  'md:snap-start md:snap-always md:py-0 lg:px-14';

function SlideMapBackdrop() {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 z-0">
        <ServiceAreaBackdropMap />
      </div>
      <div
        className={
          'pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-white/96 via-white/88 to-white/72 ' +
          'md:bg-gradient-to-r md:from-white/[0.97] md:via-white/90 md:to-white/35 ' +
          'dark:from-zinc-950/94 dark:via-zinc-950/88 dark:to-zinc-950/72 ' +
          'dark:md:from-zinc-950/[0.96] dark:md:via-zinc-950/88 dark:md:to-zinc-950/38'
        }
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_90%_70%_at_50%_120%,rgba(190,30,45,0.06),transparent_55%)] dark:bg-[radial-gradient(ellipse_90%_70%_at_50%_120%,rgba(190,30,45,0.12),transparent_55%)]"
        aria-hidden
      />
    </>
  );
}

function ScrollForMoreCue({ inView, reduceMotion }: { inView: boolean; reduceMotion: boolean }) {
  return (
    <div
      className="pointer-events-none absolute bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 z-20 -translate-x-1/2 md:bottom-8"
      aria-hidden
    >
      <motion.div
        className="flex flex-col items-center gap-1"
        initial={false}
        animate={{ opacity: inView ? 1 : 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          className="flex flex-col items-center gap-0.5 text-npf-muted dark:text-zinc-400"
          animate={
            reduceMotion || !inView
              ? { y: 0 }
              : { y: [0, 8, 0] }
          }
          transition={
            reduceMotion || !inView
              ? { duration: 0 }
              : { duration: 2.2, repeat: Infinity, ease: 'easeInOut' }
          }
        >
          <span className="font-mono text-[9px] uppercase tracking-[0.32em] text-npf-muted/85 dark:text-zinc-400 sm:text-[10px]">
            Scroll for more
          </span>
          <FaChevronDown className="h-3 w-3 opacity-65 sm:h-3.5 sm:w-3.5" aria-hidden />
        </motion.div>
      </motion.div>
    </div>
  );
}

function DeckIntroSlide({
  titleId,
  reduceMotion,
  onJumpToSlide,
}: {
  titleId: string;
  reduceMotion: boolean;
  onJumpToSlide: (slideIndex: number) => void;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const mapBackdropDescId = useId();
  const tocHeadingId = useId();
  const inView = useInView(ref, {
    amount: 0.45,
    margin: '-12% 0px -12% 0px',
  });

  return (
    <section
      ref={ref}
      id="showcase-deck-intro"
      data-showcase-index={0}
      className={SLIDE_SECTION_SHELL}
      aria-describedby={mapBackdropDescId}
    >
      <p id={mapBackdropDescId} className="sr-only">
        A non-interactive map of the {SITE.region} service area is shown as the background of each slide in this deck.
      </p>
      <SlideMapBackdrop />
      <div className="relative z-10 flex min-h-0 w-full flex-1 flex-col justify-center">
        <div className="mx-auto w-full max-w-7xl">
          <div className="mx-auto grid min-w-0 max-w-3xl gap-8 text-center md:mx-0 md:max-w-none md:grid-cols-[minmax(0,1fr)_min(18rem,38%)] md:gap-10 md:text-left lg:grid-cols-[minmax(0,1fr)_min(20rem,34%)]">
            <div className="min-w-0 space-y-6">
              <TerminalTypingTitle
                as="h1"
                id={titleId}
                text={DECK_TITLE}
                active={inView}
                reduceMotion={reduceMotion}
              />
              <div className="space-y-4 border-t border-npf-border pt-6 dark:border-zinc-700">
                <h2 className="font-mono text-[10px] font-normal uppercase tracking-[0.35em] text-[#BE1E2D] sm:text-xs">
                  Technical brief
                </h2>
                <p className="text-sm leading-relaxed text-npf-muted dark:text-zinc-400 sm:text-base md:text-lg">
                  {SITE.shortTagline}
                </p>
              </div>
            </div>

            <nav
              className="min-w-0 rounded-xl border border-npf-border bg-white/80 p-4 text-left shadow-sm backdrop-blur-sm dark:border-zinc-700 dark:bg-zinc-900/75 sm:p-5"
              aria-labelledby={tocHeadingId}
            >
              <h2
                id={tocHeadingId}
                className="border-b border-npf-border/80 pb-3 font-mono text-[10px] font-semibold uppercase tracking-[0.28em] text-[#BE1E2D] dark:border-zinc-600/80 sm:text-[11px]"
              >
                Table of contents
              </h2>
              <ol className="mt-3 list-none space-y-0.5 p-0 sm:mt-4">
                {SHOWCASE_SECTIONS.map((section, i) => {
                  const slideIndex = i + 1;
                  const idxLabel = String(slideIndex).padStart(2, '0');
                  return (
                    <li key={section.id}>
                      <button
                        type="button"
                        className={tocBtnClass}
                        onClick={() => onJumpToSlide(slideIndex)}
                      >
                        <span className={tocIndexClass}>{idxLabel}</span>
                        <span className={tocLabelClass}>{section.title}</span>
                      </button>
                    </li>
                  );
                })}
                <li>
                  <button
                    type="button"
                    className={tocBtnClass}
                    onClick={() => onJumpToSlide(END_DECK_SLIDE_INDEX)}
                  >
                    <span className={tocIndexClass}>{String(END_DECK_SLIDE_INDEX).padStart(2, '0')}</span>
                    <span className={tocLabelClass}>{'Next steps & quote'}</span>
                  </button>
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>
      <ScrollForMoreCue inView={inView} reduceMotion={reduceMotion} />
    </section>
  );
}

function ServiceShowcaseSection({
  section,
  index,
  slideIndex,
  reduceMotion,
}: {
  section: ShowcaseSection;
  index: number;
  slideIndex: number;
  reduceMotion: boolean;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const inView = useInView(ref, {
    amount: 0.45,
    margin: '-12% 0px -12% 0px',
  });

  return (
    <section
      ref={ref}
      id={section.id}
      data-showcase-index={slideIndex}
      className={
        'relative shrink-0 overflow-hidden scroll-mt-[calc(5rem+1px)] border-b border-npf-border dark:border-zinc-800 sm:scroll-mt-[calc(7rem+1px)] md:scroll-mt-0 ' +
        'flex min-h-0 w-full flex-col px-5 py-14 sm:px-8 md:h-full md:min-h-0 md:px-10 md:py-0 ' +
        'md:snap-start md:snap-always lg:px-14'
      }
    >
      <SlideMapBackdrop />
      <div className="relative z-10 flex min-h-0 w-full flex-1 flex-col justify-center gap-10 md:gap-0">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-10 md:grid-cols-2 md:items-stretch md:gap-12 lg:gap-16">
          <div className="flex min-h-0 min-w-0 flex-col justify-center space-y-6 overflow-y-auto overscroll-y-contain md:space-y-8 md:pr-4">
            <div className="space-y-2">
              <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#BE1E2D] sm:text-xs">
                {`NPF // SVC_${String(index + 1).padStart(2, '0')}`}
              </p>
              <TerminalTypingTitle
                text={section.title}
                active={inView}
                reduceMotion={reduceMotion}
              />
            </div>
            <p className="max-w-xl text-sm leading-relaxed text-npf-muted dark:text-zinc-400 sm:text-base">
              {section.technicalDescription}
            </p>
            <div>
              <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-npf-muted dark:text-zinc-500 sm:text-xs">
                Spec sheet
              </p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
                {section.specs.map((row, i) => (
                  <motion.div
                    key={row.label}
                    className="rounded-lg border border-npf-border bg-white px-3 py-2.5 shadow-sm dark:border-zinc-600 dark:bg-zinc-900 sm:px-4 sm:py-3"
                    initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                    animate={
                      reduceMotion
                        ? { opacity: 1, y: 0 }
                        : inView
                          ? { opacity: 1, y: 0 }
                          : { opacity: 0, y: 18 }
                    }
                    transition={{
                      duration: 0.45,
                      delay: reduceMotion ? 0 : i * 0.08,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <p className="font-mono text-[10px] uppercase tracking-wider text-[#BE1E2D] sm:text-[11px]">
                      {row.label}
                    </p>
                    <p className="mt-1 font-mono text-xs text-npf-charcoal dark:text-zinc-200 sm:text-sm">{row.value}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex min-h-0 items-center justify-center md:justify-end">
            <ShowcaseVisualPanel icon={section.icon} label={section.visualLabel} reduceMotion={reduceMotion} />
          </div>
        </div>
      </div>
    </section>
  );
}

function DeckOutroSlide() {
  return (
    <section
      id="showcase-deck-outro"
      data-showcase-index={END_DECK_SLIDE_INDEX}
      aria-labelledby="deck-outro-heading"
      className={
        'relative shrink-0 overflow-hidden scroll-mt-[calc(5rem+1px)] border-b border-npf-border dark:border-zinc-800 sm:scroll-mt-[calc(7rem+1px)] md:scroll-mt-0 ' +
        'flex min-h-0 w-full flex-col px-5 py-14 sm:px-8 md:h-full md:min-h-0 md:px-10 md:py-0 ' +
        'md:snap-start md:snap-always lg:px-14'
      }
    >
      <SlideMapBackdrop />
      <div className="relative z-10 flex min-h-0 w-full flex-1 flex-col justify-center">
        <div className="mx-auto w-full max-w-2xl text-center md:text-left">
          <p
            id="deck-outro-heading"
            className="font-mono text-[10px] uppercase tracking-[0.28em] text-npf-muted dark:text-zinc-500 sm:text-xs"
          >
            End of deck
          </p>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-npf-muted dark:text-zinc-400 sm:text-base">
            Serving {SITE.region}. Call for scope verification and on-site assessment.
          </p>
          <Link
            to="/contact"
            className="mt-6 inline-flex min-h-11 items-center justify-center rounded-lg bg-[#BE1E2D] px-6 py-2.5 font-mono text-sm font-semibold text-white shadow-sm shadow-[#BE1E2D]/30 transition-[background-color,box-shadow,transform] duration-300 hover:bg-npf-red-dark hover:shadow-[0_16px_40px_-12px_rgba(190,30,45,0.45)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#BE1E2D] focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-zinc-950"
          >
            Get a quote
          </Link>
        </div>
      </div>
    </section>
  );
}

function SectionTrackerHUD({
  count,
  activeIndex,
  onSelect,
  reduceMotion,
}: {
  count: number;
  activeIndex: number;
  onSelect: (index: number) => void;
  reduceMotion: boolean;
}) {
  return (
    <nav
      className="pointer-events-auto fixed right-[max(0.75rem,env(safe-area-inset-right))] top-1/2 z-30 hidden -translate-y-1/2 flex-col items-end gap-0 md:flex lg:right-8"
      aria-label="Showcase slides"
    >
      {Array.from({ length: count }, (_, i) => {
        const active = i === activeIndex;
        return (
          <button
            key={i}
            type="button"
            className="group flex items-center gap-3 py-2 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#BE1E2D] focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-zinc-950"
            onClick={() => onSelect(i)}
            aria-current={active ? 'true' : undefined}
            aria-label={`Go to slide ${String(i).padStart(2, '0')}`}
          >
            <span
              className={
                SHOWCASE_INDEX_BADGE_SHARED +
                ' transition-[background-color,opacity] duration-300 ' +
                (active
                  ? 'bg-[#BE1E2D]'
                  : 'bg-zinc-900 dark:bg-zinc-700 group-hover:bg-zinc-800 dark:group-hover:bg-zinc-600')
              }
            >
              {String(i).padStart(2, '0')}
            </span>
            <span className="flex h-px w-10 items-center bg-npf-border dark:bg-zinc-700" aria-hidden>
              <motion.span
                className={
                  'h-px w-full origin-left bg-[#BE1E2D] ' +
                  (active ? 'shadow-[0_0_14px_rgba(190,30,45,0.85)]' : '')
                }
                initial={false}
                animate={{
                  scaleX: active ? 1 : 0.2,
                  opacity: active ? 1 : 0.35,
                }}
                transition={
                  reduceMotion ? { duration: 0 } : { duration: 0.35, ease: [0.22, 1, 0.36, 1] }
                }
              />
            </span>
          </button>
        );
      })}
    </nav>
  );
}

export function ServiceShowcase() {
  const reduceMotion = useReducedMotion() ?? false;
  const useSnapScroll = useMatchMedia('(min-width: 768px)');
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const headerId = useId();
  const location = useLocation();

  const lastSlideIndex = END_DECK_SLIDE_INDEX;

  const updateActiveFromScroll = useCallback(() => {
    const root = useSnapScroll ? scrollRef.current : null;
    if (useSnapScroll && root) {
      const { scrollTop, scrollHeight, clientHeight } = root;
      if (scrollHeight - scrollTop - clientHeight < 8) {
        setActiveIndex(lastSlideIndex);
        return;
      }
    }

    const sections = document.querySelectorAll<HTMLElement>('[data-showcase-index]');
    if (sections.length === 0) return;

    const rootRect = root?.getBoundingClientRect();
    const centerY = rootRect
      ? rootRect.top + rootRect.height * 0.42
      : window.innerHeight * 0.42;

    let best = 0;
    let bestDist = Infinity;
    sections.forEach((el) => {
      const idx = Number(el.dataset.showcaseIndex ?? '0');
      const r = el.getBoundingClientRect();
      const mid = r.top + r.height * 0.45;
      const d = Math.abs(mid - centerY);
      if (d < bestDist) {
        bestDist = d;
        best = idx;
      }
    });
    setActiveIndex(best);
  }, [useSnapScroll, lastSlideIndex]);

  useEffect(() => {
    const root = useSnapScroll ? scrollRef.current : window;
    if (!root) return;

    const onScroll = () => {
      window.requestAnimationFrame(updateActiveFromScroll);
    };

    updateActiveFromScroll();
    root.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      root.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [updateActiveFromScroll, useSnapScroll]);

  useEffect(() => {
    const raw = location.hash.replace(/^#/, '');
    if (!raw || !SHOWCASE_SECTIONS.some((s) => s.id === raw)) return;

    const el = document.getElementById(raw);
    if (!el) return;

    const behavior: ScrollBehavior = reduceMotion ? 'auto' : 'smooth';
    const run = () => el.scrollIntoView({ behavior, block: 'start' });

    run();
    const raf = window.requestAnimationFrame(run);
    const t = window.setTimeout(run, 120);
    return () => {
      window.cancelAnimationFrame(raf);
      window.clearTimeout(t);
    };
  }, [location.hash, location.pathname, reduceMotion, useSnapScroll]);

  const scrollToIndex = (index: number) => {
    const el = document.querySelector<HTMLElement>(`[data-showcase-index="${index}"]`);
    if (!el) return;
    el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  };

  const slideCount = SHOWCASE_SECTIONS.length + 2;

  return (
    <div className="relative bg-white text-npf-charcoal dark:bg-zinc-950 dark:text-zinc-100">
      <div
        ref={scrollRef}
        className={
          useSnapScroll
            ? 'npf-deck-scroll flex flex-col h-[calc(100dvh-5rem-1px)] snap-y snap-mandatory overflow-y-auto scroll-smooth motion-reduce:scroll-auto overscroll-y-auto sm:h-[calc(100dvh-7rem-1px)] md:h-[calc(100dvh-8rem-1px)] lg:h-[calc(100dvh-9rem-1px)]'
            : ''
        }
        aria-labelledby={headerId}
      >
        <DeckIntroSlide titleId={headerId} reduceMotion={reduceMotion} onJumpToSlide={scrollToIndex} />
        {SHOWCASE_SECTIONS.map((section, i) => (
          <ServiceShowcaseSection
            key={section.id}
            section={section}
            index={i}
            slideIndex={i + 1}
            reduceMotion={reduceMotion}
          />
        ))}
        <DeckOutroSlide />
      </div>

      <SectionTrackerHUD
        count={slideCount}
        activeIndex={activeIndex}
        onSelect={scrollToIndex}
        reduceMotion={reduceMotion}
      />
    </div>
  );
}
