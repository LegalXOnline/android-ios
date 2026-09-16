import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

import { useAuth } from './AuthProvider';
import { getProfile, type ClientProfile } from '@services/profile.service';

/**
 * The account record, read once and shared.
 *
 * The avatar shows in the home header, the profile screen and the edit screen.
 * Fetching it separately in each meant three requests and three chances for
 * one of them to be stale — change the photo and the header kept the old one
 * until the app restarted.
 */
interface ProfileState {
  profile: ClientProfile | null;
  loading: boolean;
  /** Re-reads the record. Call after any write. */
  refresh: () => Promise<void>;
  /** Applies a known change immediately, so the UI does not wait on a round trip. */
  apply: (patch: Partial<ClientProfile>) => void;
}

const Ctx = createContext<ProfileState | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ClientProfile | null>(null);
  const [loading, setLoading] = useState(false);

  const [attempt, setAttempt] = useState(0);

  /** Re-reads on the next tick. Safe to call from an effect or a handler. */
  const refresh = useCallback(async () => {
    setAttempt((n) => n + 1);
  }, []);

  // Every write happens after an await, so the effect never sets state
  // synchronously and cannot cascade a render.
  useEffect(() => {
    if (!user) return;

    let cancelled = false;
    (async () => {
      try {
        const next = await getProfile();
        if (!cancelled) setProfile(next);
      } catch {
        // Screens fall back to the session's name; a failed read must not take
        // the app down.
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user, attempt]);

  const apply = useCallback((patch: Partial<ClientProfile>) => {
    setProfile((p) => (p ? { ...p, ...patch } : p));
  }, []);

  // Signing out drops the record without writing state from an effect: no
  // user, nothing to show, whatever was fetched before is not theirs.
  const value = useMemo(
    () => ({ profile: user ? profile : null, loading, refresh, apply }),
    [user, profile, loading, refresh, apply],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useProfile(): ProfileState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useProfile must be used inside ProfileProvider');
  return ctx;
}

/**
 * Name, initials and photo, resolved from the profile with the session as the
 * fallback — so a screen renders something before the profile arrives.
 */
export function useIdentity() {
  const { user } = useAuth();
  const { profile } = useProfile();

  const firstName = profile?.firstName || user?.firstName || '';
  const lastName = profile?.lastName || user?.lastName || '';

  return {
    firstName,
    lastName,
    name: `${firstName} ${lastName}`.trim(),
    email: profile?.email || user?.email || '',
    phone: profile?.phone ?? '',
    avatarUrl: profile?.avatarUrl ?? null,
    initials: `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase() || 'LX',
  };
}
