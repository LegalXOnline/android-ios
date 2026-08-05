import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import {
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { Colors, FontSize, FontWeight, Spacing, Typography } from '@theme';

import { SecondaryButton } from '../primitives/SecondaryButton';

interface EmptyStateProps {
  title: string;
  description?: string;
  symbol?: SymbolViewProps['name'];
  actionLabel?: string;
  onActionPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function EmptyState({
  title,
  description,
  symbol,
  actionLabel,
  onActionPress,
  style,
}: EmptyStateProps) {
  const hasAction = Boolean(actionLabel && onActionPress);

  return (
    <View style={[styles.container, style]}>
      {symbol ? (
        <View style={styles.iconCircle}>
          <SymbolView name={symbol} size={32} tintColor={Colors.primary} />
        </View>
      ) : null}

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
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FEFCF5',
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...Typography.display,
    fontSize: 22,
    fontWeight: FontWeight.semibold,
    color: Colors.ink,
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
