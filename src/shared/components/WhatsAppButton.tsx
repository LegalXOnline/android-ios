import * as Linking from 'expo-linking';
import { SymbolView } from 'expo-symbols';
import { usePathname } from 'expo-router';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TAB_BAR_HEIGHT } from './navigation/FloatingTabBar';

/**
 * Floating WhatsApp contact button, matching the website's.
 *
 * A direct line rather than a support form: people send a voice note or a
 * screenshot of what broke, which is more useful than a text field they have
 * to summarise into — and far more likely to actually get sent.
 */
const NUMBER = (process.env.EXPO_PUBLIC_WHATSAPP_NUMBER ?? '918252208569').replace(/\D/g, '');

/**
 * Where a floating button would be in the way rather than helpful. During a
 * live call it would sit on the mute and hang-up controls, and the billing
 * screens end in a decision that should not have a second button beside it.
 */
const HIDDEN_PREFIXES = ['/consultation', '/billing'];

/** Screens whose own action is pinned to the bottom edge, so this clears it. */
const RAISED_PREFIXES = ['/lawyer', '/documents'];

export function WhatsAppButton() {
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  if (!NUMBER) return null;
  if (HIDDEN_PREFIXES.some((p) => pathname?.startsWith(p))) return null;

  // Prefilled so the message arrives with context. WhatsApp presents it as an
  // editable draft, so nobody is forced to send it as written.
  const text = encodeURIComponent(`Hi LegalX — I need help.\n\n(Screen: ${pathname ?? '/'})`);

  const open = async () => {
    // The app scheme opens the conversation directly where WhatsApp is
    // installed; wa.me is the fallback that also works through a browser.
    const appUrl = `whatsapp://send?phone=${NUMBER}&text=${text}`;
    const webUrl = `https://wa.me/${NUMBER}?text=${text}`;
    try {
      if (await Linking.canOpenURL(appUrl)) await Linking.openURL(appUrl);
      else await Linking.openURL(webUrl);
    } catch {
      await Linking.openURL(webUrl).catch(() => {
        // Nothing on the device can open it; silence beats a crash.
      });
    }
  };

  const raised = RAISED_PREFIXES.some((p) => pathname?.startsWith(p));
  const bottom = insets.bottom + (raised ? TAB_BAR_HEIGHT + 34 : TAB_BAR_HEIGHT + 22);

  return (
    <View style={[styles.wrap, { bottom }]} pointerEvents="box-none">
      <Pressable
        onPress={open}
        accessibilityRole="button"
        accessibilityLabel="Contact LegalX on WhatsApp"
        style={({ pressed }) => [styles.fab, pressed && styles.pressed]}
      >
        <SymbolView
          name={{ ios: 'message.fill', android: 'chat', web: 'chat' }}
          size={24}
          tintColor="#04231A"
        />
        <Text style={styles.label}>Chat</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', right: 16, zIndex: 30 },
  fab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 52,
    paddingHorizontal: 16,
    borderRadius: 26,
    backgroundColor: '#25D366',
    ...Platform.select({
      android: { elevation: 6 },
      default: {
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
      },
    }),
  },
  pressed: { backgroundColor: '#20BD5A' },
  label: { fontSize: 15, fontWeight: '700', color: '#04231A' },
});
