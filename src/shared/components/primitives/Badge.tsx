/**
 * Badge — Small semantic status pill.
 *
 * Used for: "Verified" badge on lawyer cards, payment status,
 * pending/success/error states on Transactions (04_Design_System §2).
 *
 * Variants map to the semantic color tokens from the design system:
 * - success → #1D9E75
 * - warning → #F2A623
 * - danger  → #D85A30
 * - default → ink / surface
 */
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { Colors, FontSize, FontWeight, Radii, Spacing } from '@theme';

export type BadgeVariant = 'success' | 'warning' | 'danger' | 'default';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  style?: StyleProp<ViewStyle>;
}

const BG_COLOR: Record<BadgeVariant, string> = {
  success: '#E8F8F3', // light tint of success
  warning: '#FEF5E7', // light tint of warning
  danger: '#FAEAE4',  // light tint of danger
  default: Colors.border,
};

const TEXT_COLOR: Record<BadgeVariant, string> = {
  success: Colors.success,
  warning: Colors.warning,
  danger: Colors.danger,
  default: Colors.ink,
};

export function Badge({ label, variant = 'default', style }: BadgeProps) {
  return (
    <View
      style={[styles.base, { backgroundColor: BG_COLOR[variant] }, style]}
      accessibilityLabel={label}
      accessible
    >
      <Text style={[styles.label, { color: TEXT_COLOR[variant] }]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Radii.pill,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs / 2, // 2px vertical
    alignSelf: 'flex-start',
  },
  label: {
    fontSize: FontSize.bodySmall,
    fontWeight: FontWeight.medium,
    lineHeight: 16,
  },
});
