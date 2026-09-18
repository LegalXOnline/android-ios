import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@shared/components';
import { Colors, Layout, Shadows, Spacing } from '@theme';

interface StickyBottomCTAProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  testID?: string;
}

/**
 * A button docked to the bottom of the screen, clear of the system bar.
 *
 * The inset is applied by SafeAreaView rather than added in JS. Both reach the
 * same number when the context is right, but the context is resolved once at
 * the provider and handed down, and on some handsets what arrives here does not
 * describe this screen — which is how the button ended up under the navigation
 * bar on exactly the devices it was supposed to clear. The native view reads
 * the insets dispatched to itself, so there is nothing in between to be stale.
 *
 * `additive` adds the system inset to the padding below, instead of replacing
 * it: the button keeps its breathing room and the bar's background still fills
 * the reserved strip.
 */
export function StickyBottomCTA({
  label,
  onPress,
  disabled = false,
  testID,
}: StickyBottomCTAProps) {
  return (
    <SafeAreaView edges={{ bottom: 'additive' }} style={styles.stickyBar}>
      <PrimaryButton label={label} onPress={onPress} disabled={disabled} testID={testID} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  stickyBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingHorizontal: Layout.screenPaddingHWide,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
    zIndex: 10,
    ...Shadows.card,
  },
});
