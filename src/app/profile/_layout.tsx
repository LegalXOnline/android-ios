import { Stack } from 'expo-router';

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
    </Stack>
  );
}
