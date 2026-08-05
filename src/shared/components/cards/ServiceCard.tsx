/**
 * ServiceCard — Documentation list / Home "Popular Documents" card.
 *
 * Rules (04_Design_System.md §5.1):
 * - Full-card tap target — NO CTA button on the list card itself.
 * - Tapping navigates to detail page (where Buy Now lives).
 * - Card radius 12px, card internal padding 16px (04_Design_System §4).
 * - Card-heavy screens use 20px horizontal padding — handled by parent screen.
 * - Memoized for FlatList performance (24_AI_BUILD_GUIDE §15).
 */
import { memo } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { Colors, Layout, Radii, Shadows, Spacing, Typography } from '@theme';

export interface ServiceCardProps {
  title: string;
  /** One-line description */
  description: string;
  /** e.g. "From ₹499" */
  priceLine: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export const ServiceCard = memo(function ServiceCard({
  title,
  description,
  priceLine,
  onPress,
  style,
  testID,
}: ServiceCardProps) {
  return (
    <Pressable
      onPress={onPress}
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${description}. ${priceLine}`}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.pressed,
        style,
      ]}
    >
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        <Text style={styles.description} numberOfLines={2}>
          {description}
        </Text>
        <Text style={styles.price}>
          {priceLine}
        </Text>
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surfaceAlt,
    borderRadius: Radii.card,
    padding: Layout.cardPadding,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.card,
  },
  pressed: {
    opacity: 0.85,
  },
  content: {
    gap: Spacing.xs,
  },
  title: {
    ...Typography.h2,
    color: Colors.ink,
  },
  description: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  price: {
    ...Typography.price,
    color: Colors.primary,
    marginTop: Spacing.xs,
  },
});
