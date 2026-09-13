import { useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { emailError, nameError, passwordError, requestSignupOtp, type Role } from '@services/auth.service';
import { AppTextInput, PrimaryButton, SafeScreenWrapper } from '@shared/components';
import { M3, Shape, TypeScale } from '@theme';

const ROLES: { value: Role; label: string; hint: string }[] = [
  { value: 'client', label: 'I need legal help', hint: 'Consult verified advocates' },
  { value: 'lawyer', label: 'I am an advocate', hint: 'Take consultations on LegalX' },
];

export function SignupScreen() {
  const router = useRouter();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('client');
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    const next = {
      firstName: nameError(firstName, 'first name') ?? undefined,
      lastName: nameError(lastName, 'last name') ?? undefined,
      email: emailError(email) ?? undefined,
      password: passwordError(password) ?? undefined,
    };
    if (Object.values(next).some(Boolean)) {
      setErrors(next);
      return;
    }

    const draft = {
      email: email.trim().toLowerCase(),
      password,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      role,
    };

    setErrors({});
    setBusy(true);
    try {
      await requestSignupOtp(draft);
      // The password travels in params because verification needs it to sign in
      // immediately afterwards; it never leaves the device.
      router.push({ pathname: '/(auth)/otp', params: { ...draft, intent: 'signup' } });
    } catch (err) {
      setErrors({ form: (err as Error).message });
    } finally {
      setBusy(false);
    }
  };

  return (
    <SafeScreenWrapper edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Create your account</Text>
            <Text style={styles.subtitle}>We will email you a 6-digit code to confirm it.</Text>
          </View>

          <View style={styles.roles}>
            {ROLES.map((r) => {
              const selected = role === r.value;
              return (
                <Pressable
                  key={r.value}
                  onPress={() => setRole(r.value)}
                  disabled={busy}
                  accessibilityRole="radio"
                  accessibilityState={{ selected }}
                  style={[
                    styles.role,
                    {
                      backgroundColor: selected ? M3.secondaryContainer : M3.surface,
                      borderColor: selected ? M3.primary : M3.outlineVariant,
                      borderWidth: selected ? 2 : 1,
                    },
                  ]}
                >
                  <Text style={[TypeScale.titleSmall, { color: selected ? M3.onSecondaryContainer : M3.onSurface }]}>
                    {r.label}
                  </Text>
                  <Text style={[TypeScale.bodySmall, { color: M3.onSurfaceVariant }]}>{r.hint}</Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.form}>
            <View style={styles.row}>
              <AppTextInput
                label="First name"
                value={firstName}
                onChangeText={setFirstName}
                autoCapitalize="words"
                error={errors.firstName}
                editable={!busy}
                containerStyle={styles.flex}
              />
              <AppTextInput
                label="Last name"
                value={lastName}
                onChangeText={setLastName}
                autoCapitalize="words"
                error={errors.lastName}
                editable={!busy}
                containerStyle={styles.flex}
              />
            </View>

            <AppTextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              error={errors.email}
              editable={!busy}
            />

            <AppTextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="new-password"
              error={errors.password}
              supporting="8+ characters, one uppercase letter and one number"
              editable={!busy}
            />

            {errors.form && (
              <View style={[styles.banner, { backgroundColor: M3.errorContainer }]}>
                <Text style={[TypeScale.bodyMedium, { color: M3.onErrorContainer }]}>{errors.form}</Text>
              </View>
            )}

            <PrimaryButton label="Send verification code" onPress={submit} loading={busy} />
          </View>

          <View style={styles.footer}>
            <Text style={[TypeScale.bodyMedium, { color: M3.onSurfaceVariant }]}>Already registered?</Text>
            <Pressable onPress={() => router.replace('/(auth)/login')} disabled={busy}>
              <Text style={[TypeScale.labelLarge, { color: M3.primary }]}>Sign in</Text>
            </Pressable>
          </View>
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
  roles: { gap: 10 },
  role: { borderRadius: Shape.large, padding: 16, gap: 2 },
  form: { gap: 20 },
  row: { flexDirection: 'row', gap: 12 },
  banner: { borderRadius: 12, padding: 14 },
  footer: { flexDirection: 'row', gap: 6, justifyContent: 'center', alignItems: 'center' },
});
