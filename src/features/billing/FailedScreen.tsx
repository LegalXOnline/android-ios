import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import {
  AppHeader,
  Badge,
  PrimaryButton,
  SafeScreenWrapper,
  SecondaryButton,
} from '@shared/components';
import { Colors, Layout, Radii, Shadows, Spacing, Typography } from '@theme';

export function FailedScreen() {
  const router = useRouter();

  const handleRetry = () => {
    router.back();
  };

  const handleBackToHome = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    router.replace('/(tabs)' as any);
  };

  return (
    <SafeScreenWrapper edges={['top', 'left', 'right']}>
      <AppHeader title="Payment Failed" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.failedCard}>
          <View style={styles.iconCircle}>
            <SymbolView
              name={{ ios: 'xmark.circle.fill', android: 'cancel', web: 'cancel' }}
              size={56}
              tintColor={Colors.danger}
            />
          </View>

          <Text style={styles.title}>Payment Failed</Text>
          <Text style={styles.subtitle}>
            Your payment could not be processed by your bank. No funds have been debited from your account.
          </Text>
          <Badge label="Transaction Incomplete" variant="danger" />
        </View>

        <View style={styles.actionsBlock}>
          <PrimaryButton
            label="Retry Payment"
            onPress={handleRetry}
            testID="retry-payment-button"
          />
          <SecondaryButton
            label="Back to Home"
            onPress={handleBackToHome}
            testID="failed-back-home-button"
          />
        </View>
      </ScrollView>
    </SafeScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Layout.screenPaddingHWide,
    paddingVertical: Spacing.xl,
    paddingBottom: Spacing.xxl + 20,
    gap: Spacing.xl,
  },
  failedCard: {
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1.5,
    borderColor: Colors.danger,
    borderRadius: Radii.card,
    padding: Spacing.xl,
    alignItems: 'center',
    gap: Spacing.sm,
    ...Shadows.card,
  },
  iconCircle: {
    marginBottom: Spacing.xs,
  },
  title: {
    ...Typography.h1,
    fontSize: 24,
    color: Colors.ink,
  },
  subtitle: {
    ...Typography.body,
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  actionsBlock: {
    gap: Spacing.md,
  },
});
