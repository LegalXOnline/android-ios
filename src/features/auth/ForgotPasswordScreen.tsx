import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import {
  AppHeader,
  AppTextInput,
  PrimaryButton,
  SafeScreenWrapper,
  SecondaryButton,
} from '@shared/components';
import { Colors, FontSize, FontWeight, Layout, Spacing, Typography } from '@theme';

export function ForgotPasswordScreen() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleReset = () => {
    if (!identifier.trim()) {
      setErrorMsg('Please enter your phone number or registered email.');
      return;
    }
    setErrorMsg('');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    router.push('/(auth)/otp' as any);
  };

  return (
    <SafeScreenWrapper edges={['top', 'left', 'right']}>
      <AppHeader title="Reset Password" showBack onBackPress={() => router.back()} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerBlock}>
          <Text style={styles.title}>Forgot Password?</Text>
          <Text style={styles.subtitle}>
            Enter your mobile phone number or email address. We will send you a 6-digit OTP code to verify your account.
          </Text>
        </View>

        <View style={styles.formBlock}>
          <AppTextInput
            label="Phone Number or Email"
            value={identifier}
            onChangeText={setIdentifier}
            placeholder="+91 98765 43210 or user@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            testID="forgot-identifier-input"
          />

          {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

          <PrimaryButton
            label="Send Reset Code"
            onPress={handleReset}
            testID="forgot-submit-button"
          />
        </View>

        <View style={styles.footerBlock}>
          <SecondaryButton
            label="Back to Sign In"
            onPress={() => router.back()}
            testID="forgot-back-button"
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
    paddingVertical: Spacing.lg,
    gap: Spacing.xl,
  },
  headerBlock: {
    gap: Spacing.xs,
  },
  title: {
    ...Typography.h1,
    fontSize: 24,
    color: Colors.ink,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  formBlock: {
    gap: Spacing.md,
  },
  errorText: {
    fontSize: FontSize.bodySmall,
    color: Colors.danger,
    fontWeight: FontWeight.medium,
  },
  footerBlock: {
    gap: Spacing.md,
  },
});
