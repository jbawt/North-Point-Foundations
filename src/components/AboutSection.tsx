import { motion, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { SITE } from '../content/siteCopy.ts';

const SLIDE_TRANSITION = { duration: 0.62, ease: [0.22, 1, 0.36, 1] as const };

/** Time between automatic slide changes (disabled when reduced motion is on). */
const AUTOPLAY_MS = 7500;

/** Shared min height so both carousel panels match the About card footprint. */
const ABOUT_CARD_MIN_H = 'min-h-[32rem] sm:min-h-[30rem] md:min-h-[28rem]';
const ABOUT_CARD_PANEL = `${ABOUT_CARD_MIN_H} flex flex-col`;

type Slide = 0 | 1;

export function AboutSection() {
  const reduceMotion = useReducedMotion();
  const carouselId = useId();
  const [active, setActive] = useState<Slide>(0);
  const pauseAutoplayRef = useRef(false);

  useEffect(() => {
    if (reduceMotion) return;
    const id = window.setInterval(() => {
      if (pauseAutoplayRef.current) return;
      setActive((s) => (s === 0 ? 1 : 0));
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [active, reduceMotion]);

  const go = useCallback((next: Slide) => {
    setActive(next);
  }, []);

  const goPrev = useCallback(() => {
    setActive((s) => (s === 0 ? 1 : 0));
  }, []);

  const goNext = useCallback(() => {
    setActive((s) => (s === 0 ? 1 : 0));
  }, []);

  const transition = reduceMotion ? { duration: 0.15, ease: 'easeOut' as const } : SLIDE_TRANSITION;

  const cardState = (slide: Slide) => {
    const isFront = active === slide;
    if (isFront) {
      return {
        x: 0,
        y: 0,
        z: 56,
        scale: 1,
        rotate: 0,
        zIndex: 2,
        opacity: 1,
        filter: 'brightness(1)',
      };
    }
    return {
      x: -36,
      y: 26,
      z: 0,
      scale: 0.92,
      rotate: -2.2,
      zIndex: 1,
      opacity: 0.88,
      filter: 'brightness(0.96)',
    };
  };

  return (
    <section
      className="relative overflow-x-clip overflow-y-visible border-b border-npf-border py-16 text-npf-charcoal sm:py-20 md:py-24"
      aria-labelledby="about-section-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white via-npf-surface to-[color-mix(in_srgb,var(--color-npf-border)_35%,var(--color-npf-surface))]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.55]"
        aria-hidden
        style={{
          backgroundImage: `radial-gradient(ellipse 90% 60% at 10% 0%, rgba(190, 30, 45, 0.07), transparent 55%),
            radial-gradient(ellipse 70% 50% at 90% 100%, rgba(26, 26, 26, 0.04), transparent 50%)`,
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        aria-hidden
        style={{
          backgroundImage: `linear-gradient(rgba(26,26,26,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(26,26,26,0.06) 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative mx-auto max-w-[88rem] px-5 sm:px-8">
        <p id={`${carouselId}-hint`} className="sr-only">
          Two stacked cards: About us and Why homeowners choose us. The front card changes
          automatically every few seconds. Use the tabs or arrow buttons to switch manually.
          Automatic rotation pauses while the pointer is over this area or while keyboard focus is
          inside it.
        </p>

        <div
          className="mx-auto w-full max-w-3xl lg:max-w-4xl"
          onMouseEnter={() => {
            pauseAutoplayRef.current = true;
          }}
          onMouseLeave={() => {
            pauseAutoplayRef.current = false;
          }}
          onFocusCapture={() => {
            pauseAutoplayRef.current = true;
          }}
          onBlurCapture={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
              pauseAutoplayRef.current = false;
            }
          }}
        >
          <div
            className="relative w-full"
            style={{ perspective: 1400 }}
            aria-describedby={`${carouselId}-hint`}
          >
            <div
              className={`relative isolate ${ABOUT_CARD_MIN_H}`}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <motion.div
                id={`${carouselId}-panel-0`}
                className={`absolute left-0 right-0 top-0 mx-auto w-full max-w-full origin-center rounded-2xl border border-npf-border/90 bg-white/95 p-6 shadow-[0_20px_50px_-24px_rgba(26,26,26,0.18)] backdrop-blur-sm sm:p-8 md:p-10 ${ABOUT_CARD_PANEL}`}
                initial={false}
                animate={cardState(0)}
                transition={transition}
                style={{
                  pointerEvents: active === 0 ? 'auto' : 'none',
                  transformStyle: 'preserve-3d',
                }}
                aria-hidden={active !== 0}
                role="tabpanel"
                aria-labelledby={`${carouselId}-trigger-0`}
              >
                <div
                  className="absolute left-6 top-0 h-1 w-16 rounded-b-full bg-[#BE1E2D] shadow-[0_2px_12px_rgba(190,30,45,0.45)] sm:left-8 md:left-10"
                  aria-hidden
                />
                <div className="space-y-4 pt-2">
                  <p>
                    <span className="inline-flex rounded-full bg-[#BE1E2D]/[0.1] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#BE1E2D] ring-1 ring-[#BE1E2D]/15">
                      About us
                    </span>
                  </p>
                  <h2
                    id="about-section-heading"
                    className="text-balance text-3xl font-bold tracking-tight text-npf-charcoal sm:text-4xl lg:text-[2.35rem] lg:leading-[1.15]"
                  >
                    Locally owned.{' '}
                    <span className="relative inline-block text-[#BE1E2D]">
                      <span className="relative z-10">Built on trust.</span>
                      <span
                        className="absolute -bottom-0.5 left-0 right-0 z-0 h-2.5 rounded-sm bg-[#BE1E2D]/[0.14]"
                        aria-hidden
                      />
                    </span>
                  </h2>
                  <div className="space-y-3.5 border-t border-npf-border/80 pt-5">
                    <p className="text-sm leading-relaxed text-npf-muted sm:text-base">{SITE.lead}</p>
                    {SITE.aboutHomeExtraParagraphs.map((paragraph, i) => (
                      <p key={i} className="text-sm leading-relaxed text-npf-muted sm:text-base">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </motion.div>

              <motion.div
                id={`${carouselId}-panel-1`}
                className={`absolute left-0 right-0 top-0 mx-auto w-full max-w-full origin-center rounded-2xl border border-npf-border/90 bg-white/95 p-6 shadow-[0_20px_50px_-24px_rgba(26,26,26,0.18)] backdrop-blur-sm sm:p-8 md:p-10 ${ABOUT_CARD_PANEL}`}
                initial={false}
                animate={cardState(1)}
                transition={transition}
                style={{
                  pointerEvents: active === 1 ? 'auto' : 'none',
                  transformStyle: 'preserve-3d',
                }}
                aria-hidden={active !== 1}
                role="tabpanel"
                aria-labelledby={`${carouselId}-trigger-1`}
              >
                <div
                  className="absolute left-6 top-0 h-1 w-16 rounded-b-full bg-[#BE1E2D] shadow-[0_2px_12px_rgba(190,30,45,0.45)] sm:left-8 md:left-10"
                  aria-hidden
                />
                <div className="flex min-h-0 flex-1 flex-col justify-between gap-6">
                  <div className="min-w-0 space-y-4 pt-2">
                    <p>
                      <span className="inline-flex rounded-full bg-[#BE1E2D]/[0.1] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#BE1E2D] ring-1 ring-[#BE1E2D]/15">
                        Why choose us
                      </span>
                    </p>
                    <h2 className="text-balance text-3xl font-bold tracking-tight text-npf-charcoal sm:text-4xl lg:text-[2.35rem] lg:leading-[1.15]">
                      Honest pricing.{' '}
                      <span className="relative inline-block text-[#BE1E2D]">
                        <span className="relative z-10">Reliable service.</span>
                        <span
                          className="absolute -bottom-0.5 left-0 right-0 z-0 h-2.5 rounded-sm bg-[#BE1E2D]/[0.14]"
                          aria-hidden
                        />
                      </span>
                    </h2>
                    <div className="space-y-3.5 border-t border-npf-border/80 pt-5">
                      <p className="text-sm font-medium leading-relaxed text-npf-charcoal sm:text-base">
                        {SITE.values}
                      </p>
                      <p className="text-sm leading-relaxed text-npf-muted sm:text-base">
                        Clear scope, fair pricing, and crews who show up when we say we will — whether
                        it&apos;s waterproofing, crack repair, drainage, or a full exterior dig.
                      </p>
                      <p className="text-sm leading-relaxed text-npf-muted sm:text-base">
                        {SITE.aboutHomeAsideDetail}
                      </p>
                    </div>
                  </div>
                  <Link
                    className="inline-flex min-h-11 w-full items-center justify-center rounded-xl border-2 border-[#BE1E2D] bg-[#BE1E2D] px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#BE1E2D]/25 transition hover:bg-[#a01824] hover:shadow-lg hover:shadow-[#BE1E2D]/30 active:translate-y-px focus:outline-none focus-visible:ring-2 focus-visible:ring-[#BE1E2D]/40 focus-visible:ring-offset-2 sm:w-auto"
                    to="/about"
                    tabIndex={active === 1 ? 0 : -1}
                  >
                    Read our full story
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            <button
              type="button"
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-npf-border bg-white text-npf-charcoal shadow-sm transition hover:border-npf-charcoal/25 hover:bg-npf-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-[#BE1E2D]/35 focus-visible:ring-offset-2"
              onClick={goPrev}
              aria-label="Show the other card"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden />
            </button>

            <div
              role="tablist"
              aria-label="Choose which card is in front"
              className="flex items-center gap-2 rounded-full border border-npf-border bg-white/95 p-1 shadow-sm"
            >
              <button
                type="button"
                role="tab"
                id={`${carouselId}-trigger-0`}
                onClick={() => go(0)}
                aria-selected={active === 0}
                aria-controls={`${carouselId}-panel-0`}
                className={`rounded-full px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition sm:px-4 ${
                  active === 0
                    ? 'bg-npf-charcoal text-white shadow-sm'
                    : 'text-npf-muted hover:bg-npf-surface hover:text-npf-charcoal'
                }`}
              >
                About us
              </button>
              <button
                type="button"
                role="tab"
                id={`${carouselId}-trigger-1`}
                onClick={() => go(1)}
                aria-selected={active === 1}
                aria-controls={`${carouselId}-panel-1`}
                className={`rounded-full px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition sm:px-4 ${
                  active === 1
                    ? 'bg-[#BE1E2D] text-white shadow-sm shadow-[#BE1E2D]/20'
                    : 'text-npf-muted hover:bg-npf-surface hover:text-npf-charcoal'
                }`}
              >
                Why choose us
              </button>
            </div>

            <button
              type="button"
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-npf-border bg-white text-npf-charcoal shadow-sm transition hover:border-npf-charcoal/25 hover:bg-npf-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-[#BE1E2D]/35 focus-visible:ring-offset-2"
              onClick={goNext}
              aria-label="Show the other card"
            >
              <ChevronRight className="h-5 w-5" aria-hidden />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
