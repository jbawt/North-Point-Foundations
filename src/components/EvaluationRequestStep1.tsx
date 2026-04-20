import { motion } from 'framer-motion';
import { BrickWall, Building2, Check, Cylinder, Droplet } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion.ts';
import { EvaluationRequestProgress } from './EvaluationRequestProgress.tsx';

export const EVALUATION_CATEGORY_VALUES = [
  'wall_cracks',
  'water_seepage',
  'sump_drainage',
  'movement_bowing',
] as const;

export type EvaluationCategoryId = (typeof EVALUATION_CATEGORY_VALUES)[number];

export type EvaluationRequestStep1Values = {
  evaluationCategory: EvaluationCategoryId;
};

type CategoryConfig = {
  id: EvaluationCategoryId;
  label: string;
  description: string;
  Icon: LucideIcon;
};

const CATEGORIES: CategoryConfig[] = [
  {
    id: 'wall_cracks',
    label: 'Wall cracks',
    description: 'Vertical or horizontal cracks observed in the foundation wall.',
    Icon: BrickWall,
  },
  {
    id: 'water_seepage',
    label: 'Water or moisture',
    description: 'Damp walls, efflorescence, staining, or active seepage.',
    Icon: Droplet,
  },
  {
    id: 'sump_drainage',
    label: 'Sump & drainage',
    description: 'Sump pump, weeping tile, window wells, or yard drainage concerns.',
    Icon: Cylinder,
  },
  {
    id: 'movement_bowing',
    label: 'Movement or bowing',
    description: 'Uneven floors, leaning walls, sticking doors, or visible deflection.',
    Icon: Building2,
  },
];

export function getEvaluationCategoryLabel(id: EvaluationCategoryId): string {
  const row = CATEGORIES.find((c) => c.id === id);
  return row?.label ?? id;
}

export type EvaluationRequestStep1Props = {
  /** Called when the user completes step 1 with a valid selection. */
  onContinue?: (data: EvaluationRequestStep1Values) => void;
  defaultValues?: Partial<EvaluationRequestStep1Values>;
  className?: string;
};

export function EvaluationRequestStep1({
  onContinue,
  defaultValues,
  className = '',
}: EvaluationRequestStep1Props) {
  const reduceMotion = usePrefersReducedMotion();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<EvaluationRequestStep1Values>({
    defaultValues: {
      evaluationCategory: defaultValues?.evaluationCategory,
    },
    mode: 'onSubmit',
  });

  const selected = watch('evaluationCategory');

  return (
    <div
      className={`bg-npf-surface text-npf-navy ${className}`}
      style={{ fontFamily: 'var(--font-npf-consult-body)' }}
    >
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
        <header className="mb-8 sm:mb-10">
          <h2
            className="mt-2 text-2xl font-semibold leading-tight tracking-tight text-npf-navy sm:text-3xl"
            style={{ fontFamily: 'var(--font-npf-consult-heading)' }}
            id="evaluation-step1-heading"
          >
            What is the main issue?
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-npf-navy/80 sm:text-[15px]">
            Choose the category that best matches your situation. You can add more detail in a later step; this
            helps us prepare your quote with the right scope in mind.
          </p>
        </header>

        <EvaluationRequestProgress activeStepIndex={0} className="mb-8 sm:mb-10" />

        <form
          noValidate
          onSubmit={handleSubmit((data) => {
            onContinue?.(data);
          })}
          aria-labelledby="evaluation-step1-heading"
        >
          <fieldset className="border-0 p-0">
            <legend className="sr-only">Primary concern</legend>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
              {CATEGORIES.map((cat, index) => {
                const inputId = `evaluation-category-${cat.id}`;
                const isSelected = selected === cat.id;
                const Icon = cat.Icon;

                return (
                  <motion.div
                    key={cat.id}
                    initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: reduceMotion ? 0 : 0.06 + index * 0.07,
                      duration: 0.42,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <label
                      htmlFor={inputId}
                      className={
                        'group relative flex h-full cursor-pointer flex-col rounded-lg border bg-white/90 p-5 shadow-[0_1px_2px_rgba(26,54,93,0.06),0_6px_20px_-8px_rgba(26,54,93,0.12)] transition-[border-color,box-shadow,background-color] duration-200 ease-out dark:bg-zinc-900/95 dark:shadow-black/30 ' +
                        (isSelected
                          ? 'border-2 border-npf-classic-red bg-white shadow-[0_2px_8px_rgba(190,30,45,0.12)] dark:bg-zinc-900'
                          : 'border border-npf-navy/35 hover:border-npf-navy/55 hover:bg-white hover:shadow-[0_4px_24px_-10px_rgba(26,54,93,0.18)] dark:hover:bg-zinc-800/95')
                      }
                    >
                      <input
                        id={inputId}
                        type="radio"
                        value={cat.id}
                        className="sr-only"
                        {...register('evaluationCategory', {
                          required: 'Please select the category that best describes your concern.',
                        })}
                      />

                      {isSelected ? (
                        <span
                          className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-npf-classic-red text-white shadow-sm"
                          aria-hidden
                        >
                          <Check className="h-4 w-4" strokeWidth={2.5} />
                        </span>
                      ) : null}

                      <span
                        className="mb-3 flex h-11 w-11 items-center justify-center rounded-md border border-npf-navy/15 text-npf-navy transition-colors duration-200 group-hover:border-npf-navy/30"
                        aria-hidden
                      >
                        <Icon className="h-5 w-5" strokeWidth={1.75} />
                      </span>

                      <span
                        className="text-[13px] font-bold uppercase tracking-[0.12em] text-npf-navy sm:text-sm"
                        style={{ fontFamily: 'var(--font-npf-consult-body)' }}
                      >
                        {cat.label}
                      </span>
                      <span className="mt-2 text-sm leading-snug text-npf-navy/75">{cat.description}</span>
                    </label>
                  </motion.div>
                );
              })}
            </div>

            {errors.evaluationCategory ? (
              <p className="mt-4 text-sm font-medium text-npf-classic-red" role="alert">
                {errors.evaluationCategory.message}
              </p>
            ) : null}
          </fieldset>

          <div className="mt-10 flex justify-center sm:mt-12">
            <motion.button
              type="submit"
              className={
                'w-full max-w-lg rounded-md border border-npf-classic-red/90 bg-npf-classic-red px-6 py-3.5 text-center text-[11px] font-bold uppercase leading-snug tracking-[0.12em] text-white shadow-[0_2px_0_rgba(0,0,0,0.06)] sm:text-[12px] sm:tracking-[0.14em] ' +
                'transition-[box-shadow,filter] duration-200 ease-out hover:shadow-[0_6px_24px_-6px_rgba(190,30,45,0.45)] focus:outline-none focus-visible:ring-2 focus-visible:ring-npf-classic-red focus-visible:ring-offset-2 focus-visible:ring-offset-[#f5f7fa] ' +
                'motion-reduce:transition-none active:brightness-95 sm:py-4'
              }
              style={{ fontFamily: 'var(--font-npf-consult-body)' }}
              whileHover={reduceMotion ? undefined : { scale: 1.03 }}
              whileTap={reduceMotion ? undefined : { scale: 0.99 }}
              transition={{ type: 'spring', stiffness: 400, damping: 22 }}
            >
              Continue to project location
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );
}
