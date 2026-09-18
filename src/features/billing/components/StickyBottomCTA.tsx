import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PrimaryButton } from '@shared/components';
import { Colors, Layout, Shadows, Spacing } from '@theme';

interface StickyBottomCTAProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  testID?: string;
}

/**
 * The action docked at the bottom of a screen.
 *
 * Laid out in flow as the last child of the screen's column, not positioned
 * absolutely over it. Absolute made it the one bottom-docked surface in the app
 * that landed under the system navigation bar, while the call screen's controls
 * — the same inset arithmetic, in flow — cleared it on the same handset. In
 * flow the button also cannot cover the end of the content behind it, so the
 * scrolling screens no longer need to reserve a gap they were guessing at.
 */
export function StickyBottomCTA({
  label,
  onPress,
  disabled = false,
  testID,
}: StickyBottomCTAProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bar, { paddingBottom: insets.bottom + Spacing.md }]}>
      <PrimaryButton label={label} onPress={onPress} disabled={disabled} testID={testID} />
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingHorizontal: Layout.screenPaddingHWide,
    paddingTop: Spacing.md,
    ...Shadows.card,
  },
});
