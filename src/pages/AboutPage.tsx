import { Maximize2, Minimize2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ServiceAreaRadarMap } from '../components/ServiceAreaRadarMap.tsx';
import { SITE, serviceAreasSentence } from '../content/siteCopy.ts';

/** Aligns with deck / nav clearance patterns elsewhere in the app. */
const VIEWPORT_MAIN =
  'min-h-[calc(100dvh-5rem-1px)] sm:min-h-[calc(100dvh-7rem-1px)] md:min-h-[calc(100dvh-8rem-1px)] lg:min-h-[calc(100dvh-9rem-1px)]';

/** Sidebar scroll region — same vertical budget as the hero. */
const SIDEBAR_MAX_H =
  'max-h-[calc(100dvh-5rem-1px)] sm:max-h-[calc(100dvh-7rem-1px)] md:max-h-[calc(100dvh-8rem-1px)] lg:max-h-[calc(100dvh-9rem-1px)]';

/** Single sheet with internal dividers — no gap between sections */
const SHEET =
  'pointer-events-auto overflow-hidden rounded-xl border border-black/[0.08] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.06),0_4px_16px_-4px_rgba(0,0,0,0.12)] dark:border-zinc-700 dark:bg-zinc-900 dark:shadow-black/40';
const SEGMENT = 'p-5 sm:p-6';
const SEGMENT_DIVIDE = `${SEGMENT} border-t border-npf-border/60`;

const GALLERY_PLACEHOLDER_COUNT = 12;

const PANEL_EASE = 'transition-[max-width,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]';

const expandBtnClass =
  'npf-sleek-lift-subtle inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-npf-border bg-white px-2.5 py-1.5 font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-npf-charcoal shadow-sm ' +
  'hover:border-[#BE1E2D]/35 hover:text-[#BE1E2D] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#BE1E2D]/35 focus-visible:ring-offset-2 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:border-[#BE1E2D]/45 dark:focus-visible:ring-offset-zinc-900 sm:px-3 sm:text-[10px]';

