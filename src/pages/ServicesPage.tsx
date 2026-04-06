import { motion, useReducedMotion } from 'framer-motion';
import { SITE, serviceAreasSentence } from '../content/siteCopy.ts';
import { ServicePageCard } from '../components/ServicePageCard.tsx';

export function ServicesPage() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[min(52vh,28rem)] bg-[radial-gradient(ellipse_90%_80%_at_50%_-20%,color-mix(in_srgb,var(--color-npf-red)_12%,transparent),transparent_70%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:linear-gradient(rgba(26,26,26,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(26,26,26,0.03)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:linear-gradient(to_bottom,black,transparent)]"
        aria-hidden
      />

      <section className="relative mx-auto max-w-4xl space-y-12 px-5 py-14 sm:px-8 md:space-y-16 md:px-10 md:py-16 lg:max-w-5xl">
        <motion.header
          className="space-y-5"
          {...(reduceMotion
            ? { initial: false as const }
            : {
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
              })}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-npf-red sm:text-sm">What we do</p>
          <h1 className="text-3xl font-bold tracking-tight text-npf-charcoal sm:text-4xl lg:text-[2.5rem] lg:leading-tight">
            Foundation repair & waterproofing
          </h1>
          <p className="max-w-3xl text-sm leading-relaxed text-npf-muted sm:text-base">{SITE.lead}</p>
          <p className="max-w-3xl border-l-2 border-npf-red/35 pl-4 text-sm font-medium leading-relaxed text-npf-charcoal sm:text-base">
            {SITE.values}
          </p>
        </motion.header>

        <div className="space-y-6">
          <motion.div
            className="flex flex-wrap items-end justify-between gap-4 border-b border-npf-border pb-4"
            {...(reduceMotion
              ? { initial: false as const }
              : {
                  initial: { opacity: 0, y: 12 },
                  whileInView: { opacity: 1, y: 0 },
                  viewport: { once: true, amount: 0.6 },
                  transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
                })}
          >
            <div>
              <h2 className="text-lg font-semibold text-npf-charcoal sm:text-xl">Services in detail</h2>
              <p className="mt-1 max-w-xl text-sm text-npf-muted sm:text-base">
                Hover a card for a quick lift and highlights — each line is how we think about the work, not a generic list.
              </p>
            </div>
          </motion.div>

          <div className="flex flex-col gap-6 lg:gap-7" aria-label="Detailed service list">
            {SITE.services.map((service, i) => (
              <ServicePageCard key={service.name} service={service} index={i} />
            ))}
          </div>
        </div>

        <motion.div
          className="relative overflow-hidden rounded-2xl border border-npf-border bg-npf-surface/80 p-6 shadow-sm sm:p-8"
          {...(reduceMotion
            ? { initial: false as const }
            : {
                initial: { opacity: 0, y: 20 },
                whileInView: { opacity: 1, y: 0 },
                viewport: { once: true, amount: 0.25 },
                transition: { duration: 0.5, delay: 0.05, ease: [0.22, 1, 0.36, 1] as const },
              })}
        >
          <div
            className="pointer-events-none absolute -right-20 top-1/2 h-56 w-56 -translate-y-1/2 rounded-full bg-npf-red/[0.06] blur-3xl"
            aria-hidden
          />
          <h2 className="relative text-lg font-semibold text-npf-charcoal sm:text-xl">Service area</h2>
          <p className="relative mt-3 text-sm leading-relaxed text-npf-muted sm:text-base">
            We serve <span className="font-medium text-npf-charcoal">{serviceAreasSentence()}</span>. Not sure if
            you&apos;re in range? Call us — we&apos;ll let you know.
          </p>
          <a
            className="relative mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-npf-red px-6 py-2.5 text-sm font-semibold text-white shadow-sm shadow-npf-red/25 transition-[transform,box-shadow,background-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-npf-red-dark hover:shadow-[0_20px_44px_-18px_rgba(188,44,38,0.5)] active:translate-y-px focus:outline-none focus-visible:ring-2 focus-visible:ring-npf-red focus-visible:ring-offset-2 motion-reduce:transition-colors motion-reduce:active:translate-y-0"
            href={SITE.quotePhoneTel}
          >
            Get a quote
          </a>
        </motion.div>
      </section>
    </div>
  );
}
