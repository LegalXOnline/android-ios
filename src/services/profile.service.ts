import { Platform } from 'react-native';

import { api } from './api';
import { getAccessToken } from './supabase';

/**
 * Wallet balance.
 *
 * Two balances, kept apart the way the backend keeps them: free_credit is a
 * promotional grant and wallet is money the client actually paid. Spendable is
 * the sum, and the only figure worth showing on a card.
 */
export interface WalletSummary {
  freeCreditPaise: number;
  walletPaise: number;
  spendablePaise: number;
  testMode?: boolean;
}

export async function getWalletBalance(): Promise<WalletSummary> {
  return api<WalletSummary>('/api/wallet');
}

/** LX coins are rupees — one coin, one rupee. */
export function toCoins(paise: number): number {
  return Math.floor(paise / 100);
}

/**
 * The account record behind the profile screen.
 *
 * /api/auth/me carries only what the session needs, so phone and photo come
 * from here. avatarUrl is a signed link valid for an hour, not a stored path.
 */
export interface ClientProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatarUrl: string | null;
}

export async function getProfile(): Promise<ClientProfile> {
  const data = await api<{ profile: ClientProfile }>('/api/profile');
  return data.profile;
}

export async function updateProfile(
  input: Partial<Pick<ClientProfile, 'firstName' | 'lastName' | 'phone'>>,
): Promise<ClientProfile> {
  const data = await api<{ profile: ClientProfile }>('/api/profile', {
    method: 'PATCH',
    body: input,
  });
  return data.profile;
}

/**
 * Uploads a profile photo.
 *
 * Not routed through api(): that helper sets a JSON content type, and
 * multipart needs the runtime to write its own boundary.
 */
export async function uploadProfilePhoto(file: {
  uri: string;
  name: string;
  type: string;
}): Promise<string | null> {
  const token = await getAccessToken();
  if (!token) throw new Error('Please sign in again.');

  const body = new FormData();

  if (Platform.OS === 'web') {
    // The browser's FormData has no idea what {uri, name, type} means — it
    // stringifies the object and the server receives a text field instead of a
    // file. The picker's URI has to be read into a real Blob first.
    const blob = await (await fetch(file.uri)).blob();
    body.append('file', new File([blob], file.name, { type: file.type || blob.type }));
  } else {
    // React Native's FormData takes this shape for a file. The cast is what
    // the DOM typings require, and is the documented usage.
    body.append('file', file as unknown as Blob);
  }

  const base = process.env.EXPO_PUBLIC_API_URL ?? 'https://legalx-backend-gl4b.onrender.com';
  const res = await fetch(`${base}/api/profile/photo`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body,
  });

  if (!res.ok) {
    let detail: { error?: string } = {};
    try {
      detail = await res.json();
    } catch {
      // non-JSON error body
    }
    throw new Error(detail.error || 'Could not upload that photo.');
  }

  const data = (await res.json()) as { avatarUrl: string | null };
  return data.avatarUrl;
}

/**
 * In-app notifications for the signed-in account.
 *
 * The same rows the website's bell reads — scoped to the caller by the
 * endpoint, not by a filter sent from here.
 */
export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: string;
  link: string | null;
  is_read: boolean;
  created_at: string;
}

export async function getNotifications(): Promise<AppNotification[]> {
  const data = await api<{ notifications: AppNotification[] }>('/api/notifications?limit=50');
  return data.notifications ?? [];
}
