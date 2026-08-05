/**
 * PrimaryButton — Gold fill, ink text.
 *
 * Rules (04_Design_System.md §5.7):
 * - Gold (#D4A91F) fill only for high-intent CTAs: Buy Now, Confirm, Book Consultation.
 * - Text color is ink (#334155), NOT white — WCAG AA contrast on gold.
 * - Gold appears on at most ONE element per screen (04_Design_System §2 hard rule).
 * - Disabled state: border fill + textSecondary text.
 * - Min tap target 44×44px (04_Design_System §4, WCAG).
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

interface PrimaryButtonProps extends Pick<PressableProps, 'onPress' | 'testID'> {
  label: string;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function PrimaryButton({
  label,
  onPress,
  disabled = false,
  loading = false,
  style,
  testID,
}: PrimaryButtonProps) {
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
        isDisabled ? styles.disabled : styles.active,
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
    minHeight: 44, // WCAG minimum tap target
    borderRadius: Radii.button,
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  active: {
    backgroundColor: Colors.primary,
  },
  disabled: {
    // Disabled: border fill, not gold — prevents accidental gold-on-disabled confusion
    backgroundColor: Colors.border,
  },
  pressed: {
    opacity: 0.85,
  },
  label: {
    ...Typography.body,
    // Ink on gold for WCAG AA — do NOT use white (04_Design_System §7)
    color: Colors.ink,
    fontWeight: '600',
  },
  labelDisabled: {
    color: Colors.textSecondary,
  },
});
