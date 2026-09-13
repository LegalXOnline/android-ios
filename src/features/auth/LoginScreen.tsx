import { useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useAuth } from '@providers/AuthProvider';
import { emailError } from '@services/auth.service';
import { AppTextInput, PrimaryButton, SafeScreenWrapper } from '@shared/components';
import { M3, TypeScale } from '@theme';

export function LoginScreen() {
  const router = useRouter();
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({});
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    const next = {
      email: emailError(email) ?? undefined,
      password: password ? undefined : 'Enter your password',
    };
    if (next.email || next.password) {
      setErrors(next);
      return;
    }

    setErrors({});
    setBusy(true);
    try {
      await signIn(email, password);
      // AuthGate moves to the app once the user is set.
    } catch (err) {
      setErrors({ form: (err as Error).message });
    } finally {
      setBusy(false);
    }
  };

  return (
    <SafeScreenWrapper edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.subtitle}>
              Sign in to reach a verified advocate and see your consultation history.
            </Text>
          </View>

          <View style={styles.form}>
            <AppTextInput
              label="Email"
              value={email}
              onChangeText={(t) => {
                setEmail(t);
                if (errors.email || errors.form) setErrors((e) => ({ ...e, email: undefined, form: undefined }));
              }}
              placeholder="you@gmail.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              error={errors.email}
              editable={!busy}
            />

            <AppTextInput
              label="Password"
              value={password}
              onChangeText={(t) => {
                setPassword(t);
                if (errors.password || errors.form) setErrors((e) => ({ ...e, password: undefined, form: undefined }));
              }}
              placeholder="Your password"
              secureTextEntry
              autoComplete="current-password"
              error={errors.password}
              editable={!busy}
            />

            <Pressable
              onPress={() => router.push('/(auth)/forgot-password')}
              disabled={busy}
              style={styles.forgot}
            >
              <Text style={[TypeScale.labelLarge, { color: M3.primary }]}>Forgot password?</Text>
            </Pressable>

            {errors.form && (
              <View style={styles.errorBanner}>
                <Text style={[TypeScale.bodyMedium, { color: M3.onErrorContainer }]}>
                  {errors.form}
                </Text>
              </View>
            )}

            <PrimaryButton label="Sign in" onPress={submit} loading={busy} />
          </View>

          <View style={styles.footer}>
            <Text style={[TypeScale.bodyMedium, { color: M3.onSurfaceVariant }]}>
              New to LegalX?
            </Text>
            <Pressable onPress={() => router.push('/(auth)/signup')} disabled={busy}>
              <Text style={[TypeScale.labelLarge, { color: M3.primary }]}>Create an account</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeScreenWrapper>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: 24, paddingBottom: 48, gap: 32 },
  header: { gap: 8, marginTop: 8 },
  title: { ...TypeScale.headlineLarge, color: M3.onSurface },
  subtitle: { ...TypeScale.bodyLarge, color: M3.onSurfaceVariant },
  form: { gap: 20 },
  forgot: { alignSelf: 'flex-start', paddingVertical: 4 },
  errorBanner: {
    backgroundColor: M3.errorContainer,
    borderRadius: 12,
    padding: 14,
  },
  footer: { flexDirection: 'row', gap: 6, justifyContent: 'center', alignItems: 'center' },
});
