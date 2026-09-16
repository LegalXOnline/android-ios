import { SymbolView } from 'expo-symbols';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '@providers/AuthProvider';
import { LX, LXShape, LXType } from '@theme';

const WEB_PORTAL = 'https://legalxonline.com';

/**
 * Shown when a lawyer or an admin signs in.
 *
 * The app only has client surfaces. Dropping either role into the client tabs
 * is what made an admin account look like a customer — it showed My Orders and
 * an LX balance for someone who has neither.
 */
export function PortalNoticeScreen({ role }: { role: 'lawyer' | 'admin' }) {
  const insets = useSafeAreaInsets();
  const { signOut } = useAuth();

  const copy =
    role === 'admin'
      ? {
          title: 'Admin accounts use the web portal',
          body: 'Verification, payouts, disputes and content moderation all live in the admin console. The app is built for clients, so there is nothing here for an admin account to do.',
        }
      : {
          title: 'Advocate accounts use the web portal',
          body: 'Consultations, availability and payouts are handled in the lawyer dashboard on the web. The app is built for clients for now.',
        };

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 60, paddingBottom: insets.bottom + 32 }]}>
      <View style={styles.body}>
        <View style={styles.icon}>
          <SymbolView
            name={{ ios: 'lock.laptopcomputer', android: 'computer', web: 'computer' }}
            size={28}
            tintColor={LX.goldText}
          />
        </View>

        <Text style={styles.title}>{copy.title}</Text>
        <Text style={styles.text}>{copy.body}</Text>

        <Pressable
          onPress={() => Linking.openURL(WEB_PORTAL)}
          accessibilityRole="button"
          style={({ pressed }) => [styles.primary, pressed && { backgroundColor: LX.goldPressed }]}
        >
          <Text style={styles.primaryLabel}>Open the web portal</Text>
          <SymbolView
            name={{ ios: 'arrow.up.right', android: 'open_in_new', web: 'open_in_new' }}
            size={16}
            tintColor={LX.onGold}
          />
        </Pressable>
      </View>

      <Pressable onPress={signOut} accessibilityRole="button" style={styles.secondary}>
        <Text style={styles.secondaryLabel}>Sign in with a different account</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: LX.bg,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  body: { gap: 14 },
  icon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: LX.goldSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  title: { ...LXType.headline, color: LX.ink },
  text: { ...LXType.body, lineHeight: 23, color: LX.inkMuted },
  primary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    height: 54,
    borderRadius: LXShape.full,
    backgroundColor: LX.gold,
    marginTop: 10,
  },
  primaryLabel: { ...LXType.titleSmall, color: LX.onGold },
  secondary: { alignSelf: 'center', paddingVertical: 12 },
  secondaryLabel: { ...LXType.label, fontSize: 14, color: LX.goldText },
});
