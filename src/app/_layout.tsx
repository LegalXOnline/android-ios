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
import { useEffect } from 'react';

import { Providers } from '@providers/index';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    // Hide splash once the layout has mounted.
    // Individual screens are responsible for ensuring their critical data
    // is loaded before this point if they need to delay the splash further.
    SplashScreen.hideAsync();
  }, []);

  return (
    <Providers>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Authenticated tab navigator */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        {/* Auth / onboarding flow */}
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        {/* Profile stack — pushed from Home avatar, not a tab */}
        <Stack.Screen name="profile" options={{ headerShown: false }} />
        {/* 404 fallback */}
        <Stack.Screen name="+not-found" />
      </Stack>
    </Providers>
  );
}
