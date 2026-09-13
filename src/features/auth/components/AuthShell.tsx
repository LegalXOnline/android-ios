import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import type { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Auth, AuthFont } from './tokens';

const LOGO = require('../../../../assets/images/legalx-mark.png');

interface AuthShellProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  /** Sits under the card, outside it. */
  footer?: ReactNode;
  onClose?: () => void;
}

export function AuthShell({ title, subtitle, children, footer, onClose }: AuthShellProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const close = onClose ?? (() => (router.canGoBack() ? router.back() : router.replace('/(auth)/onboarding')));

  return (
    <View style={[styles.page, { paddingTop: insets.top }]}>
      <View style={styles.bar}>
        <Pressable
          onPress={close}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Close"
          style={styles.barButton}
        >
          <SymbolView
            name={{ ios: 'xmark', android: 'close', web: 'close' }}
            size={20}
            tintColor={Auth.ink}
          />
        </Pressable>

        <View style={styles.brand}>
          <Image source={LOGO} style={styles.logo} contentFit="contain" transition={0} />
          <Text style={styles.wordmark}>LegalX</Text>
        </View>

        <View style={styles.barButton} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={insets.top + 8}
      >
        <ScrollView
          contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 28 }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>

          <View style={styles.card}>{children}</View>

          {footer}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  page: { flex: 1, backgroundColor: Auth.page },
  bar: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
  },
  barButton: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  logo: { width: 30, height: 30, borderRadius: 8 },
  wordmark: {
    fontFamily: AuthFont.serif,
    fontSize: 21,
    fontWeight: '700',
    color: Auth.ink,
    letterSpacing: -0.2,
  },
  scroll: { paddingHorizontal: 22, paddingTop: 18, gap: 0 },
  title: {
    fontFamily: AuthFont.serif,
    fontSize: 38,
    lineHeight: 44,
    fontWeight: '700',
    color: Auth.ink,
    letterSpacing: -0.8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: Auth.muted,
    marginTop: 10,
    maxWidth: 330,
  },
  card: {
    backgroundColor: Auth.card,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: Auth.cardBorder,
    padding: 20,
    marginTop: 26,
    gap: 18,
    shadowColor: '#101828',
    shadowOpacity: 0.05,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
});
