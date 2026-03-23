import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';

export function HomePage() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const heading = headingRef.current;
    const card = cardRef.current;

    if (!heading || !card) {
      return;
    }

    const timeline = gsap.timeline();

    timeline
      .fromTo(
        heading,
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out' },
      )
      .fromTo(
        card,
        { scale: 0.92, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, ease: 'power2.out' },
        '-=0.35',
      );

    return () => {
      timeline.kill();
    };
  }, []);

  return (
    <section className="space-y-8">
      <header className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-wide text-npf-red">Welcome</p>
        <h2 ref={headingRef} className="text-4xl font-bold tracking-tight text-npf-charcoal">
          Building on a solid foundation
        </h2>
        <p className="max-w-2xl text-npf-muted">
          North Point Foundations — professional, dependable service. This site uses the same
          charcoal, red, and white palette as your brand.
        </p>
      </header>

      <div
        ref={cardRef}
        className="rounded-xl border border-npf-border bg-npf-surface p-6 text-npf-charcoal shadow-md shadow-npf-charcoal/5"
      >
        <h3 className="mb-2 text-xl font-semibold text-npf-charcoal">Suggested next steps</h3>
        <ul className="list-disc space-y-2 pl-5 text-npf-muted marker:text-npf-red">
          <li>Add your app-specific routes to `src/router/index.tsx`.</li>
          <li>Create feature slices under `src/features`.</li>
          <li>Build reusable UI components in `src/components`.</li>
        </ul>
      </div>
    </section>
  );
}
