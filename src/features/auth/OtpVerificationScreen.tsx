import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { useAuth } from '@providers/AuthProvider';
import { otpError, requestSignupOtp, type Role, type SignupDraft } from '@services/auth.service';
import { PrimaryButton, SafeScreenWrapper } from '@shared/components';
import { M3, Shape, TypeScale } from '@theme';

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
      <SafeScreenWrapper edges={['top', 'left', 'right']}>
        <View style={styles.content}>
          <Text style={styles.title}>Start again</Text>
          <Text style={styles.subtitle}>We lost your details. Please enter them once more.</Text>
          <PrimaryButton label="Back to sign up" onPress={() => router.replace('/(auth)/signup')} />
        </View>
      </SafeScreenWrapper>
    );
  }

  return (
    <SafeScreenWrapper edges={['top', 'left', 'right']}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Check your email</Text>
          <Text style={styles.subtitle}>
            We sent a {LENGTH}-digit code to <Text style={styles.email}>{draft.email}</Text>. It
            expires in 10 minutes.
          </Text>
        </View>

        <Pressable
          style={styles.cells}
          onPress={() => inputRef.current?.focus()}
          accessibilityRole="button"
          accessibilityLabel={`Enter the ${LENGTH} digit code`}
        >
          {Array.from({ length: LENGTH }).map((_, i) => {
            const filled = i < code.length;
            const active = i === code.length;
            return (
              <View
                key={i}
                style={[
                  styles.cell,
                  {
                    borderColor: error ? M3.error : active ? M3.primary : M3.outlineVariant,
                    borderWidth: active || error ? 2 : 1,
                  },
                ]}
              >
                <Text style={styles.digit}>{filled ? code[i] : ''}</Text>
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

        {error && (
          <View style={styles.banner}>
            <Text style={[TypeScale.bodyMedium, { color: M3.onErrorContainer }]}>{error}</Text>
          </View>
        )}

        <PrimaryButton
          label="Verify and continue"
          onPress={() => verify(code)}
          loading={busy}
          disabled={code.length < LENGTH}
        />

        <View style={styles.footer}>
          <Text style={[TypeScale.bodyMedium, { color: M3.onSurfaceVariant }]}>
            Did not get it?
          </Text>
          <Pressable onPress={resend} disabled={resendIn > 0 || busy}>
            <Text
              style={[
                TypeScale.labelLarge,
                { color: resendIn > 0 ? M3.onSurfaceVariant : M3.primary },
              ]}
            >
              {resendIn > 0 ? `Resend in ${resendIn}s` : 'Resend code'}
            </Text>
          </Pressable>
        </View>

        <Pressable onPress={() => router.back()} disabled={busy} style={styles.change}>
          <Text style={[TypeScale.labelLarge, { color: M3.primary }]}>Use a different email</Text>
        </Pressable>
      </View>
    </SafeScreenWrapper>
  );
}

const styles = StyleSheet.create({
  content: { padding: 24, gap: 28 },
  header: { gap: 8, marginTop: 8 },
  title: { ...TypeScale.headlineLarge, color: M3.onSurface },
  subtitle: { ...TypeScale.bodyLarge, color: M3.onSurfaceVariant },
  email: { color: M3.onSurface },
  cells: { flexDirection: 'row', gap: 10, justifyContent: 'space-between' },
  cell: {
    flex: 1,
    height: 60,
    borderRadius: Shape.small,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: M3.surfaceContainerLow,
  },
  digit: { ...TypeScale.headlineSmall, color: M3.onSurface },
  hidden: { position: 'absolute', opacity: 0, height: 1, width: 1 },
  banner: { backgroundColor: M3.errorContainer, borderRadius: 12, padding: 14 },
  footer: { flexDirection: 'row', gap: 6, justifyContent: 'center', alignItems: 'center' },
  change: { alignSelf: 'center' },
});
