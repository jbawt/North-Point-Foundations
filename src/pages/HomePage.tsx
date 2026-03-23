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
        <p className="text-sm uppercase tracking-wide text-cyan-300">React Starter Foundation</p>
        <h2 ref={headingRef} className="text-4xl font-bold text-white">
          Router, Redux, Tailwind, Icons, and GSAP
        </h2>
        <p className="max-w-2xl text-slate-300">
          This starter gives you a clean baseline architecture so you can begin building features
          immediately.
        </p>
      </header>

      <div
        ref={cardRef}
        className="rounded-xl border border-slate-800 bg-slate-900 p-6 text-slate-200 shadow-lg shadow-cyan-900/20"
      >
        <h3 className="mb-2 text-xl font-semibold text-white">Suggested next steps</h3>
        <ul className="list-disc space-y-2 pl-5">
          <li>Add your app-specific routes to `src/router/index.tsx`.</li>
          <li>Create feature slices under `src/features`.</li>
          <li>Build reusable UI components in `src/components`.</li>
        </ul>
      </div>
    </section>
  );
}
