import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { useMemo, useState } from 'react';
import {
  EvaluationRequestStep1,
  type EvaluationRequestStep1Values,
} from './EvaluationRequestStep1.tsx';
import {
  EvaluationRequestStep2,
  type EvaluationRequestStep2Values,
} from './EvaluationRequestStep2.tsx';
import {
  EvaluationRequestFinalStep,
  type EvaluationRequestFinalStepValues,
} from './EvaluationRequestFinalStep.tsx';
import { sendQuoteRequestViaNetlify } from '../lib/netlifyQuoteRequest.ts';

type SlideDirection = 'forward' | 'back';

/**
 * Multi-step request-a-quote flow. Step transitions use `AnimatePresence` with
 * `mode="wait"` (the modern equivalent of the legacy `exitBeforeEnter` flag) so the outgoing
 * panel fully exits before the next enters.
 */
export function EvaluationRequestWizard({ className = '' }: { className?: string }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState<SlideDirection>('forward');
  const [step1Values, setStep1Values] = useState<Partial<EvaluationRequestStep1Values>>({});
  const [step2Values, setStep2Values] = useState<Partial<EvaluationRequestStep2Values>>({});
  const [step3Values, setStep3Values] = useState<Partial<EvaluationRequestFinalStepValues>>({});

  const reduceMotion = useReducedMotion();

  const slideVariants = useMemo<Variants>(() => {
    if (reduceMotion) {
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      };
    }

    return {
      initial: (dir: SlideDirection) => ({
        x: dir === 'forward' ? '100vw' : '-100vw',
        opacity: 0,
      }),
      animate: { x: 0, opacity: 1 },
      exit: (dir: SlideDirection) => ({
        x: dir === 'forward' ? '-100vw' : '100vw',
        opacity: 0,
      }),
    };
  }, [reduceMotion]);

  const goForward = () => {
    setDirection('forward');
    setCurrentStep((n) => Math.min(3, n + 1));
  };

  const goBack = () => {
    setDirection('back');
    setCurrentStep((n) => Math.max(1, n - 1));
  };

  const transition = reduceMotion
    ? { duration: 0.2, ease: 'linear' as const }
    : { type: 'tween' as const, ease: 'anticipate' as const, duration: 0.8 };

  return (
    <div className={`overflow-x-hidden bg-npf-surface ${className}`}>
      <div className="relative w-full">
        {/*
          `mode="wait"` matches the intent of legacy `exitBeforeEnter`: finish exit before enter.
          `custom` on AnimatePresence supplies the latest direction to exiting children.
        */}
        <AnimatePresence mode="wait" initial={false} custom={direction}>
          <motion.div
            key={currentStep}
            role="region"
            aria-roledescription="slide"
            aria-label={
              currentStep === 1
                ? 'Quote request step 1 of 3: problem'
                : currentStep === 2
                  ? 'Quote request step 2 of 3: location'
                  : 'Quote request step 3 of 3: details'
            }
            className="w-full"
            variants={slideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            custom={direction}
            transition={transition}
          >
            {currentStep === 1 ? (
              <EvaluationRequestStep1
                defaultValues={step1Values}
                onContinue={(data) => {
                  setStep1Values(data);
                  goForward();
                }}
              />
            ) : null}

            {currentStep === 2 ? (
              <EvaluationRequestStep2
                defaultValues={step2Values}
                onBack={goBack}
                onContinue={(data) => {
                  setStep2Values(data);
                  goForward();
                }}
              />
            ) : null}

            {currentStep === 3 ? (
              <EvaluationRequestFinalStep
                defaultValues={step3Values}
                onBack={goBack}
                successRedirectTo="/thank-you"
                onSubmitted={async (data) => {
                  const categoryId = step1Values.evaluationCategory;
                  const propertyAddress = step2Values.propertyAddress?.trim();
                  if (!categoryId || !propertyAddress) {
                    throw new Error(
                      'Something went wrong: go back and confirm your project type and property location.',
                    );
                  }
                  setStep3Values({
                    workTimeline: data.workTimeline,
                    projectSummary: data.projectSummary,
                    fullName: data.fullName,
                    email: data.email,
                    phone: data.phone,
                  });
                  await sendQuoteRequestViaNetlify({
                    evaluationCategoryId: categoryId,
                    propertyAddress,
                    finalStep: data,
                  });
                }}
              />
            ) : null}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
