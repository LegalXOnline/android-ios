/**
 * LoadingIndicator — Branded activity spinner.
 *
 * Rules (24_AI_BUILD_GUIDE §26):
 * - Skeleton loaders are used for content-bearing sections (implemented per-screen).
 * - This spinner is for brief fetches, button loading states, and full-screen loading.
 * - Gold color for brand consistency on loading indicators.
 * - fullScreen prop centers it within the available space.
 */
import {
  ActivityIndicator,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { Colors } from '@theme';

interface LoadingIndicatorProps {
  size?: 'small' | 'large';
  /** If true, centers the spinner to fill the remaining screen area */
  fullScreen?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function LoadingIndicator({
  size = 'large',
  fullScreen = false,
  style,
}: LoadingIndicatorProps) {
  return (
    <View style={[fullScreen ? styles.fullScreen : styles.inline, style]}>
      <ActivityIndicator
        size={size}
        color={Colors.primary} // Gold — brand loading color
        accessibilityLabel="Loading"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
  },
  inline: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
});
