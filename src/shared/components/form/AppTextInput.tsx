/**
 * AppTextInput — Labelled text input with inline error state.
 *
 * Rules:
 * - Label above, bordered input, error message below (04_Design_System §5, 24_AI_BUILD_GUIDE §24).
 * - Inline field-level validation — never a blocking modal.
 * - Required vs optional fields are visually communicated via label suffix.
 * - Never clears data on failed submit (24_AI_BUILD_GUIDE §24).
 * - Min tap target height 44px.
 */
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';

import { Colors, FontSize, FontWeight, Radii, Spacing, Typography } from '@theme';

interface AppTextInputProps extends Omit<TextInputProps, 'style'> {
  label: string;
  /** When present, shows a red error message below the input */
  error?: string;
  /** Appends " (optional)" to the label for non-required fields */
  optional?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
}

export function AppTextInput({
  label,
  error,
  optional = false,
  containerStyle,
  ...textInputProps
}: AppTextInputProps) {
  const hasError = Boolean(error);

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Label */}
      <Text style={styles.label}>
        {label}
        {optional && (
          <Text style={styles.optional}> (optional)</Text>
        )}
      </Text>

      {/* Input */}
      <TextInput
        {...textInputProps}
        placeholderTextColor={Colors.textSecondary}
        style={[
          styles.input,
          hasError && styles.inputError,
        ]}
        accessibilityLabel={label}
        accessibilityHint={error}
        accessibilityState={{ disabled: textInputProps.editable === false }}
      />

      {/* Inline error — never a modal */}
      {hasError && (
        <Text style={styles.errorText} accessibilityRole="alert">
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.xs,
  },
  label: {
    ...Typography.label,
    color: Colors.ink,
  },
  optional: {
    color: Colors.textSecondary,
    fontWeight: FontWeight.regular,
  },
  input: {
    minHeight: 44, // WCAG tap target
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radii.button,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    ...Typography.body,
    color: Colors.ink,
    backgroundColor: Colors.surfaceAlt,
  },
  inputError: {
    borderColor: Colors.danger,
  },
  errorText: {
    fontSize: FontSize.bodySmall,
    color: Colors.danger,
    fontWeight: FontWeight.regular,
  },
});
