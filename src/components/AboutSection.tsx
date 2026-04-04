import { Link } from 'react-router-dom';
import { SITE } from '../content/siteCopy.ts';

export function AboutSection() {
  return (
    <section
      className="relative overflow-hidden border-b border-npf-border py-16 text-npf-charcoal sm:py-20 md:py-24"
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
        <div className="grid gap-8 md:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] md:items-stretch md:gap-10 lg:gap-12">
          <div className="relative flex flex-col rounded-2xl border border-npf-border/90 bg-white/95 p-6 shadow-[0_20px_50px_-24px_rgba(26,26,26,0.18)] backdrop-blur-sm sm:p-8 md:p-10">
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
          </div>

          <div className="flex flex-col justify-between gap-6 rounded-2xl border border-[#BE1E2D]/[0.18] bg-gradient-to-br from-white via-white to-[#BE1E2D]/[0.04] p-6 shadow-[0_16px_40px_-20px_rgba(190,30,45,0.2)] sm:p-8 md:p-9">
            <div className="space-y-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#BE1E2D]/90">Why homeowners choose us</p>
              <div className="space-y-3 rounded-xl border border-npf-border/60 bg-white/80 p-4 shadow-sm sm:p-5">
                <p className="text-sm font-semibold leading-relaxed text-npf-charcoal sm:text-base">{SITE.values}</p>
                <p className="text-sm leading-relaxed text-npf-muted sm:text-base">
                  Clear scope, fair pricing, and crews who show up when we say we will — whether it&apos;s
                  waterproofing, crack repair, drainage, or a full exterior dig.
                </p>
                <p className="text-sm leading-relaxed text-npf-muted sm:text-base">{SITE.aboutHomeAsideDetail}</p>
              </div>
            </div>
            <Link
              className="inline-flex min-h-11 w-full items-center justify-center rounded-xl border-2 border-[#BE1E2D] bg-[#BE1E2D] px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#BE1E2D]/25 transition hover:bg-[#a01824] hover:shadow-lg hover:shadow-[#BE1E2D]/30 active:translate-y-px focus:outline-none focus-visible:ring-2 focus-visible:ring-[#BE1E2D]/40 focus-visible:ring-offset-2 sm:w-auto"
              to="/about"
            >
              Read our full story
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