export function AboutPage() {
  const [aboutExpanded, setAboutExpanded] = useState(false);
  const [galleryExpanded, setGalleryExpanded] = useState(false);
  const anyExpanded = aboutExpanded || galleryExpanded;

  useEffect(() => {
    if (!anyExpanded) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setAboutExpanded(false);
        setGalleryExpanded(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [anyExpanded]);

  return (
    <section
      aria-labelledby="about-page-heading"
      className={`relative isolate flex min-h-0 w-full flex-1 flex-col overflow-hidden border-b border-npf-border ${VIEWPORT_MAIN}`}
    >
      <p className="sr-only">
        A non-interactive map of the {SITE.region} service area is shown full screen behind the following
        information panels, with animated radar nodes indicating communities we serve.
      </p>

      <div className="absolute inset-0 z-0 min-h-0 min-w-0">
        <ServiceAreaRadarMap
          variant="backdrop"
          shellClassName="absolute inset-0 min-h-0 min-w-0"
          className="h-full w-full"
          initialViewState={{ zoom: 8.55 }}
        />
      </div>

      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-r from-black/45 via-black/15 to-transparent sm:from-black/40 sm:via-black/10"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_70%_70%_at_0%_0%,rgba(190,30,45,0.1),transparent_60%)]"
        aria-hidden
      />

      {anyExpanded ? (
        <button
          type="button"
          className="absolute inset-0 z-[11] cursor-default border-0 bg-black/40 backdrop-blur-[1px] transition-opacity motion-reduce:backdrop-blur-none"
          aria-label="Dismiss expanded panels"
          onClick={() => {
            setAboutExpanded(false);
            setGalleryExpanded(false);
          }}
        />
      ) : null}

      <div className="relative z-[12] flex min-h-0 min-w-0 flex-1 flex-col gap-4 md:flex-row md:items-stretch md:justify-between md:gap-0">
        <aside
          className={
            `relative flex min-h-0 w-full flex-col overflow-hidden py-4 pb-[max(1rem,env(safe-area-inset-bottom))] md:shrink-0 ${SIDEBAR_MAX_H} ${PANEL_EASE} ` +
            'pl-[max(1.25rem,env(safe-area-inset-left))] pr-3 sm:py-5 md:py-6 md:pr-4 ' +
            (anyExpanded ? (aboutExpanded ? 'z-[25]' : 'z-[20]') : 'z-10') +
            ' ' +
            (aboutExpanded
              ? 'max-w-[min(56rem,calc(100vw-2rem))] shadow-[8px_0_48px_-12px_rgba(0,0,0,0.35)] md:shadow-[12px_0_56px_-16px_rgba(0,0,0,0.38)] '
              : 'max-w-[min(22.5rem,calc(100vw-1.25rem))] sm:max-w-[24rem] md:max-w-[26rem] md:shadow-[6px_0_32px_-12px_rgba(0,0,0,0.22)] ')
          }
        >
          <div className={`${SHEET} flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden`}>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-npf-border [&::-webkit-scrollbar-track]:bg-transparent">
            <div className="flex min-h-full flex-col">
            <article className={SEGMENT}>
              <div className="flex items-start justify-between gap-3">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.28em] text-[#BE1E2D] sm:text-xs">
                  About us
                </p>
                <button
                  type="button"
                  className={expandBtnClass}
                  aria-expanded={aboutExpanded}
                  aria-controls="about-panel-content"
                  onClick={() => setAboutExpanded((v) => !v)}
                >
                  {aboutExpanded ? (
                    <Minimize2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden />
                  ) : (
                    <Maximize2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden />
                  )}
                  <span>{aboutExpanded ? 'Collapse' : 'Expand'}</span>
                </button>
              </div>
              <div id="about-panel-content">
                <h1
                  id="about-page-heading"
                  className={
                    'mt-2.5 text-balance font-bold tracking-tight text-npf-charcoal transition-[font-size] duration-300 dark:text-zinc-100 ' +
                    (aboutExpanded ? 'text-3xl sm:text-4xl lg:text-[2.65rem] lg:leading-tight' : 'text-2xl sm:text-3xl')
                  }
                >
                  Locally owned.{' '}
                  <span className="text-[#BE1E2D]">Built on trust.</span>
                </h1>
                <p
                  className={
                    'mt-3 leading-relaxed text-npf-muted transition-[font-size] duration-300 ' +
                    (aboutExpanded ? 'text-base sm:text-lg' : 'text-sm sm:text-base')
                  }
                >
                  {SITE.lead}
                </p>
              </div>
            </article>

            <div className="mt-6 flex min-h-0 flex-1 flex-col justify-start gap-4 sm:mt-8 sm:gap-5">
            <article className={SEGMENT_DIVIDE}>
              <h2 className="font-mono text-[10px] font-semibold uppercase tracking-[0.28em] text-npf-charcoal/80 dark:text-zinc-400 sm:text-xs">
                Who we are
              </h2>
              <p
                className={
                  'mt-3 leading-relaxed text-npf-muted ' +
                  (aboutExpanded ? 'text-base sm:text-[1.05rem]' : 'text-sm')
                }
              >
                {SITE.name} keeps your home dry and your foundation sound — from stopping water at the
                wall to moving soil when excavation is the right fix. We serve{' '}
                <strong className="font-medium text-npf-charcoal dark:text-zinc-100">{serviceAreasSentence()}</strong>.
              </p>
              <div className="mt-4 space-y-3 border-t border-npf-border/80 pt-4">
                {SITE.aboutHomeExtraParagraphs.map((paragraph, i) => (
                  <p
                    key={i}
                    className={
                      'leading-relaxed text-npf-muted ' +
                      (aboutExpanded ? 'text-base sm:text-[1.05rem]' : 'text-sm')
                    }
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </article>

            <article className={SEGMENT_DIVIDE}>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex rounded-full bg-[#BE1E2D]/10 px-2.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-[#BE1E2D] ring-1 ring-[#BE1E2D]/15 sm:text-[10px]">
                  {SITE.region}
                </span>
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-npf-muted sm:text-[10px]">
                  Map · view only
                </span>
              </div>
              <h2 className="mt-3 font-mono text-[10px] font-semibold uppercase tracking-[0.28em] text-npf-charcoal/80 dark:text-zinc-400 sm:text-xs">
                What we believe
              </h2>
              <p
                className={
                  'mt-2.5 font-medium leading-relaxed text-npf-charcoal dark:text-zinc-100 ' +
                  (aboutExpanded ? 'text-base sm:text-lg' : 'text-sm sm:text-base')
                }
              >
                {SITE.values}
              </p>
              <p
                className={
                  'mt-2.5 leading-relaxed text-npf-muted ' +
                  (aboutExpanded ? 'text-base' : 'text-sm')
                }
              >
                You get clear scope, fair pricing, and crews who show up when we say we will — whether
                it&apos;s waterproofing, crack repair, drainage, or a full exterior dig.
              </p>
              <p
                className={
                  'mt-2.5 leading-relaxed text-npf-muted ' +
                  (aboutExpanded ? 'text-base' : 'text-sm')
                }
              >
                {SITE.aboutHomeAsideDetail}
              </p>
              <Link
                className="npf-sleek-lift-subtle mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-lg border-2 border-[#BE1E2D] bg-[#BE1E2D] px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-[#BE1E2D]/20 transition-[background-color,box-shadow,transform] duration-300 hover:bg-npf-red-dark hover:shadow-[0_12px_28px_-10px_rgba(190,30,45,0.45)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#BE1E2D]/40 focus-visible:ring-offset-2 sm:w-auto"
                to="/services"
              >
                View services
              </Link>
            </article>
            <div className="min-h-0 flex-1" aria-hidden />
            </div>
            </div>
            </div>
          </div>
        </aside>

        <aside
          aria-labelledby="about-gallery-heading"
          className={
            `relative flex min-h-0 w-full flex-col overflow-hidden py-4 pb-[max(1rem,env(safe-area-inset-bottom))] md:ml-auto md:shrink-0 ${SIDEBAR_MAX_H} ${PANEL_EASE} ` +
            'pl-3 pr-[max(1.25rem,env(safe-area-inset-right))] sm:py-5 md:py-6 md:pl-4 ' +
            (anyExpanded ? (galleryExpanded ? 'z-[25]' : 'z-[20]') : 'z-10') +
            ' ' +
            (galleryExpanded
              ? 'max-w-[min(56rem,calc(100vw-2rem))] shadow-[-8px_0_48px_-12px_rgba(0,0,0,0.35)] md:shadow-[-12px_0_56px_-16px_rgba(0,0,0,0.38)] '
              : 'max-w-[min(22.5rem,calc(100vw-1.25rem))] sm:max-w-[24rem] md:max-w-[26rem] md:shadow-[-6px_0_32px_-12px_rgba(0,0,0,0.22)] ')
          }
        >
          <div className={`${SHEET} flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden`}>
            <div className={`${SEGMENT} shrink-0`}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.28em] text-[#BE1E2D] sm:text-xs">
                    Gallery
                  </p>
                  <h2
                    id="about-gallery-heading"
                    className={
                      'mt-2.5 text-balance font-bold tracking-tight text-npf-charcoal transition-[font-size] duration-300 dark:text-zinc-100 ' +
                      (galleryExpanded ? 'text-2xl sm:text-3xl lg:text-4xl' : 'text-xl sm:text-2xl')
                    }
                  >
                    On the job
                  </h2>
                </div>
                <button
                  type="button"
                  className={expandBtnClass}
                  aria-expanded={galleryExpanded}
                  aria-controls="about-gallery-panel-content"
                  onClick={() => setGalleryExpanded((v) => !v)}
                >
                  {galleryExpanded ? (
                    <Minimize2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden />
                  ) : (
                    <Maximize2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden />
                  )}
                  <span>{galleryExpanded ? 'Collapse' : 'Expand'}</span>
                </button>
              </div>
              <p
                id="about-gallery-panel-content"
                className={
                  'mt-2 leading-relaxed text-npf-muted ' +
                  (galleryExpanded ? 'text-base sm:text-[1.05rem]' : 'text-sm')
                }
              >
                Project photos and site work — placeholders until your gallery media is ready.
              </p>
            </div>
            <div
              className="flex min-h-0 flex-1 flex-col border-t border-npf-border/60"
              aria-label="Gallery image list"
            >
              <div className="shrink-0 px-5 pb-2 pt-4 sm:px-6 sm:pb-2 sm:pt-5">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-npf-charcoal/70 dark:text-zinc-400 sm:text-[11px]">
                  Placeholders — scroll
                </p>
              </div>
              <div
                className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-5 pb-5 pt-0 [scrollbar-width:thin] sm:px-6 sm:pb-6 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-npf-border [&::-webkit-scrollbar-track]:bg-transparent"
              >
                <ul
                  className={
                    'grid gap-3 ' +
                    (galleryExpanded
                      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                      : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-1')
                  }
                  role="list"
                >
                  {Array.from({ length: GALLERY_PLACEHOLDER_COUNT }, (_, i) => i + 1).map((n) => (
                    <li key={n}>
                      <div
                        className={
                          'flex aspect-[4/3] w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-npf-border/90 ' +
                          'bg-[linear-gradient(145deg,color-mix(in_srgb,var(--color-npf-surface)_88%,white),color-mix(in_srgb,var(--color-npf-border)_12%,white))] px-3 py-4 text-center'
                        }
                      >
                        <span
                          className="font-mono text-[9px] font-semibold uppercase tracking-[0.24em] text-npf-muted sm:text-[10px]"
                          aria-hidden
                        >
                          IMG_{String(n).padStart(2, '0')}
                        </span>
                        <span
                          className={
                            'text-npf-muted ' + (galleryExpanded ? 'text-sm sm:text-base' : 'text-xs')
                          }
                        >
                          Photo placeholder
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
