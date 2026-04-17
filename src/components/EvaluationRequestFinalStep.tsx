import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useForm } from 'react-hook-form';
import { EvaluationRequestProgress } from './EvaluationRequestProgress.tsx';

const WORK_TIMELINE_VALUES = ['immediately', 'within_1_3_months', 'just_researching'] as const;
export type WorkTimelineValue = (typeof WORK_TIMELINE_VALUES)[number];

export const TIMELINE_LABELS: Record<WorkTimelineValue, string> = {
  immediately: 'Immediately',
  within_1_3_months: 'Within 1-3 months',
  just_researching: 'Just researching',
};

export type EvaluationRequestFinalStepValues = {
  workTimeline: WorkTimelineValue;
  projectSummary: string;
  fullName: string;
  email: string;
  phone: string;
};

type FinalStepFormValues = Omit<EvaluationRequestFinalStepValues, 'workTimeline'> & {
  workTimeline: WorkTimelineValue | '';
};

export type EvaluationRequestFinalStepProps = {
  onBack?: () => void;
  /** Called before the confirmation modal; await to delay the modal until async work (e.g. Netlify form POST) finishes. */
  onSubmitted?: (data: EvaluationRequestFinalStepValues) => void | Promise<void>;
  defaultValues?: Partial<EvaluationRequestFinalStepValues>;
  className?: string;
};

const inputShell =
  'w-full rounded-md border-2 border-npf-navy bg-white px-4 py-3 text-sm text-npf-navy shadow-inner placeholder:text-npf-navy/35 ' +
  'transition-[box-shadow,border-color] duration-200 ease-out focus:border-npf-navy focus:outline-none focus:ring-2 focus:ring-npf-navy/15 dark:border-zinc-500 dark:bg-zinc-900/90 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-400 dark:focus:ring-zinc-600/30 sm:text-[15px]';

const labelClass =
  'block text-[11px] font-bold uppercase tracking-[0.14em] text-npf-navy sm:text-xs';

