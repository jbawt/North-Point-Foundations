import { motion, useInView } from 'framer-motion';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type RefObject,
} from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaChevronDown } from 'react-icons/fa6';
import { SITE } from '../content/siteCopy.ts';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion.ts';
import { ServiceAreaRadarMap } from './ServiceAreaRadarMap.lazy.tsx';

type SpecRow = { label: string; value: string };

type ShowcaseSection = {
  id: string;
  title: string;
  technicalDescription: string;
  specs: SpecRow[];
};

/** Technical “spec sheet” + copy aligned to `SITE.services` order */
const SHOWCASE_SECTIONS: ShowcaseSection[] = [
  {
    id: 'exterior-waterproofing',
    title: 'Exterior Waterproofing',
    technicalDescription:
      'Below-grade envelope assembly: membrane continuity at the wall–soil interface. Engineered for freeze–thaw cycling and capillary break where the wall meets soil.',
    specs: [
      { label: 'Membrane', value: 'Blue skin WP 200' },
      { label: 'Warranty', value: '25-Year Transferable' },
      { label: 'Design load', value: 'Below-grade envelope continuity' },
    ],
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
  },
  {
    id: 'weeping-tile',
    title: 'Weeping Tile Install',
    technicalDescription:
      'Footing-level perimeter collector with continuous slope and discharge to sump or daylight. Relieves hydrostatic head; cleanouts when specified.',
    specs: [
      { label: 'Pipe', value: '4″ perforated HDPE — socked' },
      { label: 'Slope', value: '≥ 1/8″ per ft to discharge' },
      { label: 'Bedding', value: '8–12″ clear stone bed' },
      { label: 'Access', value: 'Inline cleanouts optional' },
    ],
  },
  {
    id: 'sump-systems',
    title: 'Sump Pump Systems',
    technicalDescription:
      'Primary + contingency pumping with check-valve isolation and basin geometry matched to inflow peaks and slab structure.',
    specs: [
      { label: 'Basin', value: '18″ × 24″ structural poly' },
      { label: 'Primary pump', value: '1/3 HP — 48 GPM @ 10′ head' },
      { label: 'Discharge', value: '1½″ PVC' },
      { label: 'Backup', value: 'DC + charger (optional stack)' },
    ],
  },
  {
    id: 'window-wells',
    title: 'Window Well Repair',
    technicalDescription:
      'Rebuild of well structure, drainage interface, and wall joint continuity. Restores a drained reveal at below-grade openings.',
    specs: [
      { label: 'Shell', value: 'Galvanized steel' },
      { label: 'Drain tie', value: '4″ routed to weeping tile' },
      { label: 'Backfill', value: 'Clear stone — min. 12″ lift' },
    ],
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
  },
];

const END_DECK_SLIDE_INDEX = SHOWCASE_SECTIONS.length + 1;

const TYPE_MS = 38;

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

const DECK_TITLE = 'Service launch deck';

/** Labels for the fixed HUD (same order as `data-showcase-index` 0…n). */
const SHOWCASE_HUD_LABELS: readonly string[] = [
  DECK_TITLE,
  ...SHOWCASE_SECTIONS.map((s) => s.title),
  'Next steps & quote',
];

/** Mono slide index in a dark pill with white figures (fixed HUD). */
const SHOWCASE_INDEX_BADGE_SHARED =
  'inline-flex w-8 shrink-0 items-center justify-center rounded-md px-1 py-0.5 font-mono text-[10px] font-semibold tabular-nums tracking-wider text-white sm:w-9 sm:py-1 sm:text-[11px]';

/**
 * No scroll-margin: it breaks vertical scroll-snap inside this deck (previous slide peeks in when
 * swiping down). The deck scroller already clears the nav via its fixed height; hash jumps use this
 * container as the scrollport. `snap-end` lands each slide with its bottom edge flush to the deck
 * (better handoff when advancing to the next slide / below-the-fold content).
 */
const SLIDE_SECTION_SHELL =
  'relative shrink-0 snap-end snap-always scroll-mt-0 border-b border-npf-border dark:border-zinc-800 ' +
  'flex min-h-full w-full flex-col overflow-hidden px-5 py-16 sm:px-8 md:h-full md:min-h-0 md:px-10 md:py-0 lg:px-14';

/** Framer `useInView` expects `root` as a ref; `root.current` is the scrollport (see framer-motion use-in-view). */
const DeckScrollRootRefContext = createContext<RefObject<HTMLDivElement | null> | null>(null);

function useDeckScrollRootRef() {
  return useContext(DeckScrollRootRefContext);
}

