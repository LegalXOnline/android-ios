import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import {
  AppHeader,
  AppTextInput,
  PrimaryButton,
  SafeScreenWrapper,
  SecondaryButton,
} from '@shared/components';
import { Colors, FontSize, FontWeight, Layout, Radii, Shadows, Spacing, Typography } from '@theme';

type UserRole = 'User' | 'Lawyer';

export function SignupScreen() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>('User');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [barRegistration, setBarRegistration] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSignup = () => {
    if (!name.trim() || !phone.trim()) {
      setErrorMsg('Please enter your full name and phone number.');
      return;
    }
    if (role === 'Lawyer' && !barRegistration.trim()) {
      setErrorMsg('Bar Council Registration Number is required for Advocates.');
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
            Select your account role to get started with verified legal solutions.
          </Text>
        </View>

        <View style={styles.roleSelectionBlock}>
          <Text style={styles.roleLabel}>I am signing up as:</Text>

          <View style={styles.roleGrid}>
            <Pressable
              onPress={() => setRole('User')}
              accessibilityRole="radio"
              accessibilityState={{ checked: role === 'User' }}
              style={({ pressed }) => [
                styles.roleCard,
                role === 'User' && styles.roleCardSelected,
                pressed && styles.pressed,
              ]}
            >
              <SymbolView
                name={{ ios: 'person.fill', android: 'person', web: 'person' }}
                size={24}
                tintColor={role === 'User' ? Colors.primary : Colors.textSecondary}
              />
              <Text style={[styles.roleTitle, role === 'User' && styles.roleTitleSelected]}>
                Client / Individual
              </Text>
              <Text style={styles.roleSub}>Seek legal services, document reviews & advice</Text>
            </Pressable>

            <Pressable
              onPress={() => setRole('Lawyer')}
              accessibilityRole="radio"
              accessibilityState={{ checked: role === 'Lawyer' }}
              style={({ pressed }) => [
                styles.roleCard,
                role === 'Lawyer' && styles.roleCardSelected,
                pressed && styles.pressed,
              ]}
            >
              <SymbolView
                name={{ ios: 'building.columns.fill', android: 'account_balance', web: 'account_balance' }}
                size={24}
                tintColor={role === 'Lawyer' ? Colors.primary : Colors.textSecondary}
              />
              <Text style={[styles.roleTitle, role === 'Lawyer' && styles.roleTitleSelected]}>
                Enrolled Advocate
              </Text>
              <Text style={styles.roleSub}>Bar Council registered legal practitioner</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.formBlock}>
          <AppTextInput
            label="Full Name"
            value={name}
            onChangeText={setName}
            placeholder="e.g. Prince Kumar"
            testID="signup-name-input"
          />

          <AppTextInput
            label="Mobile Phone Number"
            value={phone}
            onChangeText={setPhone}
            placeholder="+91 98765 43210"
            keyboardType="phone-pad"
            testID="signup-phone-input"
          />

          <AppTextInput
            label="Email Address (Optional)"
            value={email}
            onChangeText={setEmail}
            placeholder="user@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            testID="signup-email-input"
          />

          {role === 'Lawyer' && (
            <AppTextInput
              label="Bar Council Registration Number"
              value={barRegistration}
              onChangeText={setBarRegistration}
              placeholder="e.g. D/1428/2014"
              testID="signup-bar-input"
            />
          )}

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
  roleSelectionBlock: {
    gap: Spacing.sm,
  },
  roleLabel: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.semibold,
    color: Colors.ink,
  },
  roleGrid: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  roleCard: {
    flex: 1,
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radii.card,
    padding: Spacing.md,
    gap: Spacing.xs,
    alignItems: 'flex-start',
    ...Shadows.card,
  },
  roleCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: '#FEFCF5',
  },
  pressed: {
    opacity: 0.85,
  },
  roleTitle: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.semibold,
    color: Colors.ink,
  },
  roleTitleSelected: {
    color: Colors.primary,
  },
  roleSub: {
    fontSize: 11,
    color: Colors.textSecondary,
    lineHeight: 15,
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
