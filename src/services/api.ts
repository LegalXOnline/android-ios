import { getAccessToken } from './supabase';

/**
 * Calls the LegalX backend.
 *
 * Auth is the Bearer token from Supabase, which the backend accepts alongside
 * the web's cookies and which its CSRF guard deliberately exempts. Nothing here
 * touches cookies, so web sessions are unaffected.
 */

const BASE = process.env.EXPO_PUBLIC_API_URL ?? 'https://legalx-backend-gl4b.onrender.com';

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code?: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

interface Options extends Omit<RequestInit, 'body'> {
  body?: unknown;
  /** Public endpoints skip the token lookup. */
  auth?: boolean;
}

/**
 * Absolute URL for a relative API path.
 *
 * The API returns photo paths rather than signed URLs so it can re-sign on
 * every request. An <Image> needs the full address, and on a device there is
 * no page origin to resolve a leading slash against.
 */
export function apiAssetUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  return `${BASE}${path}`;
}

export async function api<T>(path: string, options: Options = {}): Promise<T> {
  const { body, auth = true, headers, ...rest } = options;

  const finalHeaders: Record<string, string> = {
    Accept: 'application/json',
    ...(headers as Record<string, string>),
  };
  if (body !== undefined) finalHeaders['Content-Type'] = 'application/json';

  if (auth) {
    const token = await getAccessToken();
    if (token) finalHeaders.Authorization = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, {
      ...rest,
      headers: finalHeaders,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    // The backend is on a free tier that cold-starts, so an unreachable host is
    // as likely to be a sleeping server as a missing network.
    throw new ApiError('Could not reach LegalX. Check your connection and try again.', 0);
  }

  const text = await res.text();
  const data = text ? safeParse(text) : null;

  if (!res.ok) {
    const payload = data as ErrorPayload | null;
    const message = firstFieldError(payload) ?? payload?.error ?? fallbackMessage(res.status);
    throw new ApiError(message, res.status, payload?.code);
  }

  return data as T;
}

interface ErrorPayload {
  error?: string;
  code?: string;
  details?: Record<string, string[]>;
}

/**
 * A zod failure answers with "Validation failed" and the real reasons in
 * details. Showing the first of those is the only version worth reading.
 */
function firstFieldError(payload: ErrorPayload | null): string | undefined {
  for (const messages of Object.values(payload?.details ?? {})) {
    if (messages?.length) return messages[0];
  }
  return undefined;
}

function safeParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function fallbackMessage(status: number): string {
  if (status === 401) return 'Please sign in again.';
  if (status === 403) return 'You do not have access to that.';
  if (status === 429) return 'Too many attempts. Please wait a few minutes.';
  if (status >= 500) return 'LegalX is having trouble right now. Please try again shortly.';
  return 'Something went wrong. Please try again.';
}
