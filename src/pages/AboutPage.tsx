import { SITE, serviceAreasSentence } from '../content/siteCopy.ts';

export function AboutPage() {
  return (
    <section className="mx-auto max-w-5xl space-y-10 px-5 py-12 sm:px-8 md:px-10 md:py-14">
      <header className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-npf-red sm:text-sm">
          About us
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-npf-charcoal sm:text-4xl">
          Locally owned. Built on trust.
        </h1>
        <p className="max-w-3xl text-sm leading-relaxed text-npf-muted sm:text-base">{SITE.lead}</p>
      </header>

      <div className="prose prose-sm max-w-none text-npf-muted sm:prose-base">
        <h2 className="text-xl font-semibold text-npf-charcoal">Who we are</h2>
        <p>
          {SITE.name} is focused on the work that keeps your home dry and your foundation sound —
          from stopping water at the wall to moving soil when excavation is the right fix. We serve{' '}
          <strong className="font-medium text-npf-charcoal">{serviceAreasSentence()}</strong>.
        </p>
        <h2 className="mt-8 text-xl font-semibold text-npf-charcoal">What we believe</h2>
        <p>{SITE.values}</p>
        <p>
          You get clear scope, fair pricing, and crews who show up when we say we will — whether
          it&apos;s waterproofing, crack repair, drainage, or a full exterior dig.
        </p>
      </div>
    </section>
  );
}
