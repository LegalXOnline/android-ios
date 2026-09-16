import { api } from './api';

/**
 * Submitting a document application.
 *
 * Two calls, matching the web: a lead carries the contact details, and the
 * application hangs off it with the form data. Creating the application is what
 * triggers the admin alert on the backend, so this is the call that actually
 * puts an order in front of a human.
 *
 * Payment is not wired on mobile yet. Nothing here pretends otherwise: the
 * application is created and flagged as awaiting payment, which is the same
 * state the web leaves it in between submission and checkout.
 */

export interface SubmitApplicationInput {
  name: string;
  phone: string;
  email?: string;
  serviceSlug: string;
  serviceTitle: string;
  /** Anything the screens collected — mode, notes, selected plan. */
  formData?: Record<string, unknown>;
}

export interface SubmittedApplication {
  leadId: string;
  applicationId: string;
}

/**
 * Both calls send the Bearer token deliberately.
 *
 * /api/leads and /api/applications sit behind the CSRF guard, and that guard
 * only stands aside for a Bearer header — a cookie-less, token-less POST is
 * rejected with 403. The token is what makes these reachable from the app at
 * all, so submitting requires a signed-in user.
 */
export async function submitApplication(
  input: SubmitApplicationInput,
): Promise<SubmittedApplication> {
  const { leadId } = await api<{ leadId: string }>('/api/leads', {
    method: 'POST',
    body: {
      name: input.name,
      phone: input.phone,
      email: input.email,
      serviceSlug: input.serviceSlug,
      serviceTitle: input.serviceTitle,
    },
  });

  const { applicationId } = await api<{ applicationId: string }>('/api/applications', {
    method: 'POST',
    body: {
      leadId,
      serviceSlug: input.serviceSlug,
      formData: {
        ...(input.formData ?? {}),
        source: 'mobile',
        paymentStatus: 'awaiting_payment',
      },
    },
  });

  return { leadId, applicationId };
}