/** Per-slide readability overlays only. One shared `ServiceAreaRadarMap` sits behind the whole deck. */
function SlideGradientOverlays() {
  return (
    <>
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
  /** Mobile / &lt;md: compact jump controls (fixed HUD is hidden there). */
  onJumpToSlide: (index: number) => void;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const mapBackdropDescId = useId();
  const deckScrollRootRef = useDeckScrollRootRef();
  const inView = useInView(ref, {
    amount: 0.45,
    margin: '-12% 0px -12% 0px',
    root: deckScrollRootRef ?? undefined,
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
        A non-interactive map of the {SITE.region} service area is shown as the background of this deck.
        Use the numbered controls on the right to jump to a slide; hover or focus a control to see its title.
      </p>
      <SlideGradientOverlays />
      <div className="relative z-10 flex min-h-0 w-full flex-1 flex-col justify-center">
        <div className="mx-auto w-full max-w-7xl">
          <div className="mx-auto min-w-0 max-w-3xl space-y-6 text-center md:mx-0 md:max-w-2xl md:text-left lg:max-w-3xl">
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

            <nav
              className="border-t border-npf-border pt-6 dark:border-zinc-700 md:hidden"
              aria-label="Jump to slide"
            >
              <p className="mb-3 text-center font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-npf-muted dark:text-zinc-500">
                Slides
              </p>
              <div className="flex max-w-full flex-wrap justify-center gap-2">
                {SHOWCASE_HUD_LABELS.map((label, i) => (
                  <button
                    key={i}
                    type="button"
                    className={
                      'rounded-md border border-npf-border bg-white/90 px-2.5 py-1.5 font-mono text-[10px] font-semibold tabular-nums text-npf-charcoal ' +
                      'shadow-sm transition-colors hover:border-[#BE1E2D]/40 hover:text-[#BE1E2D] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#BE1E2D]/35 ' +
                      'dark:border-zinc-600 dark:bg-zinc-900/90 dark:text-zinc-100 dark:hover:border-[#BE1E2D]/45'
                    }
                    onClick={() => onJumpToSlide(i)}
                    aria-label={`Go to ${label}`}
                  >
                    {String(i).padStart(2, '0')}
                  </button>
                ))}
              </div>
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
  const deckScrollRootRef = useDeckScrollRootRef();
  const inView = useInView(ref, {
    amount: 0.45,
    margin: '-12% 0px -12% 0px',
    root: deckScrollRootRef ?? undefined,
  });

  return (
    <section
      ref={ref}
      id={section.id}
      data-showcase-index={slideIndex}
      className={
        'relative shrink-0 snap-end snap-always overflow-x-clip scroll-mt-0 border-b border-npf-border dark:border-zinc-800 ' +
        'flex min-h-full w-full flex-col px-5 py-14 sm:px-8 md:px-10 md:py-0 lg:px-14'
      }
    >
      <SlideGradientOverlays />
      <div className="relative z-10 flex w-full flex-1 flex-col justify-center gap-10 md:gap-0">
        <div className="mx-auto w-full max-w-7xl">
          <div className="flex min-w-0 max-w-3xl flex-col justify-center space-y-6 md:space-y-8 lg:max-w-4xl">
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
        'relative shrink-0 snap-end snap-always overflow-x-clip scroll-mt-0 border-b border-npf-border dark:border-zinc-800 ' +
        'flex min-h-full w-full flex-col px-5 py-14 sm:px-8 md:px-10 md:py-0 lg:px-14'
      }
    >
      <SlideGradientOverlays />
      <div className="relative z-10 flex w-full flex-1 flex-col justify-center">
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
  labels,
  activeIndex,
  onSelect,
  reduceMotion,
  expandAllLabels,
}: {
  labels: readonly string[];
  activeIndex: number;
  onSelect: (index: number) => void;
  reduceMotion: boolean;
  /** When true (intro slide), every row shows its title; otherwise hover/focus only. */
  expandAllLabels: boolean;
}) {
  return (
    <nav
      className="pointer-events-auto fixed right-[max(0.75rem,env(safe-area-inset-right))] top-1/2 z-30 hidden -translate-y-1/2 flex-col items-end gap-0 md:flex lg:right-8"
      aria-label="Showcase slides and table of contents"
    >
      {labels.map((label, i) => {
        const active = i === activeIndex;
        return (
          <button
            key={i}
            type="button"
            className={
              'group flex max-w-[min(100vw-1.5rem,22rem)] items-center justify-end gap-3 py-2 text-left ' +
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#BE1E2D] focus-visible:ring-offset-2 ' +
              'focus-visible:ring-offset-white dark:focus-visible:ring-offset-zinc-950'
            }
            onClick={(e) => {
              onSelect(i);
              e.currentTarget.blur();
            }}
            aria-current={active ? 'true' : undefined}
            aria-label={`Go to ${label}`}
          >
                       <span
              className={
                'min-w-0 shrink truncate text-right text-sm font-medium leading-snug text-npf-charcoal transition-[max-width,opacity] ease-[cubic-bezier(0.22,1,0.36,1)] dark:text-zinc-100 ' +
                (reduceMotion ? '' : 'duration-300 ') +
                'motion-reduce:transition-none ' +
                (expandAllLabels
                  ? 'max-w-[min(12.5rem,calc(100vw-5.5rem))] opacity-100'
                  : 'max-w-0 overflow-hidden opacity-0 ' +
                    'group-hover:max-w-[min(12.5rem,calc(100vw-5.5rem))] group-hover:opacity-100 ' +
                    'group-focus-within:max-w-[min(12.5rem,calc(100vw-5.5rem))] group-focus-within:opacity-100')
              }
            >
              {label}
            </span>
            <span className="flex h-px w-10 shrink-0 items-center bg-npf-border dark:bg-zinc-700" aria-hidden>
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
            <span
              className={
                SHOWCASE_INDEX_BADGE_SHARED +
                ' transition-[background-color,opacity] duration-300 motion-reduce:transition-none ' +
                (active
                  ? 'bg-[#BE1E2D]'
                  : 'bg-zinc-900 dark:bg-zinc-700 group-hover:bg-zinc-800 dark:group-hover:bg-zinc-600')
              }
            >
              {String(i).padStart(2, '0')}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

export function ServiceShowcase() {
  const reduceMotion = usePrefersReducedMotion();
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const headerId = useId();
  const location = useLocation();

  const lastSlideIndex = END_DECK_SLIDE_INDEX;

  const updateActiveFromScroll = useCallback(() => {
    const root = scrollRef.current;
    if (root) {
      const { scrollTop, scrollHeight, clientHeight } = root;
      if (scrollHeight - scrollTop - clientHeight < 8) {
        setActiveIndex(lastSlideIndex);
        return;
      }
    }

    const sections = document.querySelectorAll<HTMLElement>('[data-showcase-index]');
    if (sections.length === 0) return;

    const rootRect = root?.getBoundingClientRect();
    const portBottom = rootRect ? rootRect.bottom : window.innerHeight;

    let best = 0;
    let bestDist = Infinity;
    sections.forEach((el) => {
      const idx = Number(el.dataset.showcaseIndex ?? '0');
      const r = el.getBoundingClientRect();
      const d = Math.abs(r.bottom - portBottom);
      if (d < bestDist) {
        bestDist = d;
        best = idx;
      }
    });
    setActiveIndex(best);
  }, [lastSlideIndex]);

  useEffect(() => {
    const root = scrollRef.current;
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
  }, [updateActiveFromScroll]);

  useEffect(() => {
    const raw = location.hash.replace(/^#/, '');
    if (!raw || !SHOWCASE_SECTIONS.some((s) => s.id === raw)) return;

    const el = document.getElementById(raw);
    if (!el) return;

    const behavior: ScrollBehavior = reduceMotion ? 'auto' : 'smooth';
    const run = () => el.scrollIntoView({ behavior, block: 'end' });

    run();
    const raf = window.requestAnimationFrame(run);
    const t = window.setTimeout(run, 120);
    return () => {
      window.cancelAnimationFrame(raf);
      window.clearTimeout(t);
    };
  }, [location.hash, location.pathname, reduceMotion]);

  const scrollToIndex = (index: number) => {
    const el = document.querySelector<HTMLElement>(`[data-showcase-index="${index}"]`);
    if (!el) return;
    el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'end' });
  };

  return (
    <div className="relative flex min-h-0 flex-1 flex-col bg-white text-npf-charcoal dark:bg-zinc-950 dark:text-zinc-100">
      <div className="relative min-h-0 flex-1">
        <div className="pointer-events-none absolute inset-0 z-0">
          <ServiceAreaRadarMap
            variant="backdrop"
            shellClassName="absolute inset-0 min-h-0 min-w-0"
            className="h-full w-full"
          />
        </div>
        <DeckScrollRootRefContext.Provider value={scrollRef}>
          <div
            ref={scrollRef}
            className={
              'npf-deck-scroll relative z-10 flex h-[calc(100dvh-5rem-1px)] w-full flex-col snap-y snap-mandatory overflow-y-auto overscroll-y-auto scroll-smooth motion-reduce:scroll-auto sm:h-[calc(100dvh-7rem-1px)] md:h-[calc(100dvh-8rem-1px)] lg:h-[calc(100dvh-9rem-1px)]'
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
        </DeckScrollRootRefContext.Provider>
      </div>

      <SectionTrackerHUD
        labels={SHOWCASE_HUD_LABELS}
        activeIndex={activeIndex}
        onSelect={scrollToIndex}
        reduceMotion={reduceMotion}
        expandAllLabels={activeIndex === 0}
      />
    </div>
  );
}
