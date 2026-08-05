/**
 * EmptyState — Centered empty content placeholder.
 *
 * Rules (04_Design_System.md §6, 24_AI_BUILD_GUIDE §27):
 * - Every list-type screen implements its documented empty state.
 * - Copy and CTA are passed as props — EmptyState only renders, never decides.
 * - Display typography (28px semibold) per 04_Design_System §3: "Onboarding / empty states only".
 * - Optional CTA action button (uses SecondaryButton to avoid misusing Gold on non-primary actions).
 */
import {
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { Colors, Spacing, Typography } from '@theme';
import { SecondaryButton } from '../primitives/SecondaryButton';

interface EmptyStateProps {
  title: string;
  description?: string;
  /** Label for the optional action button */
  actionLabel?: string;
  onActionPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onActionPress,
  style,
}: EmptyStateProps) {
  const hasAction = Boolean(actionLabel && onActionPress);

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>{title}</Text>

      {description ? (
        <Text style={styles.description}>{description}</Text>
      ) : null}

      {hasAction && (
        <SecondaryButton
          label={actionLabel!}
          onPress={onActionPress!}
          style={styles.button}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xxxl,
    gap: Spacing.md,
  },
  title: {
    // Display typography — empty states only (04_Design_System §3)
    ...Typography.display,
    color: Colors.ink,
    textAlign: 'center',
  },
  description: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  button: {
    marginTop: Spacing.sm,
    alignSelf: 'center',
    minWidth: 160,
  },
});
