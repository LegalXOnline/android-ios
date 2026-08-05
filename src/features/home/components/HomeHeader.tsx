/**
 * HomeHeader — Greeting row with profile avatar and LX Coin chip.
 *
 * Layout (06_Module_Home.md §2.1 item 1):
 *   [Greeting text]   [LX Coins chip] [Avatar]
 *
 * Rules:
 * - Greeting: "Welcome back" fallback (no auth in Phase 3).
 *   When auth is wired: "Good morning/evening, [first_name]".
 * - Avatar taps → Profile stack (pushed via router, not a tab).
 * - LX Coins chip taps → /profile/lx-coins (view-only per 12_Module_Profile §4).
 * - Gold (#D4A91F) coin chip — single element using primary color; not a CTA.
 *   The gold chip is an informational badge, not a buy action, so this
 *   does not violate the "at most one gold CTA per screen" rule.
 * - Header renders immediately — no loading state here (06_Module_Home §2.3).
 */
import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Avatar } from '@shared/components';
import { Colors, FontSize, FontWeight, Layout, Spacing, Typography } from '@theme';

interface HomeHeaderProps {
  /** First name from auth profile. Falls back to null → shows "Welcome back". */
  firstName?: string | null;
  /** LX Coin balance. Null shows "—" (loading/unset). */
  lxCoinBalance?: number | null;
  onAvatarPress: () => void;
  onCoinsPress: () => void;
}

export function HomeHeader({
  firstName,
  lxCoinBalance,
  onAvatarPress,
  onCoinsPress,
}: HomeHeaderProps) {
  const greeting = buildGreeting(firstName);
  const coinLabel =
    lxCoinBalance != null ? `${lxCoinBalance} LX` : '— LX';
  const initials = firstName ? firstName.slice(0, 2).toUpperCase() : 'U';

  return (
    <View style={styles.container}>
      {/* Left: greeting */}
      <View style={styles.greetingBlock}>
        <Text style={styles.greetingLabel}>LegalX</Text>
        <Text style={styles.greetingName} numberOfLines={1}>
          {greeting}
        </Text>
      </View>

      {/* Right: LX Coins + Avatar */}
      <View style={styles.rightBlock}>
        {/* LX Coin chip — view-only display, taps to SCR-18 */}
        <Pressable
          onPress={onCoinsPress}
          accessibilityRole="button"
          accessibilityLabel={`LX Coins balance: ${coinLabel}`}
          style={({ pressed }) => [styles.coinChip, pressed && styles.pressed]}
        >
          <SymbolView
            name={{ ios: 'circle.hexagongrid.fill', android: 'toll', web: 'toll' }}
            size={14}
            tintColor={Colors.primary}
          />
          <Text style={styles.coinLabel}>{coinLabel}</Text>
        </Pressable>

        {/* Profile avatar → Profile stack */}
        <Pressable
          onPress={onAvatarPress}
          accessibilityRole="button"
          accessibilityLabel="Open profile"
          style={({ pressed }) => pressed && styles.pressed}
        >
          <Avatar
            uri={null}
            initials={initials}
            size="md"
            accessibilityLabel="Profile"
          />
        </Pressable>
      </View>
    </View>
  );
}

/** Returns time-aware greeting. Falls back gracefully with no name. */
function buildGreeting(firstName?: string | null): string {
  if (!firstName) return 'Welcome back';
  const hour = new Date().getHours();
  if (hour < 12) return `Good morning, ${firstName}`;
  if (hour < 17) return `Good afternoon, ${firstName}`;
  return `Good evening, ${firstName}`;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.screenPaddingHWide,
    paddingVertical: Spacing.md,
  },
  greetingBlock: {
    flex: 1,
    marginRight: Spacing.md,
  },
  greetingLabel: {
    fontSize: FontSize.bodySmall,
    color: Colors.textSecondary,
    fontWeight: FontWeight.regular,
  },
  greetingName: {
    ...Typography.h1,
    color: Colors.ink,
  },
  rightBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  coinChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 999,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  coinLabel: {
    fontSize: FontSize.label,
    fontWeight: FontWeight.medium,
    color: Colors.ink,
  },
  pressed: {
    opacity: 0.7,
  },
});
