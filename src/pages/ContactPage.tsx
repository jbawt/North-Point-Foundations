import { Link } from 'react-router-dom';
import { DirectCallPrompt } from '../components/DirectCallPrompt.tsx';
import { EvaluationRequestWizard } from '../components/EvaluationRequestWizard.tsx';
import { SITE } from '../content/siteCopy.ts';

export function ContactPage() {
  return (
    <div className="flex w-full flex-1 flex-col">
      <section
        aria-labelledby="contact-hero-heading"
        className="relative isolate hidden border-b border-white/10 bg-npf-charcoal px-4 py-5 text-white sm:px-6 sm:py-6 md:block md:py-7 lg:px-12"
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
          className="pointer-events-none absolute -right-12 top-[4%] -z-10 h-36 w-36 rounded-full bg-npf-red/28 blur-[72px] sm:right-0 sm:h-44 sm:w-44"
          aria-hidden
        />
        <div
          className="absolute left-0 top-0 z-0 h-0.5 w-full max-w-2xl bg-gradient-to-r from-npf-red via-npf-red to-transparent sm:h-0.5 lg:max-w-3xl"
          aria-hidden
        />
        <div className="relative z-10 mx-auto max-w-3xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/60 sm:text-[11px]">
            Contact
          </p>
          <h1
            id="contact-hero-heading"
            className="mt-1.5 text-2xl font-semibold leading-snug tracking-tight sm:text-3xl md:text-[1.85rem]"
            style={{ fontFamily: 'var(--font-npf-consult-heading)' }}
          >
            Request a quote
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-snug text-white/85 sm:text-[15px] sm:leading-relaxed">
            Tell us about your project in a few quick steps so we can put together an accurate quote. Prefer to
            speak with someone now? Give us a {' '}
            <a
              className="font-semibold text-white underline decoration-white/35 underline-offset-4 transition-colors hover:decoration-white"
              href={SITE.quotePhoneTel}
            >
              call
            </a>
            .
          </p>
          <p className="mt-2.5 text-xs text-white/70 sm:text-sm">
            <Link className="font-medium text-white/90 underline-offset-4 hover:underline" to="/">
              ← Back to home
            </Link>
          </p>
        </div>
      </section>

      <EvaluationRequestWizard />
      <DirectCallPrompt />
    </div>
  );
}
