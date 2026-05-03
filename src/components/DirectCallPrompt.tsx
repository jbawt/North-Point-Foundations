import { Phone } from 'lucide-react';
import { SITE } from '../content/siteCopy.ts';

/** Compact “call the office” block below the quote wizard on `/contact`. */
export function DirectCallPrompt() {
  return (
    <div className="border-t border-npf-border bg-npf-surface px-4 py-8 dark:border-zinc-700 sm:px-6 sm:py-10">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
        <p className="max-w-md text-sm leading-relaxed text-npf-muted dark:text-zinc-400 sm:text-[15px] sm:leading-relaxed">
          Rather call us directly? Tap below to dial — we&apos;re glad to talk through your project.
        </p>
        <a
          href={SITE.quotePhoneTel}
          className="npf-sleek-lift-subtle inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border-2 border-[#BE1E2D] bg-[#BE1E2D] px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-[#BE1E2D]/20 transition-[background-color,box-shadow,transform] duration-300 hover:bg-npf-red-dark hover:shadow-[0_12px_28px_-10px_rgba(190,30,45,0.45)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#BE1E2D]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-npf-surface dark:focus-visible:ring-offset-zinc-950"
        >
          <Phone className="h-4 w-4 shrink-0 opacity-95" aria-hidden />
          <span>Call {SITE.quotePhoneDisplay}</span>
        </a>
      </div>
    </div>
  );
}
