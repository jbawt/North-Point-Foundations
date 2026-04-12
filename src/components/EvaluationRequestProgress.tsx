export const EVALUATION_WIZARD_STEPS = [
  { n: '01', label: 'Problem' },
  { n: '02', label: 'Location' },
  { n: '03', label: 'Details' },
] as const;

export type EvaluationRequestProgressProps = {
  /** Zero-based index of the active step (0 = Problem, 1 = Location, 2 = Details). */
  activeStepIndex: number;
  className?: string;
};

export function EvaluationRequestProgress({ activeStepIndex, className = '' }: EvaluationRequestProgressProps) {
  const safeIndex = Math.min(Math.max(activeStepIndex, 0), EVALUATION_WIZARD_STEPS.length - 1);
  const fillPct = ((safeIndex + 1) / EVALUATION_WIZARD_STEPS.length) * 100;

  const colAlign = (i: number) =>
    i === 0 ? 'text-left' : i === 1 ? 'text-center' : 'text-right';

  return (
    <nav aria-label="Quote request progress" className={className}>
      <ol className="grid grid-cols-3 gap-x-2 text-[11px] font-semibold uppercase leading-snug tracking-[0.14em] sm:gap-x-4 sm:text-xs sm:tracking-[0.16em]">
        {EVALUATION_WIZARD_STEPS.map((step, i) => (
          <li key={step.n} className={`min-w-0 ${colAlign(i)}`}>
            <span
              className={
                i === safeIndex
                  ? 'text-npf-classic-red'
                  : i < safeIndex
                    ? 'text-npf-navy/70'
                    : 'text-npf-navy/40'
              }
            >
              <span className="text-npf-navy">{step.n}</span>{' '}
              <span className={i === safeIndex ? 'text-npf-navy' : ''}>{step.label}</span>
            </span>
          </li>
        ))}
      </ol>
      <div
        className="mt-3 h-0.5 w-full overflow-hidden rounded-full bg-npf-navy/10 dark:bg-zinc-700/50"
        role="presentation"
        aria-hidden
      >
        <div
          className="h-full rounded-full bg-npf-classic-red transition-[width] duration-500 ease-out motion-reduce:transition-none"
          style={{ width: `${fillPct}%` }}
        />
      </div>
    </nav>
  );
}
