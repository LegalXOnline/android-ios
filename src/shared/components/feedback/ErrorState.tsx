import { SymbolView } from 'expo-symbols';
import {
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { Colors, FontSize, FontWeight, Spacing, Typography } from '@theme';

import { PrimaryButton } from '../primitives/PrimaryButton';

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function ErrorState({
  title = 'Something Went Wrong',
  description = 'We encountered an error loading this information. Please check your connection and try again.',
  onRetry,
  style,
}: ErrorStateProps) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.iconCircle}>
        <SymbolView
          name={{ ios: 'exclamationmark.triangle.fill', android: 'warning', web: 'warning' }}
          size={32}
          tintColor={Colors.danger}
        />
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>

      {onRetry && (
        <PrimaryButton
          label="Try Again"
          onPress={onRetry}
          style={styles.button}
          testID="error-retry-button"
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
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FDF2F2',
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...Typography.h1,
    fontSize: 20,
    fontWeight: FontWeight.semibold,
    color: Colors.danger,
    textAlign: 'center',
  },
  description: {
    ...Typography.body,
    fontSize: FontSize.bodySmall,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  button: {
    marginTop: Spacing.sm,
    alignSelf: 'center',
    minWidth: 160,
  },
});
