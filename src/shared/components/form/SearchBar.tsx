/**
 * SearchBar — Bordered search row with clear button.
 *
 * Presentation-only: does NOT submit queries itself.
 * The parent screen owns search state and logic (24_AI_BUILD_GUIDE §28).
 *
 * Used on: Home (SCR-01), Lawyer Search/Filters (SCR-08).
 */
import { SymbolView } from 'expo-symbols';
import {
  Pressable,
  StyleSheet,
  TextInput,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { Colors, Layout, Radii, Spacing, Typography } from '@theme';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function SearchBar({
  value,
  onChangeText,
  placeholder = 'Search…',
  onClear,
  style,
  testID,
}: SearchBarProps) {
  const showClear = value.length > 0 && Boolean(onClear);

  return (
    <View style={[styles.container, style]}>
      {/* Search icon — left side */}
      <SymbolView
        name={{ ios: 'magnifyingglass', android: 'search', web: 'search' }}
        size={18}
        tintColor={Colors.textSecondary}
        style={styles.searchIcon}
      />

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.textSecondary}
        style={styles.input}
        returnKeyType="search"
        clearButtonMode="never" // We use our own clear button
        testID={testID}
        accessibilityLabel={placeholder}
        accessibilityRole="search"
      />

      {/* Clear button — only shown when input has text */}
      {showClear && (
        <Pressable
          onPress={onClear}
          style={({ pressed }) => [styles.clearButton, pressed && styles.clearPressed]}
          accessibilityRole="button"
          accessibilityLabel="Clear search"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <SymbolView
            name={{ ios: 'xmark.circle.fill', android: 'cancel', web: 'cancel' }}
            size={16}
            tintColor={Colors.textSecondary}
          />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: Layout.minTapTarget,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radii.button,
    backgroundColor: Colors.surfaceAlt,
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  searchIcon: {
    flexShrink: 0,
  },
  input: {
    flex: 1,
    ...Typography.body,
    color: Colors.ink,
    paddingVertical: Spacing.sm,
  },
  clearButton: {
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearPressed: {
    opacity: 0.6,
  },
});
