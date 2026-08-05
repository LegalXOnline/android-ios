/**
 * API request/response types — LegalX V1
 *
 * Types for every Edge Function in 18_API_Integration_Contracts.md §2.
 * These types define the seam between frontend and backend.
 * Backend (interns) implement the functions; frontend consumes them.
 */

import type {
  ConsultationMode,
  ConsultationOrderMetadata,
  DocumentOrderMetadata,
  OrderType,
  VerificationOrderMetadata,
} from './database.types';

// ─── create-order (§2, row 1) ─────────────────────────────────────────────────

export type CreateOrderMetadataInput =
  | DocumentOrderMetadata
  | VerificationOrderMetadata
  | ConsultationOrderMetadata;

export interface CreateOrderInput {
  order_type: OrderType;
  item_id: string;
  metadata: CreateOrderMetadataInput;
  coupon_code?: string;
}

export interface CreateOrderResponse {
  order_id: string;
  razorpay_order_id: string;
}

// ─── upload-verification-document (§2, row 2) ─────────────────────────────────

export interface UploadVerificationDocumentInput {
  file: Blob;
  profile_id: string;
}

export interface UploadVerificationDocumentResponse {
  uploaded_file_url: string;
}

// ─── create-agora-session (§2, row 4) ─────────────────────────────────────────

export interface CreateAgoraSessionInput {
  consultation_id: string;
}

export interface CreateAgoraSessionResponse {
  agora_token: string;
  channel_name: string;
}

// ─── report-session-duration (§2, row 5) ──────────────────────────────────────

export interface ReportSessionDurationInput {
  consultation_id: string;
  /** Server-recorded join timestamp (ISO string) */
  join_at: string;
  /** Server-recorded leave timestamp (ISO string) */
  leave_at: string;
}

export interface ReportSessionDurationResponse {
  actual_duration_minutes: number;
}

// ─── process-refund (§2, row 6) ───────────────────────────────────────────────

export type RefundType = 'no_show' | 'undertime' | 'cancellation';

export interface ProcessRefundInput {
  order_id: string;
  refund_type: RefundType;
  amount: number;
}

export interface ProcessRefundResponse {
  refund_status: string;
}

// ─── sync-lawyer-availability (§2, row 8) ─────────────────────────────────────

export interface SyncLawyerAvailabilityInput {
  lawyer_id: string;
  /** Array of ISO date strings — app enforces 5-day window on read */
  date_range: string[];
}

export interface AvailableSlot {
  date: string;
  time_slot: string;
}

export interface SyncLawyerAvailabilityResponse {
  available_slots: AvailableSlot[];
}

// ─── Razorpay checkout payload (16_Payments_Razorpay.md) ─────────────────────

export interface RazorpayCheckoutOptions {
  key: string;
  amount: number; // in paise
  currency: 'INR';
  order_id: string; // razorpay_order_id from create-order
  name: string;
  description: string;
  prefill: {
    name: string;
    contact: string;
    email?: string;
  };
}

export interface RazorpayPaymentResult {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

// ─── Consistent API error shape (18 §7) ──────────────────────────────────────

export interface ApiError {
  code: string;
  message: string; // Human-readable — never raw stack traces to the user
}

export interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
}

// ─── Lawyer listing query params ──────────────────────────────────────────────

export type ConsultationModeFilter = ConsultationMode | 'all';

export interface LawyerListingFilters {
  practice_area?: string;
  language?: string;
  mode?: ConsultationModeFilter;
  is_available_now?: boolean;
  search_query?: string;
}

export interface LawyerListingParams {
  filters?: LawyerListingFilters;
  page?: number;
  page_size?: number;
}
