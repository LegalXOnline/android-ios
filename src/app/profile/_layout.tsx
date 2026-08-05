/**
 * Profile stack layout.
 *
 * Profile is NOT a tab — it is a stack pushed from the Home avatar icon.
 * See 02_Information_Architecture.md §1, 24_AI_BUILD_GUIDE.md §11.
 *
 * Profile sub-screens (SCR-16 through SCR-22):
 *   - index        → Profile root (SCR-16)
 *   - edit         → Edit Profile (SCR-17)
 *   - lx-coins     → LX Coins balance view (SCR-18, view-only)
 *   - favourites   → Favourite Lawyers (SCR-19)
 *   - call-history → Call History (SCR-20)
 *   - transactions → Transactions (SCR-21)
 *   - support      → Support (SCR-22)
 */
import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="edit" />
      <Stack.Screen name="lx-coins" />
      <Stack.Screen name="favourites" />
      <Stack.Screen name="call-history" />
      <Stack.Screen name="transactions" />
      <Stack.Screen name="support" />
    </Stack>
  );
}
