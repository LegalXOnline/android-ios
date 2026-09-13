import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Auth, AuthButton, AuthFont } from './components';

const LOGO = require('../../../assets/images/legalx-logo.png');

const POINTS = [
  { icon: { ios: 'checkmark.seal', android: 'verified', web: 'verified' }, text: 'Advocates verified against Bar Council enrolment' },
  { icon: { ios: 'bubble.left.and.bubble.right', android: 'forum', web: 'forum' }, text: 'Chat, voice or video — whichever suits the matter' },
  { icon: { ios: 'clock', android: 'schedule', web: 'schedule' }, text: 'Charged by the minute, only for the time you use' },
] as const;

export function OnboardingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.page, { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 28 }]}>
      <View style={styles.top}>
        <Image source={LOGO} style={styles.logo} contentFit="contain" transition={0} />

        <Text style={styles.wordmark}>LegalX</Text>
        <Text style={styles.tagline}>Talk to a verified advocate in minutes.</Text>

        <View style={styles.points}>
          {POINTS.map((p) => (
            <View key={p.text} style={styles.point}>
              <SymbolView name={p.icon} size={18} tintColor={Auth.goldText} />
              <Text style={styles.pointText}>{p.text}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.actions}>
        <AuthButton label="Create account" onPress={() => router.push('/(auth)/signup')} />

        <Pressable
          onPress={() => router.push('/(auth)/login')}
          accessibilityRole="button"
          style={({ pressed }) => [styles.secondary, pressed && { backgroundColor: Auth.field }]}
        >
          <Text style={styles.secondaryLabel}>I already have an account</Text>
        </Pressable>

        <Text style={styles.legal}>
          By continuing you agree to the LegalX Terms of Service and Privacy Policy.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: Auth.page,
    paddingHorizontal: 22,
    justifyContent: 'space-between',
  },
  top: { gap: 14 },
  logo: { width: 66, height: 66, borderRadius: 16, marginBottom: 10 },
  wordmark: {
    fontFamily: AuthFont.serif,
    fontSize: 44,
    lineHeight: 50,
    fontWeight: '700',
    color: Auth.ink,
    letterSpacing: -1,
  },
  tagline: { fontSize: 17, lineHeight: 25, color: Auth.muted, maxWidth: 300 },
  points: { gap: 13, marginTop: 18 },
  point: { flexDirection: 'row', alignItems: 'flex-start', gap: 11 },
  pointText: { flex: 1, fontSize: 15, lineHeight: 22, color: Auth.ink },
  actions: { gap: 11 },
  secondary: {
    height: 58,
    borderRadius: 29,
    borderWidth: 1,
    borderColor: Auth.fieldBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryLabel: { fontSize: 16, fontWeight: '600', color: Auth.ink },
  legal: {
    fontFamily: AuthFont.mono,
    fontSize: 11,
    lineHeight: 17,
    color: Auth.hint,
    textAlign: 'center',
    marginTop: 6,
  },
});
