import emailjs from '@emailjs/browser';
import type { EvaluationCategoryId } from '../components/EvaluationRequestStep1.tsx';
import { getEvaluationCategoryLabel } from '../components/EvaluationRequestStep1.tsx';
import type { EvaluationRequestFinalStepValues } from '../components/EvaluationRequestFinalStep.tsx';
import { TIMELINE_LABELS } from '../components/EvaluationRequestFinalStep.tsx';

export type QuoteRequestEmailPayload = {
  evaluationCategoryId: EvaluationCategoryId;
  propertyAddress: string;
  finalStep: EvaluationRequestFinalStepValues;
};

/**
 * Sends the full quote request through EmailJS. Create a template that uses any of:
 * `{{from_name}}`, `{{reply_to}}`, `{{user_email}}`, `{{phone}}`, `{{property_address}}`,
 * `{{problem_category}}`, `{{work_timeline}}`, `{{project_summary}}`, `{{message}}`
 * (`message` is a plain-text summary of the whole request).
 */
export async function sendQuoteRequestViaEmailJs(payload: QuoteRequestEmailPayload): Promise<void> {
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY?.trim();
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID?.trim();
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID?.trim();

  if (!publicKey || !serviceId || !templateId) {
    throw new Error(
      'Email is not configured. Add VITE_EMAILJS_PUBLIC_KEY, VITE_EMAILJS_SERVICE_ID, and VITE_EMAILJS_TEMPLATE_ID to your environment.',
    );
  }

  const categoryLabel = getEvaluationCategoryLabel(payload.evaluationCategoryId);
  const timelineLabel = TIMELINE_LABELS[payload.finalStep.workTimeline];
  const { fullName, email, phone, projectSummary } = payload.finalStep;

  const message = [
    `Problem: ${categoryLabel}`,
    `Property: ${payload.propertyAddress}`,
    `Timeline: ${timelineLabel}`,
    '',
    'Project details:',
    projectSummary,
  ].join('\n');

  const templateParams: Record<string, string> = {
    from_name: fullName,
    reply_to: email,
    user_email: email,
    phone,
    property_address: payload.propertyAddress,
    problem_category: categoryLabel,
    work_timeline: timelineLabel,
    project_summary: projectSummary,
    message,
  };

  await emailjs.send(serviceId, templateId, templateParams, { publicKey });
}
