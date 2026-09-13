import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

/**
 * One Supabase client for the whole app.
 *
 * Only Auth is used here. Data goes through the LegalX backend, which applies
 * the business rules — suspension checks, credit, billing — that a direct table
 * read would bypass.
 */

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  throw new Error(
    'Missing EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_ANON_KEY. Copy .env.example to .env.local.',
  );
}

/**
 * Expo Router renders web routes in Node first, where AsyncStorage reaches for
 * a window that does not exist. Native never takes this branch.
 */
const memory = new Map<string, string>();
const storage =
  typeof window === 'undefined'
    ? {
        getItem: async (k: string) => memory.get(k) ?? null,
        setItem: async (k: string, v: string) => void memory.set(k, v),
        removeItem: async (k: string) => void memory.delete(k),
      }
    : AsyncStorage;

export const supabase = createClient(url, anonKey, {
  auth: {
    storage,
    persistSession: true,
    autoRefreshToken: true,
    // No URL to parse in a native app; leaving this on makes the client wait
    // on a browser API that never resolves.
    detectSessionInUrl: false,
  },
});

/** Current access token, refreshed by the client if it has expired. */
export async function getAccessToken(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}
