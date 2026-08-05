/**
 * ErrorState — Centered error fallback with retry action.
 *
 * Rules (04_Design_System.md §6, 24_AI_BUILD_GUIDE §25):
 * - Every API-consuming screen implements its error state.
 * - Error messages are human-readable — never raw error codes.
 * - Uses danger accent (red) to signal the error state clearly.
 * - onRetry is optional — some error states don't have a retry (e.g. 404).
 */
import {
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { Colors, Spacing, Typography } from '@theme';
import { PrimaryButton } from '../primitives/PrimaryButton';

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function ErrorState({
  title = 'Something went wrong',
  description = 'Please try again.',
  onRetry,
  style,
}: ErrorStateProps) {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>{title}</Text>

      <Text style={styles.description}>{description}</Text>

      {onRetry && (
        <PrimaryButton
          label="Try Again"
          onPress={onRetry}
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
    ...Typography.h1,
    color: Colors.danger,
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
