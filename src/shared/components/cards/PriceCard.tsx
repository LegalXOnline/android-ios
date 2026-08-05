/**
 * PriceCard — Simplified price display card.
 *
 * Phase 2 scope (per approval): title, subtitle, price only.
 * Detailed billing line-item layout belongs to Phase 9 (Billing module).
 *
 * Used as a summary block in Service Detail and Confirmation screens.
 */
import {
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { Colors, Layout, Radii, Shadows, Spacing, Typography } from '@theme';

interface PriceCardProps {
  title: string;
  subtitle?: string;
  /** Formatted price string, e.g. "₹1,499" */
  price: string;
  style?: StyleProp<ViewStyle>;
}

export function PriceCard({ title, subtitle, price, style }: PriceCardProps) {
  return (
    <View style={[styles.card, style]}>
      <View style={styles.row}>
        <View style={styles.textBlock}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? (
            <Text style={styles.subtitle}>{subtitle}</Text>
          ) : null}
        </View>
        <Text style={styles.price}>{price}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surfaceAlt,
    borderRadius: Radii.card,
    padding: Layout.cardPadding,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.card,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  textBlock: {
    flex: 1,
    gap: Spacing.xs,
  },
  title: {
    ...Typography.body,
    color: Colors.ink,
    fontWeight: '600',
  },
  subtitle: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  price: {
    ...Typography.price,
    color: Colors.primary,
    flexShrink: 0,
  },
});
