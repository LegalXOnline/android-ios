
import { api } from './api';
import { uploadMultipart } from './upload';

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
  const { avatarUrl } = await uploadMultipart<{ avatarUrl: string | null }>(
    '/api/profile/photo',
    file,
    'Could not upload that photo.',
  );
  return avatarUrl;
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
  const data = await api<{ notifications: AppNotification[] }>('/api/notifications?pageSize=50');
  return data.notifications ?? [];
}
