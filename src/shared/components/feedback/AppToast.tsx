import { SymbolView } from 'expo-symbols';
import { useEffect, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

import { Colors, FontSize, FontWeight, Radii, Shadows, Spacing } from '@theme';

export type ToastVariant = 'success' | 'info' | 'error';

interface AppToastProps {
  visible: boolean;
  message: string;
  variant?: ToastVariant;
  onDismiss?: () => void;
  durationMs?: number;
}

export function AppToast({
  visible,
  message,
  variant = 'success',
  onDismiss,
  durationMs = 3000,
}: AppToastProps) {
  const [fadeAnim] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }).start(() => {
          if (onDismiss) onDismiss();
        });
      }, durationMs);

      return () => clearTimeout(timer);
    } else {
      fadeAnim.setValue(0);
    }
  }, [durationMs, fadeAnim, onDismiss, visible]);

  if (!visible) return null;

  const getVariantStyles = () => {
    switch (variant) {
      case 'error':
        return {
          bg: '#FDF2F2',
          border: Colors.danger,
          iconColor: Colors.danger,
          icon: { ios: 'xmark.circle.fill', android: 'cancel', web: 'cancel' } as const,
        };
      case 'info':
        return {
          bg: Colors.surfaceAlt,
          border: Colors.border,
          iconColor: Colors.ink,
          icon: { ios: 'info.circle.fill', android: 'info', web: 'info' } as const,
        };
      case 'success':
      default:
        return {
          bg: '#FEFCF5',
          border: Colors.primary,
          iconColor: Colors.primary,
          icon: { ios: 'checkmark.circle.fill', android: 'check_circle', web: 'check_circle' } as const,
        };
    }
  };

  const vConfig = getVariantStyles();

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          backgroundColor: vConfig.bg,
          borderColor: vConfig.border,
        },
      ]}
    >
      <View style={styles.content}>
        <SymbolView name={vConfig.icon} size={20} tintColor={vConfig.iconColor} />
        <Text style={styles.messageText}>{message}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: Spacing.xl,
    left: Spacing.lg,
    right: Spacing.lg,
    zIndex: 9999,
    borderWidth: 1.5,
    borderRadius: Radii.card,
    padding: Spacing.md,
    ...Shadows.card,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  messageText: {
    flex: 1,
    fontSize: FontSize.bodySmall,
    fontWeight: FontWeight.semibold,
    color: Colors.ink,
  },
});
