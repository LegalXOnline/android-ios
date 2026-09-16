/**
 * Validation utilities — shared across screens.
 *
 * Pure functions. Used by form screens: Edit Profile (SCR-17),
 * Billing user details (SCR-13).
 *
 * Rules:
 * - Required vs. optional fields per 12_Module_Profile §3.1
 *   and 11_Module_Billing_Payments §2.1.
 */

// ─── Phone ────────────────────────────────────────────────────────────────────

/**
 * Validate an Indian phone number (10 digits, starting with 6-9).
 * Used for phone OTP auth and billing contact field.
 */
export function isValidIndianPhone(phone: string): boolean {
  return /^[6-9]\d{9}$/.test(phone.replace(/\s/g, ''));
}

// ─── OTP ──────────────────────────────────────────────────────────────────────

/** Validate a 6-digit OTP code. */
export function isValidOtp(otp: string): boolean {
  return /^\d{6}$/.test(otp);
}

// ─── Name ─────────────────────────────────────────────────────────────────────

/** Validate a non-empty name string (at least 2 characters). */
export function isValidName(name: string): boolean {
  return name.trim().length >= 2;
}

// ─── Email ────────────────────────────────────────────────────────────────────

/** Basic email format validation. */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

// ─── Pincode ──────────────────────────────────────────────────────────────────

/** Validate a 6-digit Indian pincode. */
export function isValidPincode(pincode: string): boolean {
  return /^\d{6}$/.test(pincode.trim());
}

// ─── Coupon ───────────────────────────────────────────────────────────────────

/**
 * Validate coupon code format (client-side format only).
 * Server-side validation is performed by create-order Edge Function.
 * See 16_Payments_Razorpay §5.
 */
export function isValidCouponFormat(code: string): boolean {
  // Alphanumeric, 3–20 chars, uppercase
  return /^[A-Z0-9]{3,20}$/.test(code.trim().toUpperCase());
}

// ─── Rating ───────────────────────────────────────────────────────────────────

/** Validate a consultation review rating (1–5). */
export function isValidRating(rating: number): boolean {
  return Number.isInteger(rating) && rating >= 1 && rating <= 5;
}
