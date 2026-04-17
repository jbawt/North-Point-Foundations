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
 * Success URL for end users: `/thank-you` (see `QuoteThankYouPage` and `index.html` form `action`).
 * In the app, the contact wizard redirects there after a successful POST. You can also set the same
 * path under Netlify → Forms → quote-request → Success page if you use classic HTML submissions.
 *
 * Optional: set `VITE_NETLIFY_FORM_ACTION` to your Netlify form URL when the UI is not on Netlify
 * (e.g. GitHub Pages + forms on Netlify). If omitted, posts to `import.meta.env.BASE_URL`.
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

  const action =
    import.meta.env.VITE_NETLIFY_FORM_ACTION?.trim() ||
    (import.meta.env.BASE_URL === '/' ? '/' : import.meta.env.BASE_URL);

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