function QuoteConfirmationModal({
  open,
  onDismiss,
}: {
  open: boolean;
  onDismiss: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const titleId = useId();
  const descId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const panelVariants: Variants = reduceMotion
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.22, ease: 'easeOut' } },
        exit: { opacity: 0, transition: { duration: 0.18, ease: 'easeIn' } },
      }
    : {
        hidden: {
          opacity: 0,
          x: -10,
          skewX: -2,
          filter: 'blur(8px)',
        },
        visible: {
          opacity: 1,
          x: [6, -5, 3, 0],
          skewX: [1.2, -0.8, 0.4, 0],
          filter: ['blur(6px)', 'blur(3px)', 'blur(1px)', 'blur(0px)'],
          transition: {
            duration: 0.62,
            ease: [0.22, 1, 0.36, 1],
            times: [0, 0.32, 0.62, 1],
          },
        },
        exit: {
          opacity: 0,
          x: 4,
          filter: 'blur(4px)',
          transition: { duration: 0.22, ease: 'easeIn' },
        },
      };

  const node =
    typeof document !== 'undefined' ? (
      <AnimatePresence>
        {open ? (
          <motion.div
            key="quote-confirmation-root"
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.button
              type="button"
              aria-label="Dismiss quote confirmation dialog"
              className="absolute inset-0 bg-npf-navy/45 backdrop-blur-[2px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={onDismiss}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              aria-describedby={descId}
              className="relative z-10 w-full max-w-md overflow-hidden rounded-xl border-2 border-npf-navy/20 bg-white shadow-[0_24px_64px_-24px_rgba(26,54,93,0.35)] dark:border-zinc-600 dark:bg-zinc-900 dark:shadow-black/50"
              variants={panelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="border-b border-npf-navy/10 bg-npf-consult-canvas/80 px-5 py-4 sm:px-6">
                <div className="flex items-start justify-between gap-3">
                  <h2
                    id={titleId}
                    className="text-lg font-semibold text-npf-navy sm:text-xl"
                    style={{ fontFamily: 'var(--font-npf-consult-heading)' }}
                  >
                    Quote request received
                  </h2>
                  <button
                    ref={closeRef}
                    type="button"
                    onClick={onDismiss}
                    className="rounded-md border border-npf-navy/15 p-1.5 text-npf-navy transition-colors hover:bg-npf-navy/[0.06] focus:outline-none focus-visible:ring-2 focus-visible:ring-npf-classic-red/40"
                    aria-label="Close"
                  >
                    <X className="h-4 w-4" strokeWidth={2} />
                  </button>
                </div>
              </div>

              <div className="space-y-5 px-5 py-5 sm:px-6 sm:py-6">
                <div
                  className="rounded-lg border border-npf-navy/12 bg-npf-charcoal/[0.03] px-4 py-3"
                  style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}
                >
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-npf-navy/55">
                    Request logged
                  </p>
                  <p className="mt-3 flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-[0.12em] text-npf-navy">
                    <span>Status:</span>
                    <span
                      className="inline-flex h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-500 shadow-[0_0_0_2px_rgba(16,185,129,0.4)]"
                      aria-hidden
                    />
                    <span className="text-emerald-700">Complete</span>
                  </p>
                </div>

                <p
                  id={descId}
                  className="text-sm leading-relaxed text-npf-navy/85"
                  style={{ fontFamily: 'var(--font-npf-consult-body)' }}
                >
                  We will follow up with your quote or any clarifying questions within{' '}
                  <span className="font-semibold text-npf-navy">24 business hours</span>.
                </p>

                <button
                  type="button"
                  onClick={onDismiss}
                  className="w-full rounded-md border border-npf-navy/25 bg-npf-navy px-4 py-3 text-sm font-semibold text-white transition-[filter,box-shadow] hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-npf-classic-red/35 focus-visible:ring-offset-2"
                  style={{ fontFamily: 'var(--font-npf-consult-body)' }}
                >
                  Acknowledge
                </button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    ) : null;

  return node ? createPortal(node, document.body) : null;
}

export function EvaluationRequestFinalStep({
  onBack,
  onSubmitted,
  defaultValues,
  className = '',
}: EvaluationRequestFinalStepProps) {
  const reduceMotion = useReducedMotion();
  const headingId = useId();
  const inputId = useId();
  const [completeOpen, setCompleteOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FinalStepFormValues>({
    defaultValues: {
      workTimeline: defaultValues?.workTimeline ?? '',
      projectSummary: defaultValues?.projectSummary ?? '',
      fullName: defaultValues?.fullName ?? '',
      email: defaultValues?.email ?? '',
      phone: defaultValues?.phone ?? '',
    },
    mode: 'onSubmit',
  });

  const onSubmit = handleSubmit(async (data: FinalStepFormValues) => {
    const timeline = data.workTimeline;
    if (!timeline) return;
    const payload: EvaluationRequestFinalStepValues = {
      ...data,
      workTimeline: timeline,
    };
    setSubmitError(null);
    try {
      await onSubmitted?.(payload);
      setCompleteOpen(true);
    } catch (e) {
      const msg =
        e instanceof Error
          ? e.message
          : 'Could not send your request. Please try again or phone the office.';
      setSubmitError(msg);
    }
  });

  return (
    <div
      className={`bg-npf-surface text-npf-navy ${className}`}
      style={{ fontFamily: 'var(--font-npf-consult-body)' }}
    >
      <QuoteConfirmationModal open={completeOpen} onDismiss={() => setCompleteOpen(false)} />

      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
        <header className="mb-8 sm:mb-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-npf-navy/70 sm:text-xs">
            Request a quote
          </p>
          <h2
            id={headingId}
            className="mt-2 text-2xl font-semibold leading-tight tracking-tight text-npf-navy sm:text-3xl"
            style={{ fontFamily: 'var(--font-npf-consult-heading)' }}
          >
            Project details & submit your quote
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-npf-navy/80 sm:text-[15px]">
            A few details about timing and the job site help us turn your request into a clear, itemized quote.
            Add what you know now; we can refine the scope when we reach out.
          </p>
        </header>

        <EvaluationRequestProgress activeStepIndex={2} className="mb-8 sm:mb-10" />

        <form
          noValidate
          onSubmit={onSubmit}
          aria-labelledby={headingId}
          className="space-y-8 sm:space-y-10"
        >
          <section className="rounded-xl border border-npf-navy/15 bg-white/95 p-5 shadow-sm dark:border-zinc-600/80 dark:bg-zinc-900/90 sm:p-6">
            <h3 className="border-b border-npf-navy/10 pb-3 text-[12px] font-bold uppercase tracking-[0.16em] text-npf-navy">
              Project scope & timeline
            </h3>

            <div className="mt-5 space-y-5">
              <div>
                <label htmlFor={`${inputId}-timeline`} className={labelClass}>
                  When are you looking to begin work?
                </label>
                <select
                  id={`${inputId}-timeline`}
                  className={`${inputShell} mt-2 cursor-pointer font-semibold uppercase tracking-[0.1em] sm:tracking-[0.12em]`}
                  {...register('workTimeline', {
                    required: 'Select a timeframe for the work.',
                  })}
                >
                  <option value="">Select an option</option>
                  {WORK_TIMELINE_VALUES.map((v) => (
                    <option key={v} value={v}>
                      {TIMELINE_LABELS[v]}
                    </option>
                  ))}
                </select>
                {errors.workTimeline ? (
                  <p className="mt-2 text-sm font-medium text-npf-classic-red" role="alert">
                    {errors.workTimeline.message}
                  </p>
                ) : null}
              </div>

              <div>
                <label htmlFor={`${inputId}-summary`} className={labelClass}>
                  Any specific details or concerns?
                </label>
                <textarea
                  id={`${inputId}-summary`}
                  rows={5}
                  placeholder="Describe symptoms, duration, prior repairs, access constraints, or any reports we should know about."
                  className={`${inputShell} mt-2 min-h-[8rem] resize-y`}
                  {...register('projectSummary', {
                    required: 'Please summarize the project or concern.',
                    minLength: {
                      value: 24,
                      message: 'Add a few more details so we can quote accurately (at least 24 characters).',
                    },
                  })}
                />
                {errors.projectSummary ? (
                  <p className="mt-2 text-sm font-medium text-npf-classic-red" role="alert">
                    {errors.projectSummary.message}
                  </p>
                ) : null}
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-npf-navy/15 bg-white/95 p-5 shadow-sm dark:border-zinc-600/80 dark:bg-zinc-900/90 sm:p-6">
            <h3 className="border-b border-npf-navy/10 pb-3 text-[12px] font-bold uppercase tracking-[0.16em] text-npf-navy">
              Contact information
            </h3>
            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor={`${inputId}-name`} className={labelClass}>
                  Name
                </label>
                <input
                  id={`${inputId}-name`}
                  type="text"
                  autoComplete="name"
                  className={`${inputShell} mt-2`}
                  {...register('fullName', { required: 'Please enter your name.' })}
                />
                {errors.fullName ? (
                  <p className="mt-2 text-sm font-medium text-npf-classic-red" role="alert">
                    {errors.fullName.message}
                  </p>
                ) : null}
              </div>
              <div>
                <label htmlFor={`${inputId}-email`} className={labelClass}>
                  Email
                </label>
                <input
                  id={`${inputId}-email`}
                  type="email"
                  autoComplete="email"
                  className={`${inputShell} mt-2`}
                  {...register('email', {
                    required: 'Email is required.',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Enter a valid email address.',
                    },
                  })}
                />
                {errors.email ? (
                  <p className="mt-2 text-sm font-medium text-npf-classic-red" role="alert">
                    {errors.email.message}
                  </p>
                ) : null}
              </div>
              <div>
                <label htmlFor={`${inputId}-phone`} className={labelClass}>
                  Phone number
                </label>
                <input
                  id={`${inputId}-phone`}
                  type="tel"
                  autoComplete="tel"
                  className={`${inputShell} mt-2`}
                  {...register('phone', {
                    required: 'Phone number is required.',
                    minLength: { value: 10, message: 'Enter a reachable phone number.' },
                  })}
                />
                {errors.phone ? (
                  <p className="mt-2 text-sm font-medium text-npf-classic-red" role="alert">
                    {errors.phone.message}
                  </p>
                ) : null}
              </div>
            </div>
          </section>

          {submitError ? (
            <p
              className="rounded-lg border border-npf-classic-red/25 bg-npf-classic-red/[0.06] px-4 py-3 text-sm font-medium text-npf-classic-red"
              role="alert"
            >
              {submitError}
            </p>
          ) : null}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <motion.button
              type="button"
              onClick={() => onBack?.()}
              disabled={isSubmitting}
              className={
                'w-full rounded-md border-2 border-npf-navy bg-transparent px-6 py-3.5 text-center text-[12px] font-bold uppercase tracking-[0.12em] text-npf-navy ' +
                'transition-[background-color,box-shadow] duration-200 ease-out hover:bg-npf-navy/[0.04] focus:outline-none focus-visible:ring-2 focus-visible:ring-npf-navy/25 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f5f7fa] sm:w-auto sm:min-w-[10rem] ' +
                'disabled:pointer-events-none disabled:opacity-45'
              }
              whileHover={reduceMotion || isSubmitting ? undefined : { scale: 1.02 }}
              whileTap={reduceMotion || isSubmitting ? undefined : { scale: 0.99 }}
              transition={{ type: 'spring', stiffness: 420, damping: 24 }}
            >
              Back
            </motion.button>
            <motion.button
              type="submit"
              disabled={isSubmitting}
              className={
                'w-full rounded-md border border-npf-classic-red/90 bg-npf-classic-red px-6 py-3.5 text-center text-[11px] font-bold uppercase leading-snug tracking-[0.08em] text-white shadow-[0_2px_0_rgba(0,0,0,0.06)] ' +
                'transition-[box-shadow,filter] duration-200 ease-out hover:shadow-[0_6px_24px_-6px_rgba(190,30,45,0.45)] focus:outline-none focus-visible:ring-2 focus-visible:ring-npf-classic-red focus-visible:ring-offset-2 focus-visible:ring-offset-[#f5f7fa] sm:w-auto sm:min-w-[18rem] sm:text-[12px] sm:tracking-[0.1em] ' +
                'disabled:pointer-events-none disabled:opacity-70'
              }
              whileHover={reduceMotion || isSubmitting ? undefined : { scale: 1.02 }}
              whileTap={reduceMotion || isSubmitting ? undefined : { scale: 0.99 }}
              transition={{ type: 'spring', stiffness: 420, damping: 24 }}
            >
              {isSubmitting ? 'Sending…' : 'Submit quote request'}
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );
}
