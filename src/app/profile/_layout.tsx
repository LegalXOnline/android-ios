import { Stack } from 'expo-router';

/**
 * initialRouteName is explicit on purpose: without it the router picks a screen
 * from this list and the one that was asked for arrives afterwards, which reads
 * as a page opening and then being replaced.
 */
export const unstable_settings = { initialRouteName: 'index' };

export default function ProfileLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="edit" />
      <Stack.Screen name="orders" />
      <Stack.Screen name="lx-coins" />
      <Stack.Screen name="favourites" />
      <Stack.Screen name="saved-articles" />
      <Stack.Screen name="call-history" />
      <Stack.Screen name="support" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="notifications" />
    </Stack>
  );
}
