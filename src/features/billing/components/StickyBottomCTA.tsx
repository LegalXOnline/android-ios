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

export function StickyBottomCTA({
  label,
  onPress,
  disabled = false,
  testID,
}: StickyBottomCTAProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.stickyBar,
        // The inset is what the system reserves for its own bar, not a gap the
        // button may sit in. Taking the larger of the two put the button inside
        // that band and under the navigation bar; the padding is added to it.
        { paddingBottom: insets.bottom + Spacing.md },
      ]}
    >
      <PrimaryButton
        label={label}
        onPress={onPress}
        disabled={disabled}
        testID={testID}
      />
    </View>
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
    zIndex: 10,
    ...Shadows.card,
  },
});
