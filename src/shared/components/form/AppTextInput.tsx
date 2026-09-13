import { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';

import { M3, Shape, TypeScale } from '@theme';

/**
 * M3 outlined text field.
 *
 * The outline thickens and takes the primary colour on focus, and the error
 * message replaces the supporting text rather than appearing beside it, so the
 * field never changes height as it validates.
 */

interface AppTextInputProps extends Omit<TextInputProps, 'style'> {
  label: string;
  error?: string;
  /** Shown under the field when there is no error. */
  supporting?: string;
  optional?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
}

export function AppTextInput({
  label,
  error,
  supporting,
  optional = false,
  containerStyle,
  onFocus,
  onBlur,
  ...textInputProps
}: AppTextInputProps) {
  const [focused, setFocused] = useState(false);
  const hasError = Boolean(error);
  const accent = hasError ? M3.error : focused ? M3.primary : M3.outline;

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[TypeScale.labelLarge, { color: accent }]}>
        {label}
        {optional && <Text style={{ color: M3.onSurfaceVariant }}> (optional)</Text>}
      </Text>

      <TextInput
        {...textInputProps}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        placeholderTextColor={M3.onSurfaceVariant}
        style={[
          styles.input,
          TypeScale.bodyLarge,
          { borderColor: accent, borderWidth: focused || hasError ? 2 : 1 },
        ]}
        accessibilityLabel={label}
        accessibilityHint={error ?? supporting}
        accessibilityState={{ disabled: textInputProps.editable === false }}
      />

      {(hasError || supporting) && (
        <Text
          style={[TypeScale.bodySmall, { color: hasError ? M3.error : M3.onSurfaceVariant }]}
          accessibilityRole={hasError ? 'alert' : undefined}
        >
          {error ?? supporting}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 6 },
  input: {
    minHeight: 56,
    paddingHorizontal: 16,
    borderRadius: Shape.extraSmall,
    color: M3.onSurface,
    backgroundColor: M3.surface,
  },
});
