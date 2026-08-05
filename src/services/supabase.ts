/**
 * Supabase client setup — stub.
 *
 * @supabase/supabase-js is NOT yet installed.
 * This file will be replaced with the real Supabase client when the package
 * is installed.
 *
 * The client is initialized once here and imported everywhere else —
 * never create multiple Supabase client instances.
 *
 * Environment variables (from .env.example):
 *   EXPO_PUBLIC_SUPABASE_URL
 *   EXPO_PUBLIC_SUPABASE_ANON_KEY
 *
 * Security: Supabase SDK handles auth token storage via platform-secure storage.
 * Do NOT implement custom token storage. See 14_Auth_and_Roles.md §3,
 * 20_Non_Functional_Requirements.md §2.
 */

// When @supabase/supabase-js is installed, replace this file with:
//
// import { createClient } from '@supabase/supabase-js';
// import Constants from 'expo-constants';
//
// const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl as string;
// const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey as string;
//
// export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
//   auth: { storage: ..., autoRefreshToken: true, persistSession: true },
// });

/** Typed placeholder — replaced when @supabase/supabase-js is installed. */
export const supabase = null as unknown as {
  from: (table: string) => unknown;
  auth: unknown;
  functions: { invoke: (name: string, options?: unknown) => Promise<unknown> };
};
