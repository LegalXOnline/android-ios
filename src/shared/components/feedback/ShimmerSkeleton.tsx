import { useEffect, useState } from 'react';
import { Animated, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { Colors, Radii, Spacing } from '@theme';

interface SkeletonBoxProps {
  width?: number | `${number}%`;
  height?: number;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
}

export function SkeletonBox({
  width = '100%',
  height = 20,
  borderRadius = Radii.sm,
  style,
}: SkeletonBoxProps) {
  const [animatedValue] = useState(() => new Animated.Value(0.3));

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 0.8,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [animatedValue]);

  return (
    <Animated.View
      style={[
        styles.box,
        {
          width,
          height,
          borderRadius,
          opacity: animatedValue,
        },
        style,
      ]}
    />
  );
}

export function SkeletonCard() {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <SkeletonBox width={48} height={48} borderRadius={24} />
        <View style={styles.textStack}>
          <SkeletonBox width="60%" height={16} />
          <SkeletonBox width="40%" height={12} />
        </View>
      </View>
      <SkeletonBox width="90%" height={14} />
      <SkeletonBox width="75%" height={14} />
      <View style={styles.footerRow}>
        <SkeletonBox width={80} height={20} />
        <SkeletonBox width={100} height={36} borderRadius={Radii.button} />
      </View>
    </View>
  );
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <View style={styles.listContainer}>
      {Array.from({ length: count }).map((_, idx) => (
        <SkeletonCard key={idx} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: Colors.border,
  },
  card: {
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radii.card,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  textStack: {
    flex: 1,
    gap: 6,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  listContainer: {
    gap: Spacing.md,
    paddingVertical: Spacing.sm,
  },
});
