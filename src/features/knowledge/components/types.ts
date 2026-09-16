import type { Animated, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';

/** What a feed needs to drive the screen's collapsing header. */
export interface FeedScrollProps {
  onScroll: (e: NativeSyntheticEvent<NativeScrollEvent>) => void;
  /** Space the header occupies, reserved at the top of the list. */
  headerHeight: number;
}

export type ScrollValue = Animated.Value;
