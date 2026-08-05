/**
 * LawyerListingScreen — SCR-07
 *
 * Professional marketplace listing for enrolled advocates.
 * Features:
 *   - App Header
 *   - Search Bar (live text filter)
 *   - Practice Area Filter Chips (Horizontal Scroll: All, Civil, Criminal, Corporate, Family, Property, Tax)
 *   - FlatList of LawyerCard items with favorite toggles
 *   - Empty state handling
 *   - Navigation to Lawyer Profile (/lawyer/[id])
 */
import { useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, View, type ListRenderItem } from 'react-native';

import {
  AppHeader,
  Chip,
  EmptyState,
  LawyerCard,
  SafeScreenWrapper,
  SearchBar,
  type LawyerCardData,
} from '@shared/components';
import { Layout, Spacing } from '@theme';

import {
  LAWYER_CATEGORIES,
  PLACEHOLDER_LAWYERS_FULL,
  type LawyerCategory,
  type LawyerDetailPayload,
} from './lawyer.placeholder';

export function LawyerListingScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<LawyerCategory>('All');
  const [favouriteIds, setFavouriteIds] = useState<Set<string>>(new Set());

  // Filter lawyers by search query and practice area category
  const filteredLawyers = useMemo(() => {
    return PLACEHOLDER_LAWYERS_FULL.filter((lawyer) => {
      // Category filter
      if (selectedCategory !== 'All') {
        const matchesCategory = lawyer.practice_areas.some(
          (area) => area.toLowerCase() === selectedCategory.toLowerCase()
        );
        if (!matchesCategory) return false;
      }

      // Search query filter
      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase();
        const matchesName = lawyer.name.toLowerCase().includes(q);
        const matchesArea = lawyer.practice_areas.some((a) => a.toLowerCase().includes(q));
        const matchesTag = lawyer.expertise_tags.some((t) => t.toLowerCase().includes(q));
        const matchesLang = lawyer.languages.some((l) => l.toLowerCase().includes(q));
        return matchesName || matchesArea || matchesTag || matchesLang;
      }

      return true;
    });
  }, [searchQuery, selectedCategory]);

  const handleLawyerPress = useCallback(
    (lawyerId: string) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      router.push(`/lawyer/${lawyerId}` as any);
    },
    [router]
  );

  const handleToggleFavourite = useCallback((lawyerId: string) => {
    setFavouriteIds((prev) => {
      const next = new Set(prev);
      if (next.has(lawyerId)) {
        next.delete(lawyerId);
      } else {
        next.add(lawyerId);
      }
      return next;
    });
  }, []);

  const renderHeader = () => (
    <View style={styles.headerContent}>
      {/* Search Bar */}
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search advocate by name, practice area, or language..."
        onClear={() => setSearchQuery('')}
        testID="lawyer-search-bar"
      />

      {/* Practice Area Filter Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryRow}
      >
        {LAWYER_CATEGORIES.map((cat) => (
          <Chip
            key={cat}
            label={cat}
            selected={selectedCategory === cat}
            onPress={() => setSelectedCategory(cat)}
            testID={`category-chip-${cat}`}
          />
        ))}
      </ScrollView>
    </View>
  );

  const renderItem: ListRenderItem<LawyerDetailPayload> = useCallback(
    ({ item }) => (
      <LawyerCard
        lawyer={item as LawyerCardData}
        onPress={() => handleLawyerPress(item.id)}
        onFavouritePress={() => handleToggleFavourite(item.id)}
        isFavourited={favouriteIds.has(item.id)}
        testID={`lawyer-card-${item.id}`}
      />
    ),
    [favouriteIds, handleLawyerPress, handleToggleFavourite]
  );

  return (
    <SafeScreenWrapper edges={['top', 'left', 'right']}>
      <AppHeader title="Talk to Lawyer" />

      <FlatList
        data={filteredLawyers}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <EmptyState
            title="No Lawyers Found"
            description={`No advocate matches "${searchQuery || selectedCategory}". Try clearing your filters.`}
            actionLabel="Reset Filters"
            onActionPress={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeScreenWrapper>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: Layout.screenPaddingHWide,
    paddingBottom: Spacing.xxl + 20,
  },
  headerContent: {
    gap: Spacing.md,
    paddingVertical: Spacing.md,
  },
  categoryRow: {
    gap: Spacing.xs,
    paddingRight: Spacing.md,
  },
  separator: {
    height: Spacing.md,
  },
});
