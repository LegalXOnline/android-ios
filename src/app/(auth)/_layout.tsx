/**
 * Auth stack layout.
 * Handles: Onboarding (SCR-00a) and Login/Sign-up (SCR-00b).
 * Spec: 14_Auth_and_Roles.md
 *
 * Auth method: Phone OTP (primary), Google Sign-In (secondary).
 * Buyer authentication only — no lawyer login in this app.
 */
import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="login" />
    </Stack>
  );
}
