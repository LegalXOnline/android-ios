import { useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import type { ReactNode } from 'react';
import * as SplashScreen from 'expo-splash-screen';

import { PortalNoticeScreen } from '@features/auth/PortalNoticeScreen';
import { useAuth } from './AuthProvider';
import { usePushRouting } from './usePushRouting';

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

  // Only clients have screens here. Routing a lawyer or an admin into the tabs
  // is what showed an admin account My Orders and an LX balance.
  const clientOnly = user?.role === 'client';

  // A tapped call notification has to land in the room. Enabled only once a
  // client session exists, because that is when those routes are mounted.
  usePushRouting(!loading && clientOnly);

  useEffect(() => {
    if (loading || (user && !clientOnly)) return;
    const inAuth = segments[0] === '(auth)';

    if (!user && !inAuth) router.replace('/(auth)/onboarding');
    else if (user && inAuth) router.replace('/(tabs)');
  }, [user, clientOnly, loading, segments, router]);

  if (user && !clientOnly) {
    return <PortalNoticeScreen role={user.role === 'admin' ? 'admin' : 'lawyer'} />;
  }

  return <>{children}</>;
}
