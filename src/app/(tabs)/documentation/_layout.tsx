/**
 * Documentation stack layout inside Documentation Tab.
 *
 * Routes:
 *   - index → Documentation List (SCR-03)
 *   - [id]  → Service Detail (SCR-04)
 */
import { Stack } from 'expo-router';

export default function DocumentationLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="[id]" />
    </Stack>
  );
}
