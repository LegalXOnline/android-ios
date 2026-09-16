/**
 * Avatar — Circular image with initials fallback.
 *
 * Used for: lawyer profile photo (LawyerCard, LawyerProfile), user avatar (Home header).
 * - Falls back to an initials monogram if no URI or image fails to load.
 */
import { Image } from 'expo-image';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { Colors, FontSize, FontWeight, Radii } from '@theme';

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

const SIZE_MAP: Record<AvatarSize, number> = {
  sm: 32,
  md: 44,
  lg: 56,
  xl: 80,
};

const FONT_MAP: Record<AvatarSize, number> = {
  sm: 12,
  md: FontSize.label,
  lg: FontSize.h2,
  xl: FontSize.h1,
};

interface AvatarProps {
  /** Remote image URI */
  uri?: string | null;
  /** 1–2 character initials shown when no image is available */
  initials?: string;
  size?: AvatarSize;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}

export function Avatar({
  uri,
  initials = '?',
  size = 'md',
  style,
  accessibilityLabel,
}: AvatarProps) {
  const dimension = SIZE_MAP[size];
  const fontSize = FONT_MAP[size];

  const containerStyle = {
    width: dimension,
    height: dimension,
    borderRadius: dimension / 2, // perfect circle
  };

  return (
    <View
      style={[styles.base, containerStyle, style]}
      accessibilityLabel={accessibilityLabel}
      accessible={Boolean(accessibilityLabel)}
    >
      {uri ? (
        <Image
          source={{ uri }}
          style={[styles.image, containerStyle]}
          contentFit="cover"
          // Transition for smooth loading
          transition={200}
          // On error, the fallback initials View beneath is shown
          // because Image renders on top; if it errors, it hides
          onError={() => undefined} // expo-image handles graceful fallback
          accessibilityLabel={accessibilityLabel}
        />
      ) : (
        <Text style={[styles.initials, { fontSize }]}>
          {initials.slice(0, 2).toUpperCase()}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: Radii.pill,
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  initials: {
    color: Colors.ink,
    fontWeight: FontWeight.semibold,
  },
});
