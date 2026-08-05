/**
 * Verification Stack Layout
 *
 * Routes:
 *   - index        → Verification Landing (Choose Plan)
 *   - upload       → Upload Document & Details
 *   - consultation → Consultation Details (Plan 2 only)
 */
import { Stack } from 'expo-router';

export default function VerificationLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="upload" />
      <Stack.Screen name="consultation" />
    </Stack>
  );
}
