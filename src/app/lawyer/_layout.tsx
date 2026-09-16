/**
 * Lawyer stack layout.
 *
 * Routes:
 *   - [id] → Lawyer Profile Detail (SCR-09)
 */
import { Stack } from 'expo-router';

export const unstable_settings = { initialRouteName: '[id]' };

export default function LawyerLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="[id]" />
    </Stack>
  );
}
