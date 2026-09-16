/**
 * Database entity types — LegalX V1
 *
 * Field names match 13_Data_Model_Supabase_Schema.md EXACTLY.
 * Do NOT rename fields — the data model field names are the API contract.
 */

// ─── profiles (§2.1) ─────────────────────────────────────────────────────────

export interface Profile {
  id: string; // = Supabase Auth user id
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  email_verified: boolean;
  phone: string | null;
  phone_verified: boolean;
  address: string | null;
  state: string | null;
  city: string | null;
  pincode: string | null;
  gender: string | null;
  created_at: string;
}

// ─── wallets (§2.2) ──────────────────────────────────────────────────────────

export interface Wallet {
  profile_id: string;
  /** View-only balance in V1 — no recharge. See 12_Module_Profile.md §4. */
  lx_coin_balance: number;
  /** Pre-authorization hold for consultation (Model A). May be null. */
  held_amount: number | null;
}

// ─── services (§2.3) — the 8 fixed document services ─────────────────────────

export interface ChecklistItem {
  name: string;
  formats: string[];
  max_size_mb: number;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface HowItWorksStep {
  step: number;
  title: string;
  description: string;
}

export interface ServiceSubtype {
  id: string;
  title: string;
  description: string;
}

export interface Service {
  id: string; // e.g. 'gst-registration'
  title: string;
  tag: string;
  breadcrumb: string;
  description: string;
  price_line: string;
  price_numeric: number;
  video_url: string | null;
  key_details: string[];
  benefits: string[];
  whats_included: string[];
  faq: FaqItem[];
  checklist_required: ChecklistItem[];
  checklist_additional: ChecklistItem[];
  how_it_works_steps: HowItWorksStep[];
  /** true for Legal Notice, Rent Agreement, Affidavit */
  has_subtype: boolean;
  subtypes: ServiceSubtype[] | null;
}

// ─── verification_packages (§2.3a) ───────────────────────────────────────────

export interface VerificationPackage {
  id: string;
  title: string;
  price_numeric: number;
  /**
   * Must be true for every V1 package.
   * An AI-only tier (false) is not confirmed for V1 — see 01_Product_Vision.md §4a.
   */
  requires_human_review: boolean;
  included_features: string[];
}

// ─── lawyers (§2.4) ──────────────────────────────────────────────────────────

export interface Lawyer {
  id: string;
  name: string;
  photo_url: string | null;
  /** Must be true for any lawyer shown in the app — compliance rule. */
  is_enrolled_advocate: boolean;
  is_active: boolean;
  bar_enrollment_number: string;
  experience_years: number;
  bio: string;
  languages: string[];
  practice_areas: string[];
  expertise_tags: string[];
  rating_avg: number;
  review_count: number;
  consultation_count: number;
  case_count: number;
  /** Per-minute rate for chat consultations (INR) */
  fee_chat: number;
  /** Per-minute rate for voice consultations (INR) */
  fee_voice: number;
  /** Per-minute rate for video consultations (INR) */
  fee_video: number;
  is_available_now: boolean;
}

// ─── lawyer_availability (§2.5) ──────────────────────────────────────────────

export interface LawyerAvailability {
  lawyer_id: string;
  /** App enforces a 5-day window on read (10_Module_Consultation_Booking.md §3.1) */
  date: string; // ISO date string 'YYYY-MM-DD'
  /** 30-min granularity — pending confirmation (13_Data_Model §2.5) */
  time_slot: string; // e.g. '10:00', '10:30'
  is_booked: boolean;
}

// ─── orders (§2.6) ───────────────────────────────────────────────────────────

export type OrderType = 'document' | 'verification' | 'consultation';
export type OrderStatus = 'pending_payment' | 'paid' | 'failed' | 'refunded';

/** Metadata varies by order_type — use discriminated union pattern. */
export type OrderMetadata =
  | DocumentOrderMetadata
  | VerificationOrderMetadata
  | ConsultationOrderMetadata;

export interface DocumentOrderMetadata {
  /** Selected subtype for services with has_subtype=true (e.g. Legal Notice type) */
  subtype_id?: string;
}

export interface VerificationOrderMetadata {
  uploaded_file_url: string;
  language: string;
  problem_type: string;
}

export type ConsultationMode = 'chat' | 'voice' | 'video';

export interface ConsultationOrderMetadata {
  mode: ConsultationMode;
  scheduled_at: string | null; // null = instant consultation
  is_instant: boolean;
}

export interface Order {
  id: string;
  profile_id: string;
  order_type: OrderType;
  /** service_id | verification_package_id | lawyer_id depending on order_type */
  item_id: string;
  /** Denormalized snapshot — protected if service content changes later */
  item_title: string;
  metadata: OrderMetadata;
  /** Price locked at order creation — never recalculated client-side */
  price_snapshot: number;
  status: OrderStatus;
  created_at: string;
}

// ─── consultations (§2.7) ────────────────────────────────────────────────────

export type ConsultationStatus =
  | 'scheduled'
  | 'in_progress'
  | 'completed'
  | 'no_show'
  | 'cancelled';

export interface Consultation {
  id: string;
  order_id: string;
  lawyer_id: string;
  profile_id: string;
  mode: ConsultationMode;
  scheduled_at: string | null;
  is_instant: boolean;
  agora_session_id: string | null;
  /** Set at session end by server — source of truth for billing true-up */
  actual_duration_minutes: number | null;
  status: ConsultationStatus;
}

// ─── consultation_reviews (§2.8) ─────────────────────────────────────────────

export interface ConsultationReview {
  consultation_id: string;
  profile_id: string;
  lawyer_id: string;
  /** 1–5 rating */
  rating: number;
  review_text: string | null;
}

// ─── favourite_lawyers (§2.9) ─────────────────────────────────────────────────

export interface FavouriteLawyer {
  profile_id: string;
  lawyer_id: string;
  created_at: string;
}

// ─── payments (§2.10) ────────────────────────────────────────────────────────

export type PaymentStatus = 'created' | 'authorized' | 'captured' | 'failed' | 'refunded';

export interface Payment {
  order_id: string;
  razorpay_payment_id: string;
  razorpay_order_id: string;
  amount: number;
  currency: string; // 'INR'
  status: PaymentStatus;
  coupon_code: string | null;
  discount_amount: number | null;
}

// ─── Knowledge Centre article (18_API_Integration_Contracts §4) ──────────────
// Shape fixed now so placeholder components don't need rework when real fetch ships.

export interface KnowledgeArticle {
  headline: string;
  body: string; // Markdown or plain text
  hero_image_url: string;
  category: string;
  sources: string[];
}
