import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SymbolView } from 'expo-symbols';

import { emailError, nameError, passwordError, requestSignupOtp, type Role } from '@services/auth.service';

import {
  Auth,
  AuthButton,
  AuthField,
  AuthFont,
  AuthFooter,
  AuthShell,
  ErrorBanner,
} from './components';

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

  const clear = (field: string) =>
    setErrors((e) => (e[field] || e.form ? { ...e, [field]: undefined, form: undefined } : e));

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
      // The password rides along because verification signs in straight after;
      // it never leaves the device.
      router.push({ pathname: '/(auth)/otp', params: draft });
    } catch (err) {
      setErrors({ form: (err as Error).message });
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell
      title="Create account"
      subtitle="One account for consultations, documents and case history."
      footer={
        <AuthFooter
          question="Already registered?"
          action="Sign in"
          onPress={() => router.replace('/(auth)/login')}
        />
      }
    >
      <View style={styles.roles}>
        <Text style={styles.label}>I am</Text>
        {ROLES.map((r) => {
          const on = role === r.value;
          return (
            <Pressable
              key={r.value}
              onPress={() => setRole(r.value)}
              disabled={busy}
              accessibilityRole="radio"
              accessibilityState={{ selected: on }}
              style={[
                styles.role,
                {
                  borderColor: on ? Auth.gold : Auth.fieldBorder,
                  backgroundColor: on ? '#FDF6E0' : Auth.field,
                },
              ]}
            >
              <View style={styles.roleText}>
                <Text style={styles.roleLabel}>{r.label}</Text>
                <Text style={styles.roleHint}>{r.hint}</Text>
              </View>
              <View style={[styles.radio, on && { borderColor: Auth.gold }]}>
                {on && <View style={styles.radioDot} />}
              </View>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.names}>
        <View style={styles.half}>
          <AuthField
            label="First name"
            icon={{ ios: 'person', android: 'person', web: 'person' }}
            value={firstName}
            onChangeText={(t) => {
              setFirstName(t);
              clear('firstName');
            }}
            autoCapitalize="words"
            autoComplete="given-name"
            error={errors.firstName}
            editable={!busy}
          />
        </View>
        <View style={styles.half}>
          <AuthField
            label="Last name"
            icon={{ ios: 'person', android: 'person', web: 'person' }}
            value={lastName}
            onChangeText={(t) => {
              setLastName(t);
              clear('lastName');
            }}
            autoCapitalize="words"
            autoComplete="family-name"
            error={errors.lastName}
            editable={!busy}
          />
        </View>
      </View>

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

      <AuthField
        label="Password"
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

      {errors.form && <ErrorBanner message={errors.form} />}

      <AuthButton label="Send code" onPress={submit} loading={busy} />

      <View style={styles.note}>
        <SymbolView
          name={{ ios: 'envelope.badge', android: 'mark_email_unread', web: 'mark_email_unread' }}
          size={15}
          tintColor={Auth.hint}
        />
        <Text style={styles.noteText}>We email a 6-digit code to confirm the address.</Text>
      </View>
    </AuthShell>
  );
}

const styles = StyleSheet.create({
  roles: { gap: 9 },
  label: {
    fontFamily: AuthFont.mono,
    fontSize: 13,
    fontWeight: '700',
    color: Auth.ink,
    letterSpacing: 0.2,
    marginBottom: 1,
  },
  role: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 13,
    gap: 12,
  },
  roleText: { flex: 1, gap: 2 },
  roleLabel: { fontSize: 15, fontWeight: '600', color: Auth.ink },
  roleHint: { fontSize: 13, color: Auth.muted },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Auth.fieldBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Auth.gold },
  names: { flexDirection: 'row', gap: 12 },
  half: { flex: 1 },
  note: { flexDirection: 'row', alignItems: 'center', gap: 8, justifyContent: 'center' },
  noteText: { fontSize: 13, color: Auth.hint },
});
