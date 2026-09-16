import type { BottomTabBarProps } from 'expo-router/build/react-navigation/bottom-tabs/types';
import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LX, LXShadow, LXShape, LXType } from '@theme';

/**
 * Material 3 Expressive navigation bar.
 *
 * The bar floats over the content on a dark container, and the selected
 * destination grows into a labelled pill rather than tinting an icon — the
 * shape carries the selection, which is what the expressive guidance asks for.
 */

const ICONS: Record<string, SymbolViewProps['name']> = {
  index: { ios: 'house.fill', android: 'home', web: 'home' },
  documentation: { ios: 'doc.text.fill', android: 'description', web: 'description' },
  'knowledge-centre': { ios: 'book.fill', android: 'menu_book', web: 'menu_book' },
  'talk-to-lawyer': { ios: 'bubble.left.fill', android: 'forum', web: 'forum' },
};

const LABELS: Record<string, string> = {
  index: 'Home',
  documentation: 'Docs',
  'knowledge-centre': 'Learn',
  'talk-to-lawyer': 'Lawyers',
};

/** Height of the bar itself, before the safe-area inset underneath it. */
export const TAB_BAR_HEIGHT = 60;

/**
 * Space between the bar and the bottom of the screen.
 *
 * The inset is what the system reserves for itself, not a gap the app may sit
 * in. A gesture handle reports about 16dp and the bar was landing on top of
 * it — taking the larger of the two put it inside the band rather than above
 * it. The clearance is added to whatever the system asked for, so three-button
 * navigation and a gesture handle both end up clear.
 */
function bottomClearance(inset: number): number {
  return inset + 14;
}

/**
 * Bottom padding a scrolling tab screen needs so its last row clears the bar.
 * The bar floats over the content, so nothing reserves this space for us.
 */
export function useTabBarInset(): number {
  const insets = useSafeAreaInsets();
  return TAB_BAR_HEIGHT + bottomClearance(insets.bottom) + 12;
}

/**
 * How far the bar has been pushed off-screen, shared between the bar and the
 * screens that scroll under it.
 *
 * The bar floats over content, so on a long page it sits on top of whatever is
 * at the bottom. Hiding it as the reader goes down and bringing it back the
 * moment they go up keeps it reachable without it blocking anything.
 */
const TabBarVisibility = createContext<Animated.Value | null>(null);

export function TabBarVisibilityProvider({ children }: { children: ReactNode }) {
  const [offset] = useState(() => new Animated.Value(0));
  return <TabBarVisibility.Provider value={offset}>{children}</TabBarVisibility.Provider>;
}

/**
 * How far the bar must travel to be completely gone.
 *
 * This was a constant, and the dock is not a constant height: it is the bar
 * plus whatever the system reserves underneath it. On a handset with three
 * buttons the dock is about 122dp and the constant moved it 100, so a strip
 * stayed on screen below the navigation bar.
 */
function hiddenOffset(inset: number): number {
  return TAB_BAR_HEIGHT + bottomClearance(inset) + 24;
}

/**
 * Drives the bar from a scrolling screen.
 *
 * Direction, not position: hiding on absolute offset would leave the bar gone
 * after a single flick and make the reader scroll to the top to get it back.
 */
export function useTabBarAutoHide() {
  const offset = useContext(TabBarVisibility);
  const insets = useSafeAreaInsets();
  const travel = hiddenOffset(insets.bottom);

  return useMemo(() => {
    if (!offset) return { onScroll: undefined };

    let last = 0;
    let hidden = false;

    const settle = (to: number) =>
      Animated.timing(offset, {
        toValue: to,
        duration: 220,
        useNativeDriver: true,
      }).start();

    return {
      onScroll: (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const y = e.nativeEvent.contentOffset.y;
        const delta = y - last;

        // A small threshold, so a thumb resting on the screen does not flicker
        // the bar in and out.
        if (Math.abs(delta) < 6) return;
        last = y;

        // Never hide at the very top: there is nothing underneath to reveal.
        const shouldHide = delta > 0 && y > travel;
        if (shouldHide !== hidden) {
          hidden = shouldHide;
          settle(shouldHide ? travel : 0);
        }
      },
    };
  }, [offset, travel]);
}

/**
 * Keeps the bar off-screen while a screen is mounted.
 *
 * For pushed screens that carry their own bottom action — a Buy Now, a
 * Continue — the floating bar lands directly on top of it. Those screens hide
 * it outright rather than fighting it for the same 60 pixels.
 */
export function useHideTabBar() {
  const offset = useContext(TabBarVisibility);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (!offset) return;

    Animated.timing(offset, {
      toValue: hiddenOffset(insets.bottom),
      duration: 200,
      useNativeDriver: true,
    }).start();

    return () => {
      Animated.timing(offset, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    };
  }, [offset, insets.bottom]);
}

export function FloatingTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const offset = useContext(TabBarVisibility);

  return (
    <Animated.View
      style={[
        styles.dock,
        { paddingBottom: bottomClearance(insets.bottom) },
        offset ? { transform: [{ translateY: offset }] } : null,
      ]}
      pointerEvents="box-none"
    >
      <View style={styles.bar}>
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const label = LABELS[route.name] ?? route.name;
          const icon = ICONS[route.name];
          if (!icon) return null;

          const press = () => {
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!focused && !event.defaultPrevented) navigation.navigate(route.name);
          };

          return (
            <Pressable
              key={route.key}
              onPress={press}
              accessibilityRole="tab"
              accessibilityState={{ selected: focused }}
              accessibilityLabel={label}
              style={[styles.item, focused && styles.itemActive]}
            >
              <SymbolView name={icon} size={21} tintColor={focused ? LX.onGold : LX.onDark} />
              {focused && <Text style={styles.label}>{label}</Text>}
            </Pressable>
          );
        })}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  dock: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: LX.dark,
    borderRadius: LXShape.full,
    padding: 6,
    ...LXShadow.raised,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 48,
    minWidth: 56,
    paddingHorizontal: 16,
    borderRadius: LXShape.full,
  },
  itemActive: { backgroundColor: LX.gold, paddingHorizontal: 20 },
  label: { ...LXType.label, fontSize: 14, color: LX.onGold },
});
