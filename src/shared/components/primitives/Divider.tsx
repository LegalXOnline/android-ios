/**
 * Divider — Hairline horizontal separator.
 *
 * Uses Colors.border — warm-tinted (derived from Pearl White, not pure gray)
 * per 04_Design_System.md §2.
 *
 * Used between section header and content, between FAQ items,
 * within the Price Breakdown block.
 */
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { Colors } from '@theme';

interface DividerProps {
  style?: StyleProp<ViewStyle>;
}

export function Divider({ style }: DividerProps) {
  return <View style={[styles.divider, style]} accessibilityRole="none" />;
}

const styles = StyleSheet.create({
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.border,
    width: '100%',
  },
});
