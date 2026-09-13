import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { Elevation, M3, Shape, StateLayer, TypeScale } from '@theme';

/**
 * M3 filled button.
 *
 * The pressed state is a state layer — onPrimary at 10% over the container —
 * rather than a different fill, which is what keeps it consistent across every
 * variant in the spec.
 */

type Variant = 'filled' | 'tonal' | 'text';

interface PrimaryButtonProps extends Pick<PressableProps, 'onPress' | 'testID'> {
  label: string;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
}

const FILL: Record<Variant, { bg: string; fg: string }> = {
  filled: { bg: M3.primary, fg: M3.onPrimary },
  tonal: { bg: M3.secondaryContainer, fg: M3.onSecondaryContainer },
  text: { bg: 'transparent', fg: M3.primary },
};

export function PrimaryButton({
  label,
  onPress,
  variant = 'filled',
  disabled = false,
  loading = false,
  style,
  testID,
}: PrimaryButtonProps) {
  const isDisabled = disabled || loading;
  const { bg, fg } = FILL[variant];

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: isDisabled ? withAlpha(M3.onSurface, StateLayer.disabledContainer) : bg },
        variant === 'filled' && !isDisabled && Elevation.level0,
        pressed && !isDisabled && styles.pressed,
        style,
      ]}
    >
      {({ pressed }) => (
        <>
          {pressed && !isDisabled && (
            <View style={[styles.layer, { backgroundColor: withAlpha(fg, StateLayer.pressed) }]} />
          )}
          {loading ? (
            <ActivityIndicator size="small" color={fg} accessibilityLabel="Loading" />
          ) : (
            <Text
              numberOfLines={1}
              style={[
                TypeScale.labelLarge,
                { color: isDisabled ? withAlpha(M3.onSurface, StateLayer.disabledContent) : fg },
              ]}
            >
              {label}
            </Text>
          )}
        </>
      )}
    </Pressable>
  );
}

/** Hex plus an alpha channel — RN accepts #RRGGBBAA. */
export function withAlpha(hex: string, alpha: number): string {
  const a = Math.round(Math.max(0, Math.min(1, alpha)) * 255)
    .toString(16)
    .padStart(2, '0');
  return `${hex}${a}`;
}

const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    paddingHorizontal: 24,
    borderRadius: Shape.full,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  pressed: { opacity: 0.999 },
  layer: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 },
});
