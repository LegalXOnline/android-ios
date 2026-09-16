import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { LX, LXShadow, LXShape, LXType } from '@theme';

/** A white card on the warm ground. The base surface for everything. */
export function LXCard({
  children,
  style,
  onPress,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}) {
  if (!onPress) return <View style={[styles.card, style]}>{children}</View>;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed, style]}
    >
      {children}
    </Pressable>
  );
}

/** Circular tinted icon holder, the expressive alternative to a bare glyph. */
export function LXIconChip({
  symbol,
  size = 46,
  tint = LX.goldSoft,
  color = LX.goldText,
}: {
  symbol: SymbolViewProps['name'];
  size?: number;
  tint?: string;
  color?: string;
}) {
  return (
    <View
      style={[
        styles.iconChip,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: tint },
      ]}
    >
      <SymbolView name={symbol} size={size * 0.45} tintColor={color} />
    </View>
  );
}

export function LXPill({
  label,
  fg = LX.goldText,
  bg = LX.goldSoft,
}: {
  label: string;
  fg?: string;
  bg?: string;
}) {
  return (
    <View style={[styles.pill, { backgroundColor: bg }]}>
      <Text style={[styles.pillText, { color: fg }]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

/** Section heading with an optional trailing action. */
export function LXSectionHeader({
  title,
  actionLabel,
  onAction,
}: {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {actionLabel && onAction && (
        <Pressable onPress={onAction} hitSlop={10} accessibilityRole="button">
          <Text style={styles.sectionAction}>{actionLabel}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: LX.surface,
    borderRadius: LXShape.lg,
    borderWidth: 1,
    borderColor: LX.border,
    ...LXShadow.card,
  },
  cardPressed: { backgroundColor: LX.surfaceHover },
  iconChip: { alignItems: 'center', justifyContent: 'center' },
  pill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: LXShape.xs,
  },
  pillText: { ...LXType.overline, fontSize: 10.5 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: { ...LXType.title, color: LX.ink },
  sectionAction: { ...LXType.label, fontSize: 14, color: LX.goldText },
});
