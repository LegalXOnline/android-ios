import { Stack } from 'expo-router';

export default function ConsultationLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, gestureEnabled: false }}>
      <Stack.Screen name="[id]" />
    </Stack>
  );
}
