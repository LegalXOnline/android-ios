/**
 * SafeScreenWrapper — Wraps children in SafeAreaView with app background.
 *
 * Phase 2 scope (per user approval): only wraps SafeAreaView.
 * No additional logic.
 *
 * All screens use this as their root container to respect Android notches
 */
import {
  SafeAreaView,
  type Edge,
} from 'react-native-safe-area-context';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { M3 } from '@theme';

interface SafeScreenWrapperProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Which edges to apply safe area insets. Default: all edges. */
  edges?: readonly Edge[];
}

export function SafeScreenWrapper({
  children,
  style,
  edges,
}: SafeScreenWrapperProps) {
  return (
    <SafeAreaView
      style={[styles.base, style]}
      edges={edges}
    >
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  base: {
    flex: 1,
    backgroundColor: M3.surface,
  },
});
