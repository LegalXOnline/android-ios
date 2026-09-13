import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import {
  emailError,
  passwordError,
  requestPasswordReset,
  resetOtpError,
  resetPassword,
} from '@services/auth.service';

import {
  Auth,
  AuthButton,
  AuthField,
  AuthFooter,
  AuthShell,
  ErrorBanner,
  TextLink,
} from './components';

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

  const clear = (field: string) =>
    setErrors((e) => (e[field] || e.form ? { ...e, [field]: undefined, form: undefined } : e));

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
      otp: resetOtpError(otp) ?? undefined,
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
      <AuthShell
        title="Password changed"
        subtitle="Your old password no longer works. Sign in with the new one."
        onClose={() => router.replace('/(auth)/login')}
      >
        <AuthButton label="Back to sign in" onPress={() => router.replace('/(auth)/login')} />
      </AuthShell>
    );
  }

  const onEmailStep = step === 'email';

  return (
    <AuthShell
      title="Reset password"
      subtitle={
        onEmailStep
          ? 'Enter the email on your account and we will send a reset code.'
          : `Enter the code sent to ${email} and choose a new password.`
      }
      footer={
        <AuthFooter
          question="Remembered it?"
          action="Sign in"
          onPress={() => router.replace('/(auth)/login')}
        />
      }
    >
      {onEmailStep ? (
        <AuthField
          label="Email"
          icon={{ ios: 'envelope', android: 'mail', web: 'mail' }}
          value={email}
          onChangeText={(t) => {
            setEmail(t);
            clear('email');
          }}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          error={errors.email}
          editable={!busy}
        />
      ) : (
        <>
          <AuthField
            label="Reset code"
            icon={{ ios: 'number', android: 'pin', web: 'pin' }}
            value={otp}
            onChangeText={(t) => {
              setOtp(t.replace(/\D/g, '').slice(0, 10));
              clear('otp');
            }}
            keyboardType="number-pad"
            autoComplete="one-time-code"
            maxLength={10}
            error={errors.otp}
            editable={!busy}
          />

          <AuthField
            label="New password"
            icon={{ ios: 'lock', android: 'lock', web: 'lock' }}
            value={password}
            onChangeText={(t) => {
              setPassword(t);
              clear('password');
            }}
            secure
            autoComplete="new-password"
            error={errors.password}
            hint="8+ characters, one uppercase letter and one number"
            editable={!busy}
          />
        </>
      )}

      {errors.form && <ErrorBanner message={errors.form} />}

      <AuthButton
        label={onEmailStep ? 'Send code' : 'Change password'}
        onPress={onEmailStep ? sendCode : submitReset}
        loading={busy}
      />

      {!onEmailStep && (
        <View style={styles.resend}>
          <Text style={styles.resendText}>No code yet?</Text>
          <TextLink label="Send another" onPress={sendCode} />
        </View>
      )}
    </AuthShell>
  );
}

const styles = StyleSheet.create({
  resend: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7 },
  resendText: { fontSize: 14, color: Auth.muted },
});
