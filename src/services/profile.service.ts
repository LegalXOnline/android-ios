/**
 * Profile service — typed interface stubs.
 *
 * Direct Supabase client calls (own-row RLS). No Edge Function needed.
 * See 18_API_Integration_Contracts.md §3.
 */
import type { Profile, Wallet } from '@/types/database.types';

/** Fetch the current user's profile. */
export async function getProfile(_profileId: string): Promise<Profile> {
  throw new Error('Not implemented — see 18_API_Integration_Contracts §3, table: profiles');
}

/** Update the current user's profile fields. */
export async function updateProfile(_profileId: string, _updates: Partial<Profile>): Promise<Profile> {
  throw new Error('Not implemented — see 18_API_Integration_Contracts §3, table: profiles');
}

/** Fetch the current user's LX Coin wallet balance. View-only in V1. */
export async function getWallet(_profileId: string): Promise<Wallet> {
  throw new Error('Not implemented — see 18_API_Integration_Contracts §3, table: wallets');
}
