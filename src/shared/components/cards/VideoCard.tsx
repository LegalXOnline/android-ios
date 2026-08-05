/**
 * VideoCard — 16:9 video placeholder.
 *
 * Rules (04_Design_System.md §5.6):
 * - 16:9 frame, border outline, centered play icon, caption below.
 * - Accepts a videoUrl prop so no rework is needed when real content ships.
 * - In V1 this renders a placeholder until content is uploaded.
 * - Play button is presentation-only in Phase 2 (video playback wired in Phase 4+).
 */
import { SymbolView } from 'expo-symbols';
import {
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { Colors, Radii, Spacing, Typography } from '@theme';

interface VideoCardProps {
  /**
   * Video URL — accepted and stored for future use.
   * When null/undefined, renders a placeholder frame.
   */
  videoUrl?: string | null;
  /** Caption displayed below the frame. Default: "30–60 sec overview" */
  caption?: string;
  style?: StyleProp<ViewStyle>;
}

export function VideoCard({
  videoUrl: _videoUrl, // stored but not yet used in V1 — no rework needed later
  caption = '30–60 sec overview',
  style,
}: VideoCardProps) {
  return (
    <View style={[styles.container, style]}>
      {/* 16:9 placeholder frame */}
      <View style={styles.frame}>
        {/* Centered play icon */}
        <View style={styles.playCircle}>
          <SymbolView
            name={{ ios: 'play.fill', android: 'play_arrow', web: 'play_arrow' }}
            size={28}
            tintColor={Colors.ink}
          />
        </View>
      </View>

      {/* Caption */}
      {caption ? (
        <Text style={styles.caption}>{caption}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.sm,
  },
  frame: {
    // aspectRatio enforces 16:9 responsively
    aspectRatio: 16 / 9,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radii.card,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  playCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    // Offset the play icon slightly right for optical centering
    paddingLeft: 3,
  },
  caption: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
