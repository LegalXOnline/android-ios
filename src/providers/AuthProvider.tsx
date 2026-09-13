import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';

import * as auth from '@services/auth.service';
import type { AuthUser } from '@services/auth.service';
import { supabase } from '@services/supabase';

interface AuthState {
  user: AuthUser | null;
  /** True until the stored session has been checked, so routes do not flash. */
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  completeSignup: (draft: auth.SignupDraft, otp: string) => Promise<void>;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
}

const Ctx = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  // Restore on launch. A stored session is what lets a returning user straight
  // back in without another code.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const restored = await auth.restoreSession();
      if (!cancelled) {
        setUser(restored);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Covers sign-out from anywhere and a refresh token that can no longer be
  // spent, both of which have to clear the user rather than leave a stale one.
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT' && mounted.current) setUser(null);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    setUser(await auth.signIn(email, password));
  }, []);

  const completeSignup = useCallback(async (draft: auth.SignupDraft, otp: string) => {
    setUser(await auth.verifySignupOtp(draft, otp));
  }, []);

  const signOut = useCallback(async () => {
    await auth.signOut();
    setUser(null);
  }, []);

  const refresh = useCallback(async () => {
    try {
      setUser(await auth.me());
    } catch {
      setUser(null);
    }
  }, []);

  const value = useMemo(
    () => ({ user, loading, signIn, completeSignup, signOut, refresh }),
    [user, loading, signIn, completeSignup, signOut, refresh],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
