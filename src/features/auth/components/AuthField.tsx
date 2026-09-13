import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import { Auth, AuthFont } from './tokens';

interface AuthFieldProps extends Omit<TextInputProps, 'style' | 'placeholder'> {
  label: string;
  icon: SymbolViewProps['name'];
  error?: string;
  /** Shown under the field when there is no error. */
  hint?: string;
  /** Adds the reveal toggle and starts masked. */
  secure?: boolean;
}

export function AuthField({ label, icon, error, hint, secure = false, ...input }: AuthFieldProps) {
  const [focused, setFocused] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const border = error ? Auth.danger : focused ? Auth.gold : Auth.fieldBorder;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <View
        style={[
          styles.field,
          { borderColor: border, backgroundColor: focused ? Auth.fieldFocus : Auth.field },
        ]}
      >
        <SymbolView name={icon} size={18} tintColor={error ? Auth.danger : Auth.hint} />

        <TextInput
          {...input}
          secureTextEntry={secure && !revealed}
          onFocus={(e) => {
            setFocused(true);
            input.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            input.onBlur?.(e);
          }}
          style={styles.input}
          accessibilityLabel={label}
          accessibilityHint={error ?? hint}
        />

        {secure && (
          <Pressable
            onPress={() => setRevealed((v) => !v)}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel={revealed ? 'Hide password' : 'Show password'}
          >
            <SymbolView
              name={
                revealed
                  ? { ios: 'eye.slash', android: 'visibility_off', web: 'visibility_off' }
                  : { ios: 'eye', android: 'visibility', web: 'visibility' }
              }
              size={18}
              tintColor={Auth.hint}
            />
          </Pressable>
        )}
      </View>

      {(error || hint) && (
        <Text
          style={[styles.support, error ? { color: Auth.danger } : null]}
          accessibilityRole={error ? 'alert' : undefined}
        >
          {error ?? hint}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 8 },
  label: {
    fontFamily: AuthFont.mono,
    fontSize: 13,
    fontWeight: '700',
    color: Auth.ink,
    letterSpacing: 0.2,
  },
  field: {
    minHeight: 56,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Auth.ink,
    paddingVertical: 16,
  },
  support: { fontSize: 13, lineHeight: 18, color: Auth.muted },
});
