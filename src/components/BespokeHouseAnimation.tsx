import { motion, useAnimationFrame, useMotionValue } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion.ts';

const RED = '#BE1E2D';

/**
 * Gable + body with eaves: short horizontals at wall top so the roof line sits wider than the walls.
 * Wall plate y=102; eave extends 14 units past each wall (x 46–194 vs walls 60–180).
 */
const HOUSE_OUTER_PATH =
  'M 60 178 L 60 102 L 46 102 L 120 36 L 194 102 L 180 102 L 180 178 L 60 178 Z';

/** 2×2 panes with gaps — matches the brand logo window (four small squares). */
const HOUSE_WINDOW_PATH = [
  'M 103 102 L 118 102 L 118 117 L 103 117 Z',
  'M 123 102 L 138 102 L 138 117 L 123 117 Z',
  'M 103 122 L 118 122 L 118 137 L 103 137 Z',
  'M 123 122 L 138 122 L 138 137 L 123 137 Z',
].join(' ');

const DASH_PERIOD = 100;
const DASH_MARK = 68;

const NORMAL_CYCLE_S = 1.15;
const FAST_CYCLE_S = 0.28;
const PULSE_MS = 700;
/** Linear ramp back to normal speed (seconds per full dash cycle). */
const RAMP_BACK_MS = 1100;

const RED_GLOW =
  'drop-shadow(0 0 5px rgba(190, 30, 45, 0.8)) drop-shadow(0 0 12px rgba(190, 30, 45, 0.35))';

type Ramp = { start: number; from: number; to: number; durationMs: number };

export function BespokeHouseAnimation() {
  const reduceMotion = usePrefersReducedMotion();
  const [glitch, setGlitch] = useState(false);
  const boostTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dashOffsetMv = useMotionValue(0);
  const cycleDurationRef = useRef(NORMAL_CYCLE_S);
  const offsetAccumRef = useRef(0);
  const rampRef = useRef<Ramp | null>(null);

  useAnimationFrame((_, deltaMs) => {
    if (reduceMotion) return;

    const now = performance.now();
    const ramp = rampRef.current;
    if (ramp) {
      const t = Math.min(1, (now - ramp.start) / ramp.durationMs);
      cycleDurationRef.current = ramp.from + (ramp.to - ramp.from) * t;
      if (t >= 1) rampRef.current = null;
    }

    const sec = deltaMs / 1000;
    const dur = cycleDurationRef.current;
    offsetAccumRef.current -= (DASH_PERIOD / dur) * sec;
    while (offsetAccumRef.current <= -DASH_PERIOD) {
      offsetAccumRef.current += DASH_PERIOD;
    }
    while (offsetAccumRef.current > 0) {
      offsetAccumRef.current -= DASH_PERIOD;
    }
    dashOffsetMv.set(offsetAccumRef.current);
  });

  const beginRampToNormal = useCallback(() => {
    rampRef.current = {
      start: performance.now(),
      from: FAST_CYCLE_S,
      to: NORMAL_CYCLE_S,
      durationMs: RAMP_BACK_MS,
    };
  }, []);

  const activate = useCallback(() => {
    rampRef.current = null;
    cycleDurationRef.current = FAST_CYCLE_S;
    setGlitch(true);
    if (boostTimerRef.current) clearTimeout(boostTimerRef.current);
    boostTimerRef.current = setTimeout(() => {
      setGlitch(false);
      boostTimerRef.current = null;
      beginRampToNormal();
    }, PULSE_MS);
  }, [beginRampToNormal]);

  useEffect(
    () => () => {
      if (boostTimerRef.current) clearTimeout(boostTimerRef.current);
    },
    [],
  );

  return (
    <div className="flex justify-center">
      <motion.button
        type="button"
        aria-label="House outline animation — click for a quick pulse"
        className="relative z-[1] mx-auto block max-w-[15rem] cursor-pointer border-0 bg-transparent p-0 sm:max-w-[18rem] md:max-w-[21rem] lg:max-w-[24rem] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#BE1E2D]/45 focus-visible:ring-offset-2 focus-visible:ring-offset-npf-charcoal"
        onClick={activate}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 420, damping: 28 }}
      >
        <motion.svg
          className="h-auto w-full"
          viewBox="0 0 240 212"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          animate={
            glitch
              ? {
                  filter: [
                    'none',
                    'hue-rotate(6deg) contrast(1.08)',
                    'hue-rotate(-4deg) contrast(1.12)',
                    'none',
                  ],
                }
              : { filter: 'none' }
          }
          transition={{ duration: glitch ? 0.32 : 0.2, ease: 'easeOut' }}
        >
          <title>House outline</title>

          <motion.g
            style={{ transformOrigin: '120px 107px' }}
            animate={
              glitch
                ? {
                    x: [0, -2.2, 2.2, -1.2, 1.2, 0],
                    y: [0, 0.6, -0.6, 0],
                  }
                : { x: 0, y: 0 }
            }
            transition={{ duration: glitch ? 0.34 : 0.2, ease: 'easeOut' }}
          >
            {reduceMotion ? (
              <>
                <path
                  d={HOUSE_OUTER_PATH}
                  stroke={RED}
                  strokeWidth={2.35}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                  style={{ filter: RED_GLOW }}
                />
                <path
                  d={HOUSE_WINDOW_PATH}
                  stroke={RED}
                  strokeWidth={2.35}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                  style={{ filter: RED_GLOW }}
                />
              </>
            ) : (
              <>
                <motion.path
                  d={HOUSE_OUTER_PATH}
                  stroke={RED}
                  strokeWidth={2.35}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                  style={{
                    filter: RED_GLOW,
                    strokeDasharray: `${DASH_MARK} ${DASH_PERIOD - DASH_MARK}`,
                    strokeDashoffset: dashOffsetMv,
                  }}
                />
                <path
                  d={HOUSE_WINDOW_PATH}
                  stroke={RED}
                  strokeWidth={2.35}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                  style={{ filter: RED_GLOW }}
                />
              </>
            )}
          </motion.g>
        </motion.svg>
      </motion.button>
    </div>
  );
}
