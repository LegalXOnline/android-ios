/**
 * IconButton — 44×44 minimum tap target, icon only (no text label).
 *
 * Used for: favourite heart (LawyerCard), close (search bar), back arrow (AppHeader).
 * accessibilityLabel is REQUIRED — no icon-only button without a screen-reader label.
 *
 * Icons via expo-symbols SymbolView — uses cross-platform name objects.
 */
import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import {
  Pressable,
  StyleSheet,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { Colors, Layout } from '@theme';

interface IconButtonProps extends Pick<PressableProps, 'onPress' | 'testID'> {
  /** expo-symbols symbol name — use cross-platform object { ios, android } */
  symbol: SymbolViewProps['name'];
  /** Required — screen readers must know what this button does. */
  accessibilityLabel: string;
  /** Icon size. Default 22 */
  size?: number;
  /** Icon tint color. Default Colors.ink */
  color?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function IconButton({
  symbol,
  accessibilityLabel,
  onPress,
  size = 22,
  color = Colors.ink,
  disabled = false,
  style,
  testID,
}: IconButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      style={({ pressed }) => [
        styles.base,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      <SymbolView
        name={symbol}
        size={size}
        tintColor={disabled ? Colors.textSecondary : color}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    // Minimum tap target 44×44px (04_Design_System §4, WCAG)
    minWidth: Layout.minTapTarget,
    minHeight: Layout.minTapTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.6,
  },
  disabled: {
    opacity: 0.4,
  },
});
