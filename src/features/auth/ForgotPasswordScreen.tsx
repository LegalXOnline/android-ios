import { useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import {
  emailError,
  otpError,
  passwordError,
  requestPasswordReset,
  resetPassword,
} from '@services/auth.service';
import { AppTextInput, PrimaryButton, SafeScreenWrapper } from '@shared/components';
import { M3, TypeScale } from '@theme';

type Step = 'email' | 'reset';

export function ForgotPasswordScreen() {
  const router = useRouter();

  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const sendCode = async () => {
    const invalid = emailError(email);
    if (invalid) {
      setErrors({ email: invalid });
      return;
    }

    setErrors({});
    setBusy(true);
    try {
      await requestPasswordReset(email);
      setStep('reset');
    } catch (err) {
      setErrors({ form: (err as Error).message });
    } finally {
      setBusy(false);
    }
  };

  const submitReset = async () => {
    const next = {
      otp: otpError(otp) ?? undefined,
      password: passwordError(password) ?? undefined,
    };
    if (next.otp || next.password) {
      setErrors(next);
      return;
    }

    setErrors({});
    setBusy(true);
    try {
      await resetPassword(email, otp, password);
      setDone(true);
    } catch (err) {
      setErrors({ form: (err as Error).message });
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    return (
      <SafeScreenWrapper edges={['top', 'left', 'right']}>
        <View style={styles.content}>
          <Text style={styles.title}>Password changed</Text>
          <Text style={styles.subtitle}>Sign in with your new password.</Text>
          <PrimaryButton label="Back to sign in" onPress={() => router.replace('/(auth)/login')} />
        </View>
      </SafeScreenWrapper>
    );
  }

  return (
    <SafeScreenWrapper edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Reset your password</Text>
            <Text style={styles.subtitle}>
              {step === 'email'
                ? 'Enter the email on your account and we will send a 6-digit code.'
                : `Enter the code we sent to ${email} and choose a new password.`}
            </Text>
          </View>

          <View style={styles.form}>
            {step === 'email' ? (
              <AppTextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="you@gmail.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                error={errors.email}
                editable={!busy}
              />
            ) : (
              <>
                <AppTextInput
                  label="Verification code"
                  value={otp}
                  onChangeText={(t) => setOtp(t.replace(/\D/g, '').slice(0, 6))}
                  placeholder="123456"
                  keyboardType="number-pad"
                  autoComplete="one-time-code"
                  maxLength={6}
                  error={errors.otp}
                  editable={!busy}
                />
                <AppTextInput
                  label="New password"
                  value={password}
                  onChangeText={setPassword}
                  placeholder="At least 8 characters"
                  secureTextEntry
                  autoComplete="new-password"
                  error={errors.password}
                  supporting="8+ characters, one uppercase letter and one number"
                  editable={!busy}
                />
              </>
            )}

            {errors.form && (
              <View style={styles.banner}>
                <Text style={[TypeScale.bodyMedium, { color: M3.onErrorContainer }]}>
                  {errors.form}
                </Text>
              </View>
            )}

            <PrimaryButton
              label={step === 'email' ? 'Send code' : 'Change password'}
              onPress={step === 'email' ? sendCode : submitReset}
              loading={busy}
            />
          </View>

          <Pressable onPress={() => router.back()} disabled={busy} style={styles.back}>
            <Text style={[TypeScale.labelLarge, { color: M3.primary }]}>Back to sign in</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeScreenWrapper>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: 24, paddingBottom: 48, gap: 28 },
  header: { gap: 8, marginTop: 8 },
  title: { ...TypeScale.headlineLarge, color: M3.onSurface },
  subtitle: { ...TypeScale.bodyLarge, color: M3.onSurfaceVariant },
  form: { gap: 20 },
  banner: { backgroundColor: M3.errorContainer, borderRadius: 12, padding: 14 },
  back: { alignSelf: 'center' },
});
