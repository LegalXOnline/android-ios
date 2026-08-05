/**
 * SectionHeader — H2 title with optional right-aligned action.
 *
 * Used for section dividers on Home, Documentation, Talk to Lawyer, Profile.
 * Pattern from 04_Design_System §3 (H2 = 18px medium, section headers).
 *
 * Optional actionLabel + onActionPress for "See all" / "View more" links.
 */
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { Colors, Spacing, Typography } from '@theme';

interface SectionHeaderProps {
  title: string;
  /** Text for the optional right-side action, e.g. "See all" */
  actionLabel?: string;
  onActionPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function SectionHeader({
  title,
  actionLabel,
  onActionPress,
  style,
}: SectionHeaderProps) {
  return (
    <View style={[styles.row, style]}>
      <Text style={styles.title}>{title}</Text>

      {actionLabel && onActionPress && (
        <Pressable
          onPress={onActionPress}
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
          style={({ pressed }) => pressed && styles.pressed}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.action}>{actionLabel}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
  },
  title: {
    ...Typography.h2,
    color: Colors.ink,
  },
  action: {
    ...Typography.label,
    color: Colors.ink,
    textDecorationLine: 'underline',
  },
  pressed: {
    opacity: 0.6,
  },
});
