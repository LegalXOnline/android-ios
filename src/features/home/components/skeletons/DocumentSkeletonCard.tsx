/**
 * DocumentSkeletonCard — Shimmer placeholder for a ServiceCard.
 *
 * Used in PopularDocumentsRow during loading state.
 * No animation in Phase 3 — static gray blocks (per 24_AI_BUILD_GUIDE §26:
 * "skeleton loaders for content-bearing sections").
 * Animation can be added in Phase 6 (performance polish) if required.
 */
import { StyleSheet, View } from 'react-native';

import { Colors, Radii, Spacing } from '@theme';

export function DocumentSkeletonCard() {
  return (
    <View style={styles.card}>
      <View style={styles.titleLine} />
      <View style={styles.descLine} />
      <View style={styles.descLineShort} />
      <View style={styles.priceLine} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 200,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: Radii.card,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.sm,
  },
  titleLine: {
    height: 18,
    backgroundColor: Colors.border,
    borderRadius: Radii.sm,
    width: '70%',
  },
  descLine: {
    height: 13,
    backgroundColor: Colors.border,
    borderRadius: Radii.sm,
    width: '100%',
  },
  descLineShort: {
    height: 13,
    backgroundColor: Colors.border,
    borderRadius: Radii.sm,
    width: '60%',
  },
  priceLine: {
    height: 16,
    backgroundColor: Colors.border,
    borderRadius: Radii.sm,
    width: '40%',
    marginTop: Spacing.xs,
  },
});
