import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Auth, AuthFont } from './tokens';

export function ErrorBanner({ message }: { message: string }) {
  return (
    <View style={styles.banner} accessibilityRole="alert">
      <SymbolView
        name={{ ios: 'exclamationmark.circle', android: 'error', web: 'error' }}
        size={17}
        tintColor={Auth.danger}
      />
      <Text style={styles.bannerText}>{message}</Text>
    </View>
  );
}

export function Checkbox({
  checked,
  onToggle,
  label,
}: {
  checked: boolean;
  onToggle: () => void;
  label: string;
}) {
  return (
    <Pressable
      onPress={onToggle}
      hitSlop={8}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel={label}
      style={styles.checkRow}
    >
      <View style={[styles.box, checked && { backgroundColor: Auth.gold, borderColor: Auth.gold }]}>
        {checked && (
          <SymbolView
            name={{ ios: 'checkmark', android: 'check', web: 'check' }}
            size={13}
            tintColor={Auth.onGold}
          />
        )}
      </View>
      <Text style={styles.checkLabel}>{label}</Text>
    </Pressable>
  );
}

export function TextLink({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} hitSlop={8} accessibilityRole="link">
      <Text style={styles.link}>{label}</Text>
    </Pressable>
  );
}

export function AuthFooter({
  question,
  action,
  onPress,
}: {
  question: string;
  action: string;
  onPress: () => void;
}) {
  return (
    <View style={styles.footer}>
      <View style={styles.footerRow}>
        <Text style={styles.footerText}>{question}</Text>
        <TextLink label={action} onPress={onPress} />
      </View>
      <Text style={styles.legal}>
        By continuing you agree to the LegalX Terms of Service and Privacy Policy.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: Auth.dangerSurface,
    borderRadius: 12,
    padding: 13,
  },
  bannerText: { flex: 1, fontSize: 14, lineHeight: 20, color: Auth.danger },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  box: {
    width: 21,
    height: 21,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: Auth.fieldBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkLabel: { fontSize: 14, color: Auth.muted },
  link: { fontSize: 15, fontWeight: '700', color: Auth.goldText },
  footer: { marginTop: 32, gap: 14, alignItems: 'center' },
  footerRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  footerText: { fontSize: 15, color: Auth.muted },
  legal: {
    fontFamily: AuthFont.mono,
    fontSize: 11,
    lineHeight: 17,
    color: Auth.hint,
    textAlign: 'center',
    maxWidth: 320,
  },
});
