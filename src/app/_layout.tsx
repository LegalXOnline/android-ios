/**
 * Root layout — Expo Router entry point.
 *
 * Rules:
 * - ONE theme only. No DarkTheme / DefaultTheme / color-scheme detection.
 *   See 24_AI_BUILD_GUIDE.md §18.
 * - Wraps the app in all shared providers.
 * - Manages splash screen lifecycle.
 */
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

import { AuthGate } from '@providers/AuthGate';
import { Providers } from '@providers/index';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // AuthGate hides the splash — it knows when the stored session has been read.
  return (
    <Providers>
      <AuthGate>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Authenticated tab navigator */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        {/* Auth / onboarding flow */}
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        {/* Profile stack — pushed from Home avatar, not a tab */}
        <Stack.Screen name="profile" options={{ headerShown: false }} />
        {/* Knowledge Centre detail stacks */}
        <Stack.Screen name="knowledge" options={{ headerShown: false }} />
        <Stack.Screen name="updates" options={{ headerShown: false }} />
        {/* A live consultation — chat, voice or video */}
        <Stack.Screen name="consultation" options={{ headerShown: false }} />
        <Stack.Screen name="lawyer" options={{ headerShown: false }} />
        <Stack.Screen name="billing" options={{ headerShown: false }} />
        {/* 404 fallback */}
        <Stack.Screen name="+not-found" />
      </Stack>
      </AuthGate>
    </Providers>
  );
}
