/**
 * Consultations service — typed interface stubs.
 *
 * Covers Agora session management and consultation review.
 * Frontend never generates Agora tokens — server-only.
 * See 15_Realtime_Communication_Agora.md, 18_API_Integration_Contracts §2.
 */
import type { Consultation, ConsultationReview } from '@/types/database.types';
import type {
  CreateAgoraSessionInput,
  CreateAgoraSessionResponse,
  ReportSessionDurationInput,
  ReportSessionDurationResponse,
} from '@/types/api.types';

/** Fetch all consultations for the current user (Call History SCR-20). */
export async function getUserConsultations(_profileId: string): Promise<Consultation[]> {
  throw new Error('Not implemented — see 18_API_Integration_Contracts §3, table: consultations');
}

/**
 * Request an Agora session token. Only issued after payment is confirmed.
 * Frontend never implements token generation — server-only.
 * See 15_Realtime_Communication_Agora.md §2, 18_API_Integration_Contracts §2.
 */
export async function createAgoraSession(
  _input: CreateAgoraSessionInput,
): Promise<CreateAgoraSessionResponse> {
  throw new Error('Not implemented — see 18_API_Integration_Contracts §2 (create-agora-session)');
}

/**
 * Report session join/leave timestamps after a consultation ends.
 * Timestamps must be server-recorded — not client-provided timers.
 * See 15_Realtime_Communication_Agora.md §5, 18_API_Integration_Contracts §2.
 */
export async function reportSessionDuration(
  _input: ReportSessionDurationInput,
): Promise<ReportSessionDurationResponse> {
  throw new Error('Not implemented — see 18_API_Integration_Contracts §2 (report-session-duration)');
}

/**
 * Submit a review for a completed consultation.
 * Only allowed after consultation.status = completed.
 * See 18_API_Integration_Contracts §3, table: consultation_reviews.
 */
export async function submitConsultationReview(
  _review: Pick<ConsultationReview, 'consultation_id' | 'profile_id' | 'lawyer_id' | 'rating' | 'review_text'>,
): Promise<ConsultationReview> {
  throw new Error('Not implemented — see 18_API_Integration_Contracts §3, table: consultation_reviews');
}
