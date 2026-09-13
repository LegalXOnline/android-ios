import { useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { useAuth } from './AuthProvider';
import { M3 } from '@theme';

/**
 * Sends people where their session says they belong.
 *
 * Held until the stored session has been read, so a returning user never sees
 * the login screen flash before being let through.
 */
export function AuthGate({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    const inAuth = segments[0] === '(auth)';

    if (!user && !inAuth) router.replace('/(auth)/onboarding');
    else if (user && inAuth) router.replace('/(tabs)');
  }, [user, loading, segments, router]);

  if (loading) {
    return (
      <View style={styles.splash}>
        <ActivityIndicator color={M3.primary} size="large" />
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: M3.surface,
  },
});
