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
        { paddingBottom: Math.max(insets.bottom, Spacing.md) },
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
