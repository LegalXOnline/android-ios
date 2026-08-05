/**
 * 404 — Not Found fallback.
 * Expo Router renders this when no matching route is found.
 */
import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Colors, Typography } from '@theme';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Not Found' }} />
      <View style={styles.container}>
        <Text style={styles.heading}>This screen does not exist.</Text>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <Link href={'/(tabs)' as any} style={styles.link}>
          <Text style={styles.linkText}>Go to Home</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
    padding: 20,
  },
  heading: {
    ...Typography.h1,
    color: Colors.ink,
    marginBottom: 16,
    textAlign: 'center',
  },
  link: {
    marginTop: 12,
  },
  linkText: {
    ...Typography.body,
    color: Colors.primary,
  },
});
