import { api } from './api';

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
}

export function getAgoraSession(consultationId: string): Promise<AgoraSession> {
  return api<AgoraSession>(`/api/consultations/${consultationId}/agora-token`);
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
