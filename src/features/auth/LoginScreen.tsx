import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import {
  AppHeader,
  AppTextInput,
  PrimaryButton,
  SafeScreenWrapper,
  SecondaryButton,
} from '@shared/components';
import { Colors, FontSize, FontWeight, Layout, Spacing, Typography } from '@theme';

export function LoginScreen() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = () => {
    if (!identifier.trim()) {
      setErrorMsg('Please enter your registered phone number or email.');
      return;
    }
    setErrorMsg('');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    router.push('/(auth)/otp' as any);
  };

  const handleGoToSignup = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    router.push('/(auth)/signup' as any);
  };

  const handleForgotPassword = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    router.push('/(auth)/forgot-password' as any);
  };

  const handleSkipToHome = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    router.replace('/(tabs)' as any);
  };

  return (
    <SafeScreenWrapper edges={['top', 'left', 'right']}>
      <AppHeader title="Sign In" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerBlock}>
          <Text style={styles.title}>Welcome Back to LegalX</Text>
          <Text style={styles.subtitle}>
            Enter your credentials to access verified legal services & consultation history.
          </Text>
        </View>

        <View style={styles.formBlock}>
          <AppTextInput
            label="Phone Number or Email"
            value={identifier}
            onChangeText={setIdentifier}
            placeholder="e.g. +91 98765 43210 or user@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            testID="login-identifier-input"
          />

          <AppTextInput
            label="Password (Optional for OTP)"
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            secureTextEntry
            testID="login-password-input"
          />

          {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

          <Pressable onPress={handleForgotPassword} style={styles.forgotBtn}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </Pressable>

          <PrimaryButton
            label="Send OTP / Sign In"
            onPress={handleLogin}
            testID="login-submit-button"
          />
        </View>

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.footerBlock}>
          <SecondaryButton
            label="Create New Account"
            onPress={handleGoToSignup}
            testID="login-signup-button"
          />

          <Pressable onPress={handleSkipToHome} style={styles.skipBtn}>
            <Text style={styles.skipText}>Continue as Guest →</Text>
          </Pressable>
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
  forgotBtn: {
    alignSelf: 'flex-end',
  },
  forgotText: {
    fontSize: FontSize.bodySmall,
    color: Colors.primary,
    fontWeight: FontWeight.semibold,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginVertical: Spacing.xs,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    fontSize: FontSize.bodySmall,
    color: Colors.textSecondary,
  },
  footerBlock: {
    gap: Spacing.md,
  },
  skipBtn: {
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  skipText: {
    fontSize: FontSize.body,
    color: Colors.textSecondary,
    fontWeight: FontWeight.medium,
  },
});
