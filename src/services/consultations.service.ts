import { api } from './api';
import { uploadMultipart } from './upload';

/**
 * Consultations, against the same endpoints the website uses.
 *
 * A client on the phone and a lawyer on the web meet in the same row and the
 * same Agora channel — nothing here is mobile-specific except which side of it
 * we are on.
 */

export type ConsultationType = 'chat' | 'voice' | 'video';

export interface InitiateResult {
  consultationId: string;
  /** 'balance' means credit covered it; 'razorpay' means payment is required. */
  fundedBy: 'balance' | 'razorpay';
  channelName?: string;
  agoraAppId?: string;
  authToken?: string;
  uid?: number;
  lawyerName?: string;
  type: ConsultationType;
  /** Razorpay path only. */
  razorpayOrderId?: string;
  amount?: number;
  creditHeldPaise?: number;
  creditBalancePaise?: number;
}

export async function initiateConsultation(input: {
  lawyerId: string;
  type: ConsultationType;
  maxMinutes?: number;
}): Promise<InitiateResult> {
  return api<InitiateResult>('/api/consultations/initiate', {
    method: 'POST',
    body: { maxMinutes: 30, ...input },
  });
}

/**
 * A fresh RTC token for a session already running.
 *
 * Tokens expire, and a call that outlives one has to renew rather than drop.
 * The App Certificate never leaves the server.
 */
export interface AgoraSession {
  consultationId: string;
  channelName: string;
  agoraAppId: string;
  token: string;
  uid: number;
  role: 'lawyer' | 'client';
  type: ConsultationType;
  status: string;
  counterpartId: string | null;
  counterpartName: string | null;
  feePerMinute: number | null;
  /** Stamped when the lawyer accepts. Null means nobody answered yet. */
  startedAt: string | null;
  endedAt: string | null;
}

export function getAgoraSession(consultationId: string): Promise<AgoraSession> {
  return api<AgoraSession>(`/api/consultations/${consultationId}/agora-token`);
}

/**
 * Reports that this device is in the media session with the other side.
 *
 * The billing clock starts here rather than when credentials were fetched: a
 * call that never connects must cost nothing, however long it spent trying.
 */
export function reportMediaConnected(consultationId: string) {
  return api<{ startedAt: string | null }>(
    `/api/consultations/${consultationId}/media-connected`,
    { method: 'POST' },
  );
}

export function endConsultation(consultationId: string) {
  return api<{ ok?: boolean }>(`/api/consultations/${consultationId}/end`, { method: 'POST' });
}

export function cancelConsultation(consultationId: string) {
  return api<{ ok?: boolean }>(`/api/consultations/${consultationId}/cancel`, { method: 'PATCH' });
}

// ── Chat ────────────────────────────────────────────────────────────────────

export interface ChatMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string | null;
  attachment_url: string | null;
  attachment_name: string | null;
  attachment_size: number | null;
  created_at: string;
}

export interface ChatState {
  conversationId: string;
  messages: ChatMessage[];
  /** The caller's own account id, so a row can be placed left or right. */
  selfId: string;
  status: string;
  startedAt: string | null;
  endedAt: string | null;
}

export function getMessages(consultationId: string): Promise<ChatState> {
  return api<ChatState>(`/api/consultations/${consultationId}/messages`);
}

export function sendMessage(
  consultationId: string,
  body: { content?: string; attachmentUrl?: string; attachmentName?: string; attachmentSize?: number },
): Promise<{ message: ChatMessage }> {
  return api<{ message: ChatMessage }>(`/api/consultations/${consultationId}/messages`, {
    method: 'POST',
    body,
  });
}

// ── History ─────────────────────────────────────────────────────────────────

export interface ConsultationSummary {
  id: string;
  type: ConsultationType;
  status: string;
  created_at: string;
  started_at: string | null;
  ended_at: string | null;
  fee_per_minute: number | null;
  lawyer_name?: string | null;
}

export async function getMyConsultations(): Promise<ConsultationSummary[]> {
  const data = await api<{ consultations: ConsultationSummary[] }>('/api/consultations/my');
  return data.consultations ?? [];
}


/**
 * Uploads a document into a consultation's transcript.
 *
 * Deliberately not the service-checklist uploader: that one writes to the
 * client-docs bucket under the uploader's own folder, and the endpoint that
 * hands the file back to the other side only serves `chat/<consultationId>/`
 * out of the lawyer-docs bucket. A file sent through the wrong one uploads
 * fine and is then unopenable by the person it was sent to.
 *
 * Returns the storage path, never a URL. The bucket is private and the link is
 * signed on read, so a URL stored in the transcript would stop working.
 */
export async function uploadChatAttachment(
  consultationId: string,
  file: { uri: string; name: string; type: string },
): Promise<{ path: string; name: string; size: number }> {
  return uploadMultipart<{ path: string; name: string; size: number }>(
    `/api/upload/chat-attachment?consultationId=${encodeURIComponent(consultationId)}`,
    file,
    'Could not upload that document.',
  );
}


/**
 * A temporary link to one document from a consultation.
 *
 * Asked for as JSON rather than following the endpoint's redirect. The signed
 * URL is what gets handed to a viewer, and reading a Location header back out
 * of a redirect is not something every runtime exposes — the browser still
 * gets the redirect, which is what an <img> or a download needs.
 */
export async function attachmentUrl(consultationId: string, path: string): Promise<string> {
  const { url } = await api<{ url: string }>(
    `/api/consultations/${consultationId}/attachment?format=json&path=${encodeURIComponent(path)}`,
  );
  return url;
}
