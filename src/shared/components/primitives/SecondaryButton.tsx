/**
 * SecondaryButton — Ink border outline, ink text.
 *
 * Rules (04_Design_System.md §5.7):
 * - Outline style, Slate Navy border and text.
 * - Used for secondary/cancel actions that sit beside a primary action.
 * - Ghost variant (transparent) is a separate pattern — see 04_Design_System §5.7.
 * - Disabled: border + textSecondary.
 * - Min tap target 44×44px.
 */
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { Colors, Radii, Spacing, Typography } from '@theme';

interface SecondaryButtonProps extends Pick<PressableProps, 'onPress' | 'testID'> {
  label: string;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function SecondaryButton({
  label,
  onPress,
  disabled = false,
  loading = false,
  style,
  testID,
}: SecondaryButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      style={({ pressed }) => [
        styles.base,
        isDisabled ? styles.disabledBorder : styles.activeBorder,
        pressed && !isDisabled && styles.pressed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={Colors.ink}
          accessibilityLabel="Loading"
        />
      ) : (
        <Text style={[styles.label, isDisabled && styles.labelDisabled]}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 44,
    borderRadius: Radii.button,
    borderWidth: 1.5,
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  activeBorder: {
    borderColor: Colors.ink,
  },
  disabledBorder: {
    borderColor: Colors.border,
  },
  pressed: {
    opacity: 0.7,
  },
  label: {
    ...Typography.body,
    color: Colors.ink,
    fontWeight: '600',
  },
  labelDisabled: {
    color: Colors.textSecondary,
  },
});
