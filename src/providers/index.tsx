/**
 * Providers root — composes all app-level providers.
 *
 * All providers that wrap the entire app go here.
 * Import this once in src/app/_layout.tsx.
 *
 * Current providers:
 *   - AuthProvider: session restore and the signed-in user
 *   - GestureHandlerRootView: required for react-native-gesture-handler
 *   - SafeAreaProvider: required for react-native-safe-area-context
 */
import type { ReactNode } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider } from './AuthProvider';
import { ProfileProvider } from './ProfileProvider';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <ProfileProvider>{children}</ProfileProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
