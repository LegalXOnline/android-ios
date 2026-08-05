/**
 * AppHeader — Screen-level navigation header.
 *
 * Used as a custom header replacement on stacked screens (Service Detail,
 * Lawyer Profile, Profile sub-screens, Consultation Booking steps).
 *
 * Rules:
 * - H1 title (22px semibold) per 04_Design_System §3.
 * - Optional back arrow (showBack) with onBackPress callback.
 * - Optional rightElement slot for screen-specific actions (e.g. favourite icon).
 * - Renders inside safe area — assumes parent provides SafeScreenWrapper.
 */
import { SymbolView } from 'expo-symbols';
import { type ReactNode } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { Colors, Layout, Spacing, Typography } from '@theme';

interface AppHeaderProps {
  title: string;
  showBack?: boolean;
  onBackPress?: () => void;
  /** Optional element for the right slot (e.g. IconButton for favourite, share) */
  rightElement?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function AppHeader({
  title,
  showBack = false,
  onBackPress,
  rightElement,
  style,
}: AppHeaderProps) {
  return (
    <View style={[styles.container, style]}>
      {/* Left: back button */}
      <View style={styles.sideSlot}>
        {showBack && (
          <Pressable
            onPress={onBackPress}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
            hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
          >
            <SymbolView
              name={{ ios: 'chevron.left', android: 'arrow_back', web: 'arrow_back' }}
              size={22}
              tintColor={Colors.ink}
            />
          </Pressable>
        )}
      </View>

      {/* Center: title */}
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>

      {/* Right: optional action slot */}
      <View style={[styles.sideSlot, styles.rightSlot]}>
        {rightElement ?? null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: Layout.minTapTarget,
    paddingHorizontal: Layout.screenPaddingH,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.surface,
  },
  sideSlot: {
    width: Layout.minTapTarget,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  rightSlot: {
    alignItems: 'flex-end',
  },
  backButton: {
    minWidth: Layout.minTapTarget,
    minHeight: Layout.minTapTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.6,
  },
  title: {
    ...Typography.h1,
    color: Colors.ink,
    flex: 1,
    textAlign: 'center',
  },
});
