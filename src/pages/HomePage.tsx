import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { HomeHero } from '../components/HomeHero.tsx';
import { ServiceTile } from '../components/ServiceTile.tsx';
import { SITE, serviceAreasSentence } from '../content/siteCopy.ts';

gsap.registerPlugin(ScrollTrigger);

export function HomePage() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const card = cardRef.current;

    if (!section || !card) {
      return;
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        section,
        { y: 36, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.75,
          ease: 'power2.out',
          delay: 0.15,
          scrollTrigger: {
            trigger: section,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
        },
      );
      gsap.fromTo(
        card,
        { y: 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.65,
          ease: 'power2.out',
          delay: 0.08,
          scrollTrigger: {
            trigger: card,
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
        },
      );
    }, section);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <>
      <HomeHero />
      <section
        ref={sectionRef}
        className="mx-auto w-full max-w-5xl space-y-10 px-5 py-14 sm:px-8 md:px-10 md:py-16"
      >
        <header className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-npf-red sm:text-sm">
            What we do
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-npf-charcoal sm:text-4xl">
            Full-service foundation & waterproofing
          </h2>
          <p className="max-w-2xl text-sm leading-relaxed text-npf-muted sm:text-base">
            {SITE.lead} {SITE.values}
          </p>
        </header>

        <div className="grid gap-4 sm:grid-cols-2">
          {SITE.services.map((service) => (
            <ServiceTile key={service.name} service={service} />
          ))}
        </div>

        <div
          ref={cardRef}
          className="group relative overflow-hidden rounded-xl border border-npf-border bg-npf-surface p-5 text-npf-charcoal shadow-md shadow-npf-charcoal/5 transition hover:border-npf-red/30 hover:shadow-lg hover:shadow-npf-charcoal/10 sm:p-6 sm:flex sm:flex-col sm:items-center sm:text-center before:pointer-events-none before:absolute before:inset-0 before:opacity-0 before:transition-opacity before:duration-300 before:ease-out before:bg-[radial-gradient(120%_120%_at_50%_0%,rgba(188,44,38,0.22),transparent_55%)] group-hover:before:opacity-100"
        >
          <h3 className="mb-2 text-lg font-semibold tracking-tight text-npf-charcoal sm:text-xl">Service area</h3>
          <p className="max-w-2xl text-sm leading-relaxed text-npf-muted sm:text-base sm:mx-auto">
            Proudly serving <strong className="font-medium text-npf-charcoal">{serviceAreasSentence()}</strong>.
            Questions about your property? We&apos;re happy to help.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              className="inline-flex min-h-11 items-center justify-center rounded-lg bg-npf-red px-6 py-2.5 text-sm font-semibold text-white shadow-sm shadow-npf-red/20 transition hover:bg-npf-red-dark hover:shadow-npf-red/30 active:translate-y-px focus:outline-none"
              to="/services"
            >
              View all services
            </Link>
            <Link
              className="inline-flex min-h-11 items-center justify-center rounded-lg border border-npf-border bg-white px-6 py-2.5 text-sm font-semibold text-npf-charcoal transition hover:bg-npf-surface active:translate-y-px focus:outline-none"
              to="/about"
            >
              About {SITE.name}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
