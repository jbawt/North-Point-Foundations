import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useId, useMemo, useState, type ReactNode } from 'react';

function mockSoilSaturation(): number {
  return Math.round((12 + Math.random() * 6) * 10) / 10;
}

function mockRedDeerTemp(): string {
  const c = Math.round(-14 + Math.random() * 12);
  return `${c >= 0 ? '+' : ''}${c}°C`;
}

function GlitchChip({ children }: { children: ReactNode }) {
  return (
    <motion.span
      className="group inline-flex cursor-default items-center gap-1.5 whitespace-nowrap rounded-sm px-0.5 py-0.5 text-[11px] leading-tight tracking-wide sm:text-xs md:text-[13px]"
      whileHover={{
        x: [0, -2, 2, -1, 0],
        transition: { duration: 0.22, ease: 'easeInOut' },
      }}
    >
      <span className="inline-block transition-[text-shadow,filter,color,transform] duration-200 ease-out group-hover:[text-shadow:1px_0_0_#BE1E2D,-1px_0_0_rgba(0,220,255,0.35)] group-hover:[filter:hue-rotate(8deg)_saturate(1.2)_contrast(1.05)] group-hover:scale-[1.02] motion-reduce:group-hover:scale-100">
        {children}
      </span>
    </motion.span>
  );
}

export function DataTickerDivider() {
  const reduceMotion = useReducedMotion();
  const labelId = useId();
  const [soilPct, setSoilPct] = useState<number | null>(null);
  const [localTemp, setLocalTemp] = useState<string | null>(null);

  useEffect(() => {
    const soilTimer = window.setTimeout(() => setSoilPct(mockSoilSaturation()), 280);
    const wxTimer = window.setTimeout(() => setLocalTemp(mockRedDeerTemp()), 520);
    return () => {
      window.clearTimeout(soilTimer);
      window.clearTimeout(wxTimer);
    };
  }, []);

  const segments = useMemo(
    () => [
      {
        key: 'region',
        node: (
          <>
            <span className="text-npf-muted">REGION:</span>{' '}
            <span className="font-medium text-[#BE1E2D]" style={{ textShadow: '0 0 12px rgba(190,30,45,0.45)' }}>
              CENTRAL ALBERTA // RD-01
            </span>
          </>
        ),
      },
      {
        key: 'soil',
        node: (
          <>
            <span className="text-npf-muted">SOIL SAT:</span>{' '}
            <span className="font-medium text-[#BE1E2D]" style={{ textShadow: '0 0 10px rgba(190,30,45,0.4)' }}>
              {soilPct === null ? '…' : `${soilPct}%`}
            </span>
          </>
        ),
      },
      {
        key: 'frost',
        node: (
          <>
            <span className="text-npf-muted">FROST DEPTH:</span>{' '}
            <span className="font-medium text-[#BE1E2D]" style={{ textShadow: '0 0 10px rgba(190,30,45,0.4)' }}>
              1.24m
            </span>
          </>
        ),
      },
      {
        key: 'integrity',
        node: (
          <span className="inline-flex items-center gap-2">
            <motion.span
              className="h-2 w-2 shrink-0 rounded-full bg-emerald-600"
              aria-hidden
              animate={
                reduceMotion ? undefined : { opacity: [1, 0.45, 1], scale: [1, 0.92, 1] }
              }
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              style={{ boxShadow: '0 0 8px rgba(5,150,105,0.45)' }}
            />
            <span className="text-npf-muted">INTEGRITY:</span>{' '}
            <span className="font-medium text-emerald-700">NOMINAL</span>
          </span>
        ),
      },
      {
        key: 'wx',
        node: (
          <>
            <span className="text-npf-muted">RED DEER WX:</span>{' '}
            <span className="font-medium text-[#BE1E2D]" style={{ textShadow: '0 0 10px rgba(190,30,45,0.4)' }}>
              {localTemp === null ? '…' : localTemp}
            </span>
          </>
        ),
      },
    ],
    [localTemp, reduceMotion, soilPct],
  );

  const crtTransition = reduceMotion
    ? { duration: 0.2 }
    : {
        duration: 0.72,
        times: [0, 0.08, 0.14, 0.22, 0.32, 0.42, 0.55, 1],
        ease: 'easeOut' as const,
      };

  const crtKeyframes = reduceMotion ? { opacity: 1 } : { opacity: [0, 0.85, 0.15, 0.9, 0.25, 1, 0.7, 1] };

  return (
    <div
      className="relative m-0 w-full border-y border-npf-border bg-white py-2.5 dark:bg-zinc-950 sm:min-h-[4.5rem] sm:py-3 md:min-h-[4.75rem]"
      style={{
        boxShadow: `inset 0 1px 0 rgba(26,26,26,0.06), inset 0 -1px 0 rgba(26,26,26,0.06)`,
        fontFamily: "'JetBrains Mono', ui-monospace, monospace",
      }}
      role="region"
      aria-labelledby={labelId}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.55]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(26,26,26,0.04) 2px,
            rgba(26,26,26,0.04) 3px
          )`,
        }}
      />
      <span id={labelId} className="sr-only">
        Environmental diagnostic readout for Central Alberta
      </span>

      <motion.div
        className="relative z-[1] flex min-h-[3.25rem] items-center sm:min-h-[3.5rem]"
        initial={{ opacity: 0 }}
        animate={crtKeyframes}
        transition={crtTransition}
      >
        <div className="hidden w-full md:flex md:items-center md:justify-between md:gap-3 md:px-8 lg:px-12">
          {segments.map(({ key, node }) => (
            <GlitchChip key={key}>{node}</GlitchChip>
          ))}
        </div>

        <div
          className={
            reduceMotion ? 'md:hidden w-full overflow-x-auto overflow-y-hidden' : 'md:hidden w-full overflow-hidden'
          }
        >
          <div
            className={
              reduceMotion
                ? 'flex w-max min-w-full flex-nowrap justify-start gap-8 px-4 py-0.5'
                : 'npf-data-ribbon-marquee-track flex w-max flex-nowrap gap-10 px-4'
            }
          >
            {reduceMotion ? (
              segments.map(({ key, node }) => <GlitchChip key={key}>{node}</GlitchChip>)
            ) : (
              <>
                <div className="flex shrink-0 items-center gap-10 pr-10">
                  {segments.map(({ key, node }) => (
                    <GlitchChip key={key}>{node}</GlitchChip>
                  ))}
                </div>
                <div className="flex shrink-0 items-center gap-10 pr-10" aria-hidden>
                  {segments.map(({ key, node }) => (
                    <GlitchChip key={`${key}-dup`}>{node}</GlitchChip>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
