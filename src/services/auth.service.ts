/**
 * Auth service — typed interface stubs.
 *
 * Frontend implements: invoking Supabase Auth client SDK only.
 * Frontend never implements: auth backend logic, token generation,
 * custom session storage. See 14_Auth_and_Roles.md, 24_AI_BUILD_GUIDE §8.
 *
 * Methods stub the Supabase Auth client calls — replace bodies
 * when @supabase/supabase-js is installed.
 */
import type { Profile } from '@/types/database.types';

// ─── Stubs ────────────────────────────────────────────────────────────────────

/**
 * Send OTP to phone number. Primary auth method for India-first UX.
 * See 14_Auth_and_Roles.md §2.1
 */
export async function sendPhoneOtp(_phone: string): Promise<void> {
  throw new Error('Not implemented — see 14_Auth_and_Roles.md §2.1 and Supabase Auth docs');
}

/**
 * Verify 6-digit OTP and create a session.
 * See 14_Auth_and_Roles.md §2.1
 */
export async function verifyPhoneOtp(_phone: string, _code: string): Promise<{ user_id: string; access_token: string }> {
  throw new Error('Not implemented — see 14_Auth_and_Roles.md §2.1 and Supabase Auth docs');
}

/**
 * Google Sign-In — secondary auth method.
 * See 14_Auth_and_Roles.md §2.2
 */
export async function signInWithGoogle(): Promise<{ user_id: string; access_token: string }> {
  throw new Error('Not implemented — see 14_Auth_and_Roles.md §2.2 and Supabase Auth docs');
}

/**
 * Sign out. Clears local session. Does NOT delete server-side data.
 * See 14_Auth_and_Roles.md §3
 */
export async function signOut(): Promise<void> {
  throw new Error('Not implemented — see 14_Auth_and_Roles.md §3');
}

/**
 * Get the current session profile, if any.
 */
export async function getCurrentProfile(): Promise<Profile | null> {
  throw new Error('Not implemented — see 14_Auth_and_Roles.md, 18_API_Integration_Contracts §3');
}
