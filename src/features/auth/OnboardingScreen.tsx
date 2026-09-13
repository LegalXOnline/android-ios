import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@shared/components';
import { M3, Shape, TypeScale } from '@theme';

export function OnboardingScreen() {
  const router = useRouter();

  return (
    <View style={styles.screen}>
      <View style={styles.brand}>
        <View style={styles.mark}>
          <Text style={styles.markText}>LX</Text>
        </View>
        <Text style={styles.wordmark}>
          LegalX<Text style={{ color: M3.primary }}>Online</Text>
        </Text>
        <Text style={styles.tagline}>
          Talk to a verified advocate in minutes. Chat, voice or video — charged by the
          minute, only for the time you use.
        </Text>
      </View>

      <View style={styles.actions}>
        <PrimaryButton label="Create an account" onPress={() => router.push('/(auth)/signup')} />
        <PrimaryButton
          label="I already have an account"
          variant="text"
          onPress={() => router.push('/(auth)/login')}
        />
        <Text style={styles.legal}>
          Advocates on LegalX are verified against their Bar Council enrolment.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: M3.surface,
    paddingHorizontal: 24,
    paddingTop: 96,
    paddingBottom: 48,
    justifyContent: 'space-between',
  },
  brand: { gap: 20 },
  mark: {
    width: 72,
    height: 72,
    borderRadius: Shape.extraLarge,
    backgroundColor: M3.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markText: {
    ...TypeScale.headlineMedium,
    color: M3.onPrimaryContainer,
    letterSpacing: 1,
  },
  wordmark: { ...TypeScale.displaySmall, color: M3.onSurface },
  tagline: { ...TypeScale.bodyLarge, color: M3.onSurfaceVariant, maxWidth: 320 },
  actions: { gap: 12 },
  legal: {
    ...TypeScale.bodySmall,
    color: M3.onSurfaceVariant,
    textAlign: 'center',
    marginTop: 4,
  },
});
