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
import { validateEmail, validateName, validatePhone } from '@shared/utils/validation';
import { Colors, FontSize, FontWeight, Layout, Spacing, Typography } from '@theme';

export function SignupScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSignup = () => {
    if (!validateName(name)) {
      setErrorMsg('Please enter your full name (minimum 2 characters).');
      return;
    }

    if (!validateEmail(email)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (!validatePhone(phone)) {
      setErrorMsg('Please enter a valid 10-digit mobile phone number.');
      return;
    }

    if (!password || password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please check and try again.');
      return;
    }

    setErrorMsg('');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    router.push('/(auth)/otp' as any);
  };

  const handleGoToLogin = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    router.push('/(auth)/login' as any);
  };

  return (
    <SafeScreenWrapper edges={['top', 'left', 'right']}>
      <AppHeader title="Create Account" showBack onBackPress={() => router.back()} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerBlock}>
          <Text style={styles.title}>Join LegalX</Text>
          <Text style={styles.subtitle}>
            Create your customer account to access verified legal documentation and advocate consultations.
          </Text>
        </View>

        <View style={styles.formBlock}>
          <AppTextInput
            label="Full Name"
            value={name}
            onChangeText={(text) => {
              setName(text);
              if (errorMsg) setErrorMsg('');
            }}
            placeholder="e.g. Prince Kumar"
            testID="signup-name-input"
          />

          <AppTextInput
            label="Email Address"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (errorMsg) setErrorMsg('');
            }}
            placeholder="user@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            testID="signup-email-input"
          />

          <AppTextInput
            label="Mobile Phone Number"
            value={phone}
            onChangeText={(text) => {
              setPhone(text);
              if (errorMsg) setErrorMsg('');
            }}
            placeholder="+91 98765 43210"
            keyboardType="phone-pad"
            testID="signup-phone-input"
          />

          <AppTextInput
            label="Password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (errorMsg) setErrorMsg('');
            }}
            placeholder="••••••••"
            secureTextEntry
            testID="signup-password-input"
          />

          <AppTextInput
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              if (errorMsg) setErrorMsg('');
            }}
            placeholder="••••••••"
            secureTextEntry
            testID="signup-confirm-password-input"
          />

          {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

          <PrimaryButton
            label="Continue to Verification"
            onPress={handleSignup}
            testID="signup-submit-button"
          />
        </View>

        <View style={styles.footerBlock}>
          <SecondaryButton
            label="Already have an account? Sign In"
            onPress={handleGoToLogin}
            testID="signup-login-button"
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
    marginBottom: Spacing.xl,
  },
});
