/**
 * Chip — Pill-shaped tag.
 *
 * Used for: practice-area tags, language tags on LawyerCard (04_Design_System §5.2).
 * - Full pill border-radius (999px) per 04_Design_System §4.
 * - Label style (13px medium) per 04_Design_System §3.
 * - Optional selected state (filled ink background, white text).
 * - Optional onPress for filter chips (mode/practice filter on Lawyer Listing).
 * - Min 44px height when interactive (WCAG tap target).
 */
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { Colors, FontSize, FontWeight, Radii, Spacing } from '@theme';

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function Chip({ label, selected = false, onPress, style, testID }: ChipProps) {
  const content = (
    <View
      style={[
        styles.base,
        selected ? styles.selectedBg : styles.defaultBg,
        style,
      ]}
    >
      <Text style={[styles.label, selected ? styles.selectedLabel : styles.defaultLabel]}>
        {label}
      </Text>
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        testID={testID}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ selected }}
        style={({ pressed }) => pressed && styles.pressed}
      >
        {content}
      </Pressable>
    );
  }

  // Display-only chip (no tap target needed for non-interactive tags)
  return content;
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Radii.pill,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  defaultBg: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
  },
  selectedBg: {
    // Mode selector selected state: filled navy (04_Design_System §5.8)
    backgroundColor: Colors.ink,
    borderColor: Colors.ink,
  },
  label: {
    fontSize: FontSize.label,
    fontWeight: FontWeight.medium,
  },
  defaultLabel: {
    color: Colors.ink,
  },
  selectedLabel: {
    color: Colors.surfaceAlt, // white on navy — WCAG AA
  },
  pressed: {
    opacity: 0.7,
  },
});
