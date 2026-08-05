import { Stack } from 'expo-router';

export default function BillingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="payment" />
      <Stack.Screen name="success" />
      <Stack.Screen name="failed" />
    </Stack>
  );
}
