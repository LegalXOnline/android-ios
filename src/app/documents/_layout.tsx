import { Stack } from 'expo-router';

export const unstable_settings = { initialRouteName: '[slug]' };

export default function DocumentsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="[slug]" />
    </Stack>
  );
}
