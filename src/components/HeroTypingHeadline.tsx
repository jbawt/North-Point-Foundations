import { forwardRef, useEffect, useState } from 'react';
import { SITE } from '../content/siteCopy.ts';

const LINE1 = 'Below Grade';
const LINE2 = 'Above Expectations';
const LINE3 = SITE.name;

const TYPE_MS = 72;
const DELETE_MS = 42;
const PAUSE_AFTER_FULL_MS = 950;
const PAUSE_BEFORE_NEXT_LINE_MS = 380;

type Props = {
  reduceMotion: boolean;
  /** Delay before typing starts (ms), e.g. to match hero intro */
  startDelayMs?: number;
  /** Merged onto the animated `h1` (e.g. hidden until GSAP runs). */
  className?: string;
};

const baseHeadingClass =
  'mx-auto max-w-4xl text-center text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl';

export const HeroTypingHeadline = forwardRef<HTMLHeadingElement, Props>(function HeroTypingHeadline(
  { reduceMotion, startDelayMs = 420, className = '' },
  ref,
) {
  const [display, setDisplay] = useState('');

  useEffect(() => {
    if (reduceMotion) {
      return;
    }

    let cancelled = false;

    const sleep = (ms: number) =>
      new Promise<void>((resolve) => {
        window.setTimeout(resolve, ms);
      });

    async function run() {
      await sleep(startDelayMs);
      if (cancelled) {
        return;
      }

      setDisplay('');
      for (let i = 1; i <= LINE1.length; i++) {
        if (cancelled) {
          return;
        }
        setDisplay(LINE1.slice(0, i));
        await sleep(TYPE_MS);
      }

      await sleep(PAUSE_AFTER_FULL_MS);
      if (cancelled) {
        return;
      }

      for (let i = LINE1.length; i >= 0; i--) {
        if (cancelled) {
          return;
        }
        setDisplay(LINE1.slice(0, i));
        await sleep(DELETE_MS);
      }

      await sleep(PAUSE_BEFORE_NEXT_LINE_MS);
      if (cancelled) {
        return;
      }

      for (let i = 1; i <= LINE2.length; i++) {
        if (cancelled) {
          return;
        }
        setDisplay(LINE2.slice(0, i));
        await sleep(TYPE_MS);
      }

      await sleep(PAUSE_AFTER_FULL_MS);
      if (cancelled) {
        return;
      }

      for (let i = LINE2.length; i >= 0; i--) {
        if (cancelled) {
          return;
        }
        setDisplay(LINE2.slice(0, i));
        await sleep(DELETE_MS);
      }

      await sleep(PAUSE_BEFORE_NEXT_LINE_MS);
      if (cancelled) {
        return;
      }

      for (let i = 1; i <= LINE3.length; i++) {
        if (cancelled) {
          return;
        }
        setDisplay(LINE3.slice(0, i));
        await sleep(TYPE_MS);
      }
    }

    void run();

    return () => {
      cancelled = true;
    };
  }, [reduceMotion, startDelayMs]);

  if (reduceMotion) {
    return (
      <h1
        ref={ref}
        aria-label={`${LINE1} ${LINE2} ${LINE3}`}
        className={`${baseHeadingClass} ${className}`.trim()}
      >
        <span className="block">{LINE1}</span>
        <span className="mt-1 block sm:mt-2">{LINE2}</span>
        <span className="mt-1 block sm:mt-2">{LINE3}</span>
      </h1>
    );
  }

  return (
    <h1
      ref={ref}
      aria-label={`${LINE1} ${LINE2} ${LINE3}`}
      className={`mx-auto min-h-[1.15em] max-w-4xl text-center text-4xl font-bold leading-[1.1] tracking-tight text-white sm:min-h-[1.1em] sm:text-5xl md:text-6xl lg:text-7xl ${className}`.trim()}
    >
      <span className="block w-full text-center">{display}</span>
    </h1>
  );
});
