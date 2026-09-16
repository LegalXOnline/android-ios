/**
 * Auth store — structural stub.
 *
 * Zustand is NOT yet installed.
 * This file defines the auth state shape and a typed context-based stand-in
 * so the rest of the app can import from '@store/auth.store' now
 * and replace with real Zustand when the package is installed.
 * "Global state limited to session/auth and in-progress order/booking payload."
 *
 * When zustand is installed:
 *   1. import { create } from 'zustand'
 *   2. Replace the stub with: export const useAuthStore = create<AuthState>(...)
 */
import { createContext, useContext, useState, type ReactNode } from 'react';

import type { Profile } from '@/types/database.types';

// ─── State shape ──────────────────────────────────────────────────────────────

export interface AuthState {
  /** null = not authenticated */
  session: { user_id: string; access_token: string } | null;
  profile: Profile | null;
  isLoading: boolean;
  setSession: (session: AuthState['session']) => void;
  setProfile: (profile: Profile | null) => void;
  clearAuth: () => void;
}

// ─── Stub implementation via React Context ────────────────────────────────────
// Drop-in replaced by Zustand create() when the package is installed.

const AuthStoreContext = createContext<AuthState | null>(null);

export function AuthStoreProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthState['session']>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading] = useState(false);

  const value: AuthState = {
    session,
    profile,
    isLoading,
    setSession,
    setProfile,
    clearAuth: () => {
      setSession(null);
      setProfile(null);
    },
  };

  return <AuthStoreContext.Provider value={value}>{children}</AuthStoreContext.Provider>;
}

export function useAuthStore(): AuthState {
  const store = useContext(AuthStoreContext);
  if (!store) {
    throw new Error('useAuthStore must be used within AuthStoreProvider');
  }
  return store;
}
