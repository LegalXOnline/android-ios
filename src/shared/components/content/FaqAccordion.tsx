/**
 * FaqAccordion — Single-open expand/collapse FAQ list.
 *
 * Rules (04_Design_System.md §5.5):
 * - Collapsed by default.
 * - Single-open: opening one item closes any currently open item.
 * - Chevron rotates on expand (managed via inline transform, no animation per Phase 2 scope).
 * - No animations in Phase 2 (per user approval — animations added later).
 */
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { Colors, Radii, Spacing, Typography } from '@theme';
import { Divider } from '../primitives/Divider';

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  items: FaqItem[];
  style?: StyleProp<ViewStyle>;
}

export function FaqAccordion({ items, style }: FaqAccordionProps) {
  // Single-open: store the id of the currently open item (null = all closed)
  const [openId, setOpenId] = useState<string | null>(null);

  const handlePress = (id: string) => {
    // Toggle: if already open, close it; otherwise open the new one
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <View style={[styles.container, style]}>
      {items.map((item, index) => {
        const isOpen = openId === item.id;
        return (
          <View key={item.id}>
            {index > 0 && <Divider />}

            {/* Row trigger */}
            <Pressable
              onPress={() => handlePress(item.id)}
              accessibilityRole="button"
              accessibilityLabel={item.question}
              accessibilityState={{ expanded: isOpen }}
              style={({ pressed }) => [
                styles.row,
                pressed && styles.rowPressed,
              ]}
            >
              <Text style={styles.question} numberOfLines={isOpen ? undefined : 2}>
                {item.question}
              </Text>

              {/* Chevron — rotated when open */}
              <View style={[styles.chevron, isOpen && styles.chevronOpen]}>
                <SymbolView
                  name={{ ios: 'chevron.down', android: 'expand_more', web: 'expand_more' }}
                  size={16}
                  tintColor={Colors.textSecondary}
                />
              </View>
            </Pressable>

            {/* Answer — conditionally rendered, no animation in Phase 2 */}
            {isOpen && (
              <View style={styles.answerContainer}>
                <Text style={styles.answer}>{item.answer}</Text>
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radii.card,
    overflow: 'hidden',
    backgroundColor: Colors.surfaceAlt,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
    minHeight: 44, // WCAG tap target
  },
  rowPressed: {
    backgroundColor: Colors.surface,
  },
  question: {
    ...Typography.body,
    color: Colors.ink,
    flex: 1,
    fontWeight: '500',
  },
  chevron: {
    flexShrink: 0,
    // No rotation animation in Phase 2 — static transform only
    transform: [{ rotate: '0deg' }],
  },
  chevronOpen: {
    transform: [{ rotate: '180deg' }],
  },
  answerContainer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  answer: {
    ...Typography.body,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
});
