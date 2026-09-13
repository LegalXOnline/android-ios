import { api } from './api';
import { supabase } from './supabase';

/**
 * Email OTP only, matching the backend exactly.
 *
 * Signup and password recovery run through the LegalX API so the rules, the
 * Resend templates and the account rows are identical to the web — one signup
 * path, not two. Only the final sign-in talks to Supabase directly, because
 * that is what mints the JWT the app then sends as a Bearer token, and what
 * keeps the session alive across restarts.
 */

export type Role = 'client' | 'lawyer';

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role | 'admin';
  freeCreditPaise?: number;
}

export interface SignupDraft {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: Role;
}

// ─── Validation, mirroring src/lib/validation.ts on the backend ──────────────

const EMAIL = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

export function emailError(value: string): string | null {
  const email = value.trim();
  if (!email) return 'Enter your email address';
  if (!EMAIL.test(email)) return 'Enter a valid email address (e.g. you@gmail.com)';
  if (email.length > 255) return 'That email is too long';
  return null;
}

export function passwordError(value: string): string | null {
  if (value.length < 8) return 'Password must be at least 8 characters';
  if (value.length > 128) return 'Password must be under 128 characters';
  if (!/[A-Z]/.test(value)) return 'Password must contain an uppercase letter';
  if (!/[0-9]/.test(value)) return 'Password must contain a number';
  return null;
}

export function nameError(value: string, field: string): string | null {
  const name = value.trim();
  if (!name) return `Enter your ${field}`;
  if (name.length > 50) return `That ${field} is too long`;
  return null;
}

/** Signup codes are minted by the backend and are always six digits. */
export function otpError(value: string): string | null {
  return /^\d{6}$/.test(value.trim()) ? null : 'Enter the 6-digit code from your email';
}

/**
 * Recovery codes come from Supabase, which issues eight digits today but is
 * configurable, so the backend accepts six to ten and so does this.
 */
export function resetOtpError(value: string): string | null {
  return /^\d{6,10}$/.test(value.trim()) ? null : 'Enter the code from your email';
}

// ─── Signup ─────────────────────────────────────────────────────────────────

/** Step 1: validate, reserve the email, send the code. Creates no account. */
export async function requestSignupOtp(draft: SignupDraft): Promise<void> {
  await api('/api/auth/signup/request-otp', { method: 'POST', auth: false, body: draft });
}

/** Step 2: verify the code, create the account, then sign in for a session. */
export async function verifySignupOtp(draft: SignupDraft, otp: string): Promise<AuthUser> {
  await api('/api/auth/signup/verify-otp', {
    method: 'POST',
    auth: false,
    body: { ...draft, otp: otp.trim() },
  });
  return signIn(draft.email, draft.password);
}

// ─── Sign in ────────────────────────────────────────────────────────────────

/**
 * Signing in through Supabase is what persists the session: the client stores
 * it and refreshes it on its own, so reopening the app does not ask for a code
 * again.
 *
 * The profile then comes from the backend, which is the only place that knows
 * whether an account is suspended and what role it really holds.
 */
export async function signIn(email: string, password: string): Promise<AuthUser> {
  const { error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });

  if (error) {
    throw new Error(
      error.message.toLowerCase().includes('invalid')
        ? 'That email and password do not match.'
        : error.message,
    );
  }

  try {
    return await me();
  } catch (err) {
    // A rejected profile means the account cannot be used, so the session it
    // just created should not survive either.
    await supabase.auth.signOut();
    throw err;
  }
}

export async function me(): Promise<AuthUser> {
  const { user } = await api<{ user: AuthUser }>('/api/auth/me');
  return user;
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}

/** A stored session, if one survived the app being closed. */
export async function restoreSession(): Promise<AuthUser | null> {
  const { data } = await supabase.auth.getSession();
  if (!data.session) return null;
  try {
    return await me();
  } catch {
    await supabase.auth.signOut();
    return null;
  }
}

// ─── Password recovery ──────────────────────────────────────────────────────

/** Always resolves: telling a caller whether an address exists is an oracle. */
export async function requestPasswordReset(email: string): Promise<void> {
  await api('/api/auth/forgot-password', {
    method: 'POST',
    auth: false,
    body: { email: email.trim().toLowerCase() },
  });
}

export async function resetPassword(email: string, otp: string, password: string): Promise<void> {
  await api('/api/auth/reset-password', {
    method: 'POST',
    auth: false,
    body: { email: email.trim().toLowerCase(), otp: otp.trim(), password },
  });
}
