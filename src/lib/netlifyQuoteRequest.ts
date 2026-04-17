import type { EvaluationCategoryId } from '../components/EvaluationRequestStep1.tsx';
import { getEvaluationCategoryLabel } from '../components/EvaluationRequestStep1.tsx';
import type { EvaluationRequestFinalStepValues } from '../components/EvaluationRequestFinalStep.tsx';
import { TIMELINE_LABELS } from '../components/EvaluationRequestFinalStep.tsx';

export type QuoteRequestEmailPayload = {
  evaluationCategoryId: EvaluationCategoryId;
  propertyAddress: string;
  finalStep: EvaluationRequestFinalStepValues;
};

const FORM_NAME = 'quote-request';

/**
 * Submits the quote request to Netlify Forms. Enable form notifications under
 * Netlify → Forms → {form name} → Notifications & webhooks.
 *
 * Optional: set `VITE_NETLIFY_FORM_ACTION` to your deployed site origin when testing from local dev
 * (e.g. `https://your-site.netlify.app/`); otherwise posts to `/` (same origin).
 */
export async function sendQuoteRequestViaNetlify(payload: QuoteRequestEmailPayload): Promise<void> {
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

  const action = import.meta.env.VITE_NETLIFY_FORM_ACTION?.trim() || '/';

  const body = new URLSearchParams({
    'form-name': FORM_NAME,
    'bot-field': '',
    from_name: fullName,
    reply_to: email,
    user_email: email,
    phone,
    property_address: payload.propertyAddress,
    problem_category: categoryLabel,
    problem_category_id: payload.evaluationCategoryId,
    work_timeline: timelineLabel,
    project_summary: projectSummary,
    message,
  });

  const res = await fetch(action, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  if (!res.ok) {
    throw new Error(
      'Could not send your request. Please try again or phone the office.',
    );
  }
}
