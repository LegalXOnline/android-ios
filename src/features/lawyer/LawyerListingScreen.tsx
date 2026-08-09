import { useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { FlatList, RefreshControl, ScrollView, StyleSheet, View, Text, TouchableOpacity, type ListRenderItem } from 'react-native';

import {
  AppHeader,
  Chip,
  EmptyState,
  LawyerCard,
  SafeScreenWrapper,
  SearchBar,
  SkeletonList,
  FilterModal,
  type LawyerCardData,
} from '@shared/components';
import { SymbolView } from 'expo-symbols';
import { Colors, Layout, Spacing, Typography, Radii } from '@theme';

import {
  LAWYER_CATEGORIES,
  PLACEHOLDER_LAWYERS_FULL,
  type LawyerCategory,
  type LawyerDetailPayload,
} from './lawyer.placeholder';

type LawyerSort = 'rating' | 'experience' | 'price_low' | 'price_high';

export function LawyerListingScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<LawyerCategory>('All');
  const [sortOption, setSortOption] = useState<LawyerSort>('rating');
  const [isOnlineOnly, setIsOnlineOnly] = useState(false);
  const [favouriteIds, setFavouriteIds] = useState<Set<string>>(new Set());
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading] = useState(false);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const filteredLawyers = useMemo(() => {
    let list = PLACEHOLDER_LAWYERS_FULL.filter((lawyer) => {
      if (isOnlineOnly && !lawyer.is_available_now) return false;

      if (selectedCategory !== 'All') {
        const matchesCategory = lawyer.practice_areas.some(
          (area) => area.toLowerCase() === selectedCategory.toLowerCase()
        );
        if (!matchesCategory) return false;
      }

      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase();
        const matchesName = lawyer.name.toLowerCase().includes(q);
        const matchesArea = lawyer.practice_areas.some((a) => a.toLowerCase().includes(q));
        const matchesTag = lawyer.expertise_tags.some((t) => t.toLowerCase().includes(q));
        const matchesLang = lawyer.languages.some((l) => l.toLowerCase().includes(q));
        const matchesCourt = lawyer.courts.some((c) => c.toLowerCase().includes(q));
        const matchesLoc = lawyer.location.toLowerCase().includes(q);
        return matchesName || matchesArea || matchesTag || matchesLang || matchesCourt || matchesLoc;
      }

      return true;
    });

    if (sortOption === 'rating') {
      list = [...list].sort((a, b) => b.rating_avg - a.rating_avg);
    } else if (sortOption === 'experience') {
      list = [...list].sort((a, b) => b.experience_years - a.experience_years);
    } else if (sortOption === 'price_low') {
      list = [...list].sort((a, b) => a.fee_chat - b.fee_chat);
    } else if (sortOption === 'price_high') {
      list = [...list].sort((a, b) => b.fee_video - a.fee_video);
    }

    return list;
  }, [searchQuery, selectedCategory, sortOption, isOnlineOnly]);

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
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search advocate by name, practice area, language, or court..."
        onClear={() => setSearchQuery('')}
        testID="lawyer-search-bar"
      />

      <View style={styles.filterRow}>
        <Text style={styles.resultCount}>
          <Text style={{ fontWeight: '600', color: Colors.ink }}>{filteredLawyers.length}</Text> lawyers
        </Text>
        <TouchableOpacity style={styles.filterBtn} onPress={() => setIsFilterModalVisible(true)}>
          <SymbolView name={{ ios: 'line.3.horizontal.decrease', android: 'filter_list', web: 'filter_list' }} size={16} tintColor={Colors.textSecondary as any} />
          <Text style={styles.filterBtnText}>Filters</Text>
        </TouchableOpacity>
      </View>
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

      {isLoading ? (
        <View style={styles.skeletonPadding}>
          <SkeletonList count={3} />
        </View>
      ) : (
        <FlatList
          data={filteredLawyers}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={Colors.primary}
              colors={[Colors.primary]}
            />
          }
          ListEmptyComponent={
            <EmptyState
              title="No Lawyers Found"
              description={`No advocate matches "${searchQuery || selectedCategory}". Try clearing your filters.`}
              symbol={{ ios: 'person.crop.circle.badge.questionmark', android: 'person_search', web: 'person_search' }}
              actionLabel="Reset Filters"
              onActionPress={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSortOption('rating');
              }}
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}

      <FilterModal
        visible={isFilterModalVisible}
        onClose={() => setIsFilterModalVisible(false)}
        sections={[
          {
            type: 'toggle',
            isToggled: isOnlineOnly,
            onToggle: setIsOnlineOnly,
            options: [{ label: 'Online now only', value: 'online' }],
          },
          {
            title: 'SORT BY',
            type: 'radio',
            selectedValue: sortOption,
            onSelect: (val) => setSortOption(val as LawyerSort),
            options: [
              { label: 'Top Rated', value: 'rating' },
              { label: 'Most Experienced', value: 'experience' },
              { label: 'Lowest Fee', value: 'price_low' },
            ],
          },
          {
            title: 'PRACTICE AREA',
            type: 'radio',
            selectedValue: selectedCategory,
            onSelect: (val) => setSelectedCategory(val as LawyerCategory),
            options: LAWYER_CATEGORIES.map((cat) => ({ label: cat, value: cat })),
          },
        ]}
      />
    </SafeScreenWrapper>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: Layout.screenPaddingHWide,
    paddingBottom: Spacing.xxl + 20,
  },
  skeletonPadding: {
    paddingHorizontal: Layout.screenPaddingHWide,
    paddingTop: Spacing.md,
  },
  headerContent: {
    gap: Spacing.md,
    paddingVertical: Spacing.md,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  resultCount: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radii.sm,
  },
  filterBtnText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  separator: {
    height: Spacing.md,
  },
});
