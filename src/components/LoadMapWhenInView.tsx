import { useEffect, useRef, useState, type ReactNode } from 'react';

type Props = {
  children: ReactNode;
  className?: string;
  /** Extra margin before the map chunk downloads (keeps it off the critical path on mobile PSI). */
  rootMargin?: string;
};

const PLACEHOLDER_CLASS =
  'h-[min(52vh,480px)] min-h-[300px] w-full bg-gradient-to-br from-npf-surface via-zinc-100 to-zinc-200 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 sm:min-h-[360px] md:min-h-[400px]';

/**
 * Mounts children only after the box intersects (or nears) the viewport so heavy Mapbox work
 * stays off the first seconds of main-thread / network for above-the-fold scoring.
 */
export function LoadMapWhenInView({ children, className, rootMargin = '320px 0px' }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || visible) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { root: null, rootMargin, threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [visible, rootMargin]);

  return (
    <div ref={wrapRef} className={className}>
      {visible ? children : <div className={PLACEHOLDER_CLASS} aria-hidden />}
    </div>
  );
}
