import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { useCallback, useEffect, useId, useState } from 'react';
import { TESTIMONIALS } from '../content/siteCopy.ts';

const AUTO_MS = 6500;

export function TestimonialsSection() {
  const reduceMotion = useReducedMotion();
  const headingId = useId();
  const [index, setIndex] = useState(0);
  const n = TESTIMONIALS.length;

  const go = useCallback(
    (dir: -1 | 1) => {
      setIndex((i) => (i + dir + n) % n);
    },
    [n],
  );

  useEffect(() => {
    if (reduceMotion || n <= 1) return;
    const t = window.setInterval(() => setIndex((i) => (i + 1) % n), AUTO_MS);
    return () => window.clearInterval(t);
  }, [reduceMotion, n]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === 'ArrowRight') go(1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go]);

  const t = TESTIMONIALS[index];

  const slideTransition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.38, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <section
      className="border-b border-npf-border bg-npf-surface py-16 text-npf-charcoal sm:py-20 md:py-24"
      aria-labelledby={headingId}
      role="region"
      aria-roledescription="carousel"
    >
      <div className="mx-auto max-w-[88rem] px-5 sm:px-8">
        <div className="mb-10 flex flex-col gap-3 sm:mb-12 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#BE1E2D]">Testimonials</p>
            <h2 id={headingId} className="text-3xl font-bold tracking-tight text-npf-charcoal sm:text-4xl">
              What homeowners say
            </h2>
            <p className="max-w-xl text-sm text-npf-muted sm:text-base">
              Real feedback from Central Alberta — waterproofing, drainage, and foundation work done right.
            </p>
          </div>
          <div className="flex gap-2 md:pb-1">
            <button
              type="button"
              className="npf-sleek-lift-subtle inline-flex h-11 w-11 items-center justify-center rounded-lg border border-npf-border bg-white text-npf-charcoal shadow-sm hover:border-[#BE1E2D]/40 hover:bg-white hover:text-[#BE1E2D] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#BE1E2D]/40 active:scale-95"
              aria-label="Previous testimonial"
              onClick={() => go(-1)}
            >
              <ChevronLeft className="h-5 w-5" aria-hidden />
            </button>
            <button
              type="button"
              className="npf-sleek-lift-subtle inline-flex h-11 w-11 items-center justify-center rounded-lg border border-npf-border bg-white text-npf-charcoal shadow-sm hover:border-[#BE1E2D]/40 hover:bg-white hover:text-[#BE1E2D] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#BE1E2D]/40 active:scale-95"
              aria-label="Next testimonial"
              onClick={() => go(1)}
            >
              <ChevronRight className="h-5 w-5" aria-hidden />
            </button>
          </div>
        </div>

        <div className="npf-sleek-lift relative overflow-hidden rounded-xl border border-npf-border bg-white shadow-sm shadow-npf-charcoal/5 hover:border-[#BE1E2D]/20">
          <div className="relative min-h-[18rem] sm:min-h-[19rem] md:min-h-[17rem]">
            <AnimatePresence initial={false} mode="wait">
              <motion.article
                key={t.author + index}
                className="absolute inset-0 flex flex-col justify-center overflow-y-auto px-6 py-10 sm:px-10 sm:py-12 md:px-14 md:py-14"
                initial={reduceMotion ? false : { opacity: 0, x: 28 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, x: -22 }}
                transition={slideTransition}
              >
                <Quote
                  className="mb-5 h-9 w-9 text-[#BE1E2D]/35 sm:h-10 sm:w-10"
                  aria-hidden
                  strokeWidth={1.25}
                />
                <blockquote className="space-y-6">
                  <p
                    className="text-lg font-medium leading-relaxed text-npf-charcoal sm:text-xl md:text-2xl md:leading-snug"
                    aria-live="polite"
                  >
                    “{t.quote}”
                  </p>
                  <footer className="flex flex-col gap-0.5 border-t border-npf-border pt-5 sm:flex-row sm:items-baseline sm:gap-2">
                    <cite className="not-italic font-semibold text-npf-charcoal">{t.author}</cite>
                    <span className="hidden text-npf-muted sm:inline" aria-hidden>
                      ·
                    </span>
                    <span className="text-sm text-npf-muted">{t.detail}</span>
                  </footer>
                </blockquote>
              </motion.article>
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-6 flex justify-center gap-2" aria-label="Testimonial slides">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Show testimonial ${i + 1} of ${n}`}
              aria-current={i === index ? 'true' : undefined}
              className={`h-2.5 rounded-full transition-[width,transform,background-color,box-shadow] duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#BE1E2D]/40 ${
                i === index
                  ? 'w-8 bg-[#BE1E2D] shadow-[0_0_12px_rgba(190,30,45,0.4)]'
                  : 'w-2.5 bg-npf-border hover:w-3 hover:scale-125 hover:bg-[#BE1E2D]/35 hover:shadow-sm motion-reduce:hover:scale-100'
              }`}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
