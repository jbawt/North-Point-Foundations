import { SITE, serviceAreasSentence } from '../content/siteCopy.ts';

export function ServicesPage() {
  return (
    <section className="mx-auto max-w-5xl space-y-10 px-5 py-12 sm:px-8 md:px-10 md:py-14">
      <header className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-npf-red sm:text-sm">
          What we do
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-npf-charcoal sm:text-4xl">
          Foundation repair & waterproofing
        </h1>
        <p className="max-w-3xl text-sm leading-relaxed text-npf-muted sm:text-base">{SITE.lead}</p>
        <p className="max-w-3xl text-sm font-medium text-npf-charcoal sm:text-base">{SITE.values}</p>
      </header>

      <div className="rounded-xl border border-npf-border bg-npf-surface p-6 sm:p-8">
        <h2 className="mb-6 text-lg font-semibold text-npf-charcoal sm:text-xl">Our services</h2>
        <ul className="grid gap-4 sm:grid-cols-2">
          {SITE.services.map((service) => (
            <li
              key={service}
              className="flex items-start gap-3 rounded-lg border border-npf-border bg-white px-4 py-3 text-sm text-npf-charcoal shadow-sm sm:text-base"
            >
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-npf-red" aria-hidden />
              {service}
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl border border-npf-border bg-white p-6 sm:p-8">
        <h2 className="mb-3 text-lg font-semibold text-npf-charcoal">Service area</h2>
        <p className="text-sm leading-relaxed text-npf-muted sm:text-base">
          We serve <span className="font-medium text-npf-charcoal">{serviceAreasSentence()}</span>.
          Not sure if you&apos;re in range? Call us — we&apos;ll let you know.
        </p>
      </div>
    </section>
  );
}
