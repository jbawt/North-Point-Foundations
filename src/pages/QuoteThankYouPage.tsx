import { useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import { SITE } from '../content/siteCopy.ts';

/**
 * Success landing after a quote request is accepted by Netlify Forms.
 * Use `/thank-you` in the Netlify form “Success” settings, or rely on the in-app redirect after submit.
 */
export function QuoteThankYouPage() {
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, []);

  return (
    <div className="flex w-full flex-1 flex-col">
      <section
        aria-labelledby="quote-thank-you-heading"
        className={
          'relative isolate flex min-h-[min(72vh,36rem)] w-full flex-1 flex-col justify-center ' +
          'border-b border-white/10 bg-npf-charcoal px-4 py-16 text-white sm:min-h-[min(78vh,40rem)] sm:px-6 sm:py-20 lg:px-12'
        }
      >
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_115%_85%_at_72%_18%,rgba(188,44,38,0.26),transparent_52%),radial-gradient(ellipse_85%_65%_at_8%_88%,rgba(255,255,255,0.07),transparent_48%),linear-gradient(168deg,#101010_0%,#1a1a1a_42%,#131313_100%)]" />
        </div>
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.09]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)`,
            backgroundSize: '44px 44px',
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -right-12 top-[8%] -z-10 h-40 w-40 rounded-full bg-npf-red/28 blur-[80px] sm:right-0 sm:h-48 sm:w-48"
          aria-hidden
        />
        <div
          className="absolute left-0 top-0 z-0 h-0.5 w-full max-w-2xl bg-gradient-to-r from-npf-red via-npf-red to-transparent sm:h-1 lg:max-w-3xl"
          aria-hidden
        />

        <div className="relative z-10 mx-auto w-full max-w-2xl text-center">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.28em] text-npf-red sm:text-[11px]">
            Request received
          </p>
          <h1
            id="quote-thank-you-heading"
            className="mt-3 text-3xl font-semibold leading-snug tracking-tight text-white sm:mt-4 sm:text-4xl md:text-[2.35rem] md:leading-tight"
            style={{ fontFamily: 'var(--font-npf-consult-heading)' }}
          >
            Thank you — we&apos;ll be in touch
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-white/78 sm:mt-5 sm:text-base sm:leading-relaxed">
            Your quote request was submitted successfully. The {SITE.name} team will review your details and
            follow up using the contact information you provided. If you need to reach us sooner, you can still{' '}
            <a
              className="font-semibold text-white underline decoration-white/35 underline-offset-4 transition-colors hover:decoration-white"
              href={SITE.quotePhoneTel}
            >
              call the office
            </a>
            .
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:mt-10 sm:flex-row sm:justify-center sm:gap-4">
            <Link
              className="npf-sleek-lift-subtle inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-npf-red px-8 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-npf-red/30 hover:bg-npf-red-dark hover:shadow-[0_20px_44px_-16px_rgba(188,44,38,0.6)] active:translate-y-0 sm:w-auto"
              to="/"
            >
              Back to home
            </Link>
            <Link
              className="npf-sleek-lift-subtle inline-flex min-h-12 w-full items-center justify-center rounded-lg border border-white/22 bg-white/5 px-8 py-3 text-center text-sm font-semibold text-white backdrop-blur-sm hover:border-white/45 hover:bg-white/14 hover:shadow-[0_16px_40px_-18px_rgba(0,0,0,0.35)] active:translate-y-0 sm:w-auto"
              to="/services"
            >
              View services
            </Link>
          </div>
          <p className="mt-8 text-xs text-white/55 sm:text-sm">
            <Link
              className="font-medium text-white/85 underline-offset-4 transition-colors hover:text-white hover:underline"
              to="/contact"
            >
              Submit another request
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
