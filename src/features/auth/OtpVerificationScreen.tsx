import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { useAuth } from '@providers/AuthProvider';
import { otpError, requestSignupOtp, type Role, type SignupDraft } from '@services/auth.service';

import {
  Auth,
  AuthButton,
  AuthFont,
  AuthShell,
  ErrorBanner,
  TextLink,
} from './components';

const LENGTH = 6;
const RESEND_SECONDS = 30;

export function OtpVerificationScreen() {
  const router = useRouter();
  const { completeSignup } = useAuth();
  const params = useLocalSearchParams<{
    email?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    role?: string;
  }>();

  const draft = useMemo<SignupDraft | null>(() => {
    if (!params.email || !params.password || !params.firstName || !params.lastName) return null;
    return {
      email: params.email,
      password: params.password,
      firstName: params.firstName,
      lastName: params.lastName,
      role: (params.role === 'lawyer' ? 'lawyer' : 'client') as Role,
    };
  }, [params.email, params.password, params.firstName, params.lastName, params.role]);

  const inputRef = useRef<TextInput>(null);
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [resendIn, setResendIn] = useState(RESEND_SECONDS);

  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  const verify = async (value: string) => {
    if (!draft) return;
    const invalid = otpError(value);
    if (invalid) {
      setError(invalid);
      return;
    }

    setError(null);
    setBusy(true);
    try {
      await completeSignup(draft, value);
      // AuthGate takes over once the user is set.
    } catch (err) {
      setCode('');
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const change = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, LENGTH);
    setCode(digits);
    if (error) setError(null);
    if (digits.length === LENGTH) verify(digits);
  };

  const resend = async () => {
    if (!draft || resendIn > 0) return;
    setResendIn(RESEND_SECONDS);
    setError(null);
    try {
      await requestSignupOtp(draft);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  if (!draft) {
    return (
      <AuthShell
        title="Start again"
        subtitle="We lost your details. Please enter them once more."
        onClose={() => router.replace('/(auth)/signup')}
      >
        <AuthButton label="Back to sign up" onPress={() => router.replace('/(auth)/signup')} />
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Check your email"
      subtitle={`We sent a ${LENGTH}-digit code to ${draft.email}. It expires in 10 minutes.`}
    >
      <Text style={styles.label}>Verification code</Text>

      <Pressable
        style={styles.cells}
        onPress={() => inputRef.current?.focus()}
        accessibilityRole="button"
        accessibilityLabel={`Enter the ${LENGTH} digit code`}
      >
        {Array.from({ length: LENGTH }).map((_, i) => {
          const active = i === code.length;
          return (
            <View
              key={i}
              style={[
                styles.cell,
                {
                  borderColor: error ? Auth.danger : active ? Auth.gold : Auth.fieldBorder,
                  backgroundColor: active ? Auth.fieldFocus : Auth.field,
                },
              ]}
            >
              <Text style={styles.digit}>{code[i] ?? ''}</Text>
            </View>
          );
        })}
      </Pressable>

      <TextInput
        ref={inputRef}
        value={code}
        onChangeText={change}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete="one-time-code"
        maxLength={LENGTH}
        autoFocus
        editable={!busy}
        style={styles.hidden}
      />

      {error && <ErrorBanner message={error} />}

      <AuthButton
        label="Verify"
        onPress={() => verify(code)}
        loading={busy}
        disabled={code.length < LENGTH}
      />

      <View style={styles.resend}>
        <Text style={styles.resendText}>Didn&apos;t get it?</Text>
        {resendIn > 0 ? (
          <Text style={styles.waiting}>Resend in {resendIn}s</Text>
        ) : (
          <TextLink label="Resend code" onPress={resend} />
        )}
      </View>
    </AuthShell>
  );
}

const styles = StyleSheet.create({
  label: {
    fontFamily: AuthFont.mono,
    fontSize: 13,
    fontWeight: '700',
    color: Auth.ink,
    letterSpacing: 0.2,
  },
  cells: { flexDirection: 'row', gap: 9, marginTop: -8 },
  cell: {
    flex: 1,
    height: 60,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  digit: { fontSize: 24, fontWeight: '700', color: Auth.ink },
  hidden: { position: 'absolute', opacity: 0, height: 1, width: 1 },
  resend: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7 },
  resendText: { fontSize: 14, color: Auth.muted },
  waiting: { fontSize: 14, fontWeight: '600', color: Auth.hint },
});
