import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { useAuth } from '@providers/AuthProvider';
import { emailError } from '@services/auth.service';

import {
  AuthButton,
  AuthField,
  AuthFooter,
  AuthShell,
  Checkbox,
  ErrorBanner,
  TextLink,
} from './components';

export function LoginScreen() {
  const router = useRouter();
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({});
  const [busy, setBusy] = useState(false);

  const clear = (field: 'email' | 'password') =>
    setErrors((e) => (e[field] || e.form ? { ...e, [field]: undefined, form: undefined } : e));

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
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to reach a verified advocate and pick up your consultations where you left them."
      footer={
        <AuthFooter
          question="Don't have an account?"
          action="Create one"
          onPress={() => router.push('/(auth)/signup')}
        />
      }
    >
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
        autoComplete="current-password"
        error={errors.password}
        editable={!busy}
      />

      <View style={styles.row}>
        <Checkbox checked={remember} onToggle={() => setRemember((v) => !v)} label="Remember me" />
        <TextLink
          label="Forgot password?"
          onPress={() => router.push('/(auth)/forgot-password')}
        />
      </View>

      {errors.form && <ErrorBanner message={errors.form} />}

      <AuthButton label="Sign In" onPress={submit} loading={busy} />
    </AuthShell>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
});
