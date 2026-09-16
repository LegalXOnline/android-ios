import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import type { LayoutChangeEvent } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTabBarInset } from '@shared/components/navigation/FloatingTabBar';
import { LX, LXShape, LXType } from '@theme';

import { RightsFeed } from './components/RightsFeed';
import { UpdatesFeed } from './components/UpdatesFeed';

/**
 * The two sections the website's Knowledge Center opens on: the daily updates
 * feed and the Know Your Rights library. Each owns its paging and search, so
 * switching between them does not discard what the other had loaded.
 */
type Section = 'updates' | 'rights';

const SECTIONS: { key: Section; label: string; title: string; hint: string }[] = [
  {
    key: 'updates',
    label: 'Legal updates',
    title: 'Legal updates',
    hint: 'Two-minute summaries of what changed, with the source behind each one.',
  },
  {
    key: 'rights',
    label: 'Know your rights',
    title: 'Know your rights',
    hint: 'Plain answers on Indian law, traced to the section and reviewed before publishing.',
  },
];

export function KnowledgeHomeScreen() {
  const insets = useSafeAreaInsets();
  const bottomInset = useTabBarInset();

  const [section, setSection] = useState<Section>('updates');
  const [search, setSearch] = useState('');

  // Measured rather than hardcoded: the title block is two or three lines
  // depending on the section and the device width.
  const [headerHeight, setHeaderHeight] = useState(0);
  const [collapseBy, setCollapseBy] = useState(0);

  // Lazy state, not a ref: the value has to survive re-renders, and reading
  // ref.current during render is what the compiler rightly objects to.
  const [scrollY] = useState(() => new Animated.Value(0));
  const [onScroll] = useState(() =>
    Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true }),
  );

  const range = Math.max(collapseBy, 1);
  // The whole header slides up by exactly the height of the part that goes, so
  // the controls end up pinned at the top rather than drifting.
  const translateY = scrollY.interpolate({
    inputRange: [0, range],
    outputRange: [0, -range],
    extrapolate: 'clamp',
  });
  const titleOpacity = scrollY.interpolate({
    inputRange: [0, range * 0.7],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });
  const scrolledOpacity = scrollY.interpolate({
    inputRange: [0, 12],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const active = SECTIONS.find((s) => s.key === section) ?? SECTIONS[0];

  const switchTo = (next: Section) => {
    if (next === section) return;
    setSection(next);
    setSearch('');
    scrollY.setValue(0);
  };

  const measureHeader = (e: LayoutChangeEvent) => {
    const h = Math.round(e.nativeEvent.layout.height);
    if (h !== headerHeight) setHeaderHeight(h);
  };

  const measureTitle = (e: LayoutChangeEvent) => {
    const h = Math.round(e.nativeEvent.layout.height);
    if (h !== collapseBy) setCollapseBy(h);
  };

  // The list reserves the expanded header. Scrolling slides the header up by
  // collapseBy, after which content passes under the pinned controls.
  const feedProps = { search, bottomInset, onScroll, headerHeight };

  return (
    <View style={styles.screen}>
      {section === 'updates' ? <UpdatesFeed {...feedProps} /> : <RightsFeed {...feedProps} />}

      <Animated.View
        onLayout={measureHeader}
        style={[
          styles.header,
          { paddingTop: insets.top + 10, transform: [{ translateY }] },
        ]}
      >
        <Animated.View onLayout={measureTitle} style={[styles.titleBlock, { opacity: titleOpacity }]}>
          <Text style={styles.title}>{active.title}</Text>
          <Text style={styles.subtitle}>{active.hint}</Text>
        </Animated.View>

        <View style={styles.segmented}>
          {SECTIONS.map((s) => {
            const on = s.key === section;
            return (
              <Pressable
                key={s.key}
                onPress={() => switchTo(s.key)}
                accessibilityRole="tab"
                accessibilityState={{ selected: on }}
                style={[styles.segment, on && styles.segmentOn]}
              >
                <Text style={[styles.segmentText, on && styles.segmentTextOn]}>{s.label}</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.search}>
          <SymbolView
            name={{ ios: 'magnifyingglass', android: 'search', web: 'search' }}
            size={18}
            tintColor={LX.inkFaint}
          />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder={section === 'updates' ? 'Search updates' : 'Search rights, sections'}
            placeholderTextColor={LX.inkFaint}
            style={styles.searchInput}
            autoCapitalize="none"
            returnKeyType="search"
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch('')} hitSlop={10} accessibilityLabel="Clear search">
              <SymbolView
                name={{ ios: 'xmark.circle.fill', android: 'cancel', web: 'cancel' }}
                size={17}
                tintColor={LX.inkFaint}
              />
            </Pressable>
          )}
        </View>

        <Animated.View
          pointerEvents="none"
          style={[styles.headerEdge, { opacity: scrolledOpacity }]}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: LX.bg },

  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 18,
    paddingBottom: 12,
    backgroundColor: LX.bg,
  },
  headerEdge: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 1,
    backgroundColor: LX.border,
  },
  titleBlock: { gap: 6, paddingBottom: 12 },
  title: { ...LXType.display, fontSize: 30, lineHeight: 36, color: LX.ink },
  subtitle: { ...LXType.bodySmall, color: LX.inkMuted },

  segmented: {
    flexDirection: 'row',
    gap: 4,
    padding: 4,
    borderRadius: LXShape.full,
    backgroundColor: LX.surfaceSunken,
  },
  segment: {
    flex: 1,
    height: 40,
    borderRadius: LXShape.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentOn: { backgroundColor: LX.surface },
  segmentText: { ...LXType.label, fontSize: 14, color: LX.inkMuted },
  segmentTextOn: { color: LX.ink },

  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 50,
    marginTop: 8,
    paddingHorizontal: 16,
    borderRadius: LXShape.full,
    backgroundColor: LX.surfaceSunken,
    borderWidth: 1,
    borderColor: LX.border,
  },
  searchInput: { flex: 1, ...LXType.body, color: LX.ink, padding: 0 },
});
