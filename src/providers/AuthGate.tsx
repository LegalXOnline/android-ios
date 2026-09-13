import { useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import type { ReactNode } from 'react';
import * as SplashScreen from 'expo-splash-screen';

import { useAuth } from './AuthProvider';

/**
 * Sends people where their session says they belong.
 *
 * The navigator is always rendered. Returning a loading view in its place
 * leaves the router with nothing to match, so the redirect below lands on a
 * tree that does not exist yet and the app comes up blank. The splash stays up
 * instead, which is what hides the first frame on device.
 */
export function AuthGate({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!loading) SplashScreen.hideAsync().catch(() => {});
  }, [loading]);

  useEffect(() => {
    if (loading) return;
    const inAuth = segments[0] === '(auth)';

    if (!user && !inAuth) router.replace('/(auth)/onboarding');
    else if (user && inAuth) router.replace('/(tabs)');
  }, [user, loading, segments, router]);

  return <>{children}</>;
}
