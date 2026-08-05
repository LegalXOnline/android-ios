/**
 * LawyerSkeletonCard — Shimmer placeholder for a LawyerCard.
 *
 * Used in PopularLawyersRow during loading state.
 * Static gray blocks — no animation in Phase 3.
 */
import { StyleSheet, View } from 'react-native';

import { Colors, Radii, Spacing } from '@theme';

export function LawyerSkeletonCard() {
  return (
    <View style={styles.card}>
      {/* Header row: circle + lines */}
      <View style={styles.headerRow}>
        <View style={styles.avatar} />
        <View style={styles.infoBlock}>
          <View style={styles.nameLine} />
          <View style={styles.ratingLine} />
          <View style={styles.expLine} />
        </View>
      </View>
      {/* Tag rows */}
      <View style={styles.tagRow}>
        <View style={styles.tag} />
        <View style={styles.tagShort} />
      </View>
      {/* Mode buttons */}
      <View style={styles.modeRow}>
        <View style={styles.modeButton} />
        <View style={styles.modeButton} />
        <View style={styles.modeButton} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 300,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: Radii.card,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.border,
  },
  infoBlock: {
    flex: 1,
    gap: Spacing.xs,
    justifyContent: 'center',
  },
  nameLine: {
    height: 18,
    backgroundColor: Colors.border,
    borderRadius: Radii.sm,
    width: '70%',
  },
  ratingLine: {
    height: 13,
    backgroundColor: Colors.border,
    borderRadius: Radii.sm,
    width: '50%',
  },
  expLine: {
    height: 13,
    backgroundColor: Colors.border,
    borderRadius: Radii.sm,
    width: '40%',
  },
  tagRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  tag: {
    height: 24,
    width: 70,
    backgroundColor: Colors.border,
    borderRadius: 999,
  },
  tagShort: {
    height: 24,
    width: 50,
    backgroundColor: Colors.border,
    borderRadius: 999,
  },
  modeRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  modeButton: {
    flex: 1,
    height: 44,
    backgroundColor: Colors.border,
    borderRadius: Radii.button,
  },
});
