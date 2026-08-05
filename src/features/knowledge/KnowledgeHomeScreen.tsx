import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, RefreshControl, ScrollView, StyleSheet, View, type ListRenderItem } from 'react-native';

import {
  AppHeader,
  Chip,
  EmptyState,
  SafeScreenWrapper,
  SearchBar,
  SectionHeader,
  SkeletonList,
} from '@shared/components';
import { Colors, Layout, Spacing } from '@theme';

import { ArticleCard } from './components/ArticleCard';
import { FeaturedArticleCard } from './components/FeaturedArticleCard';
import {
  KNOWLEDGE_CATEGORIES,
  PLACEHOLDER_ARTICLES,
  type ArticlePayload,
  type KnowledgeCategory,
} from './knowledge.placeholder';

type ArticleSort = 'newest' | 'popular' | 'read_time';

export function KnowledgeHomeScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<KnowledgeCategory>('All');
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  const [sortOption, setSortOption] = useState<ArticleSort>('newest');
  const [articles, setArticles] = useState<ArticlePayload[]>(PLACEHOLDER_ARTICLES);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const featuredArticle = useMemo(
    () => articles.find((a) => a.isFeatured) || articles[0],
    [articles]
  );

  const trendingArticles = useMemo(
    () => articles.filter((a) => a.isTrending),
    [articles]
  );

  const filteredArticles = useMemo(() => {
    let list = articles.filter((art) => {
      if (showBookmarksOnly && !art.isBookmarked) return false;

      if (selectedCategory !== 'All') {
        if (art.category.toLowerCase() !== selectedCategory.toLowerCase()) {
          return false;
        }
      }

      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase();
        const matchTitle = art.title.toLowerCase().includes(q);
        const matchTeaser = art.teaser.toLowerCase().includes(q);
        const matchCategory = art.category.toLowerCase().includes(q);
        const matchAuthor = art.author.toLowerCase().includes(q);
        return matchTitle || matchTeaser || matchCategory || matchAuthor;
      }

      return true;
    });

    if (sortOption === 'newest') {
      list = [...list].sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime());
    } else if (sortOption === 'popular') {
      list = [...list].sort((a, b) => (b.isTrending ? 1 : 0) - (a.isTrending ? 1 : 0));
    } else if (sortOption === 'read_time') {
      const getMin = (r: string) => parseInt(r) || 5;
      list = [...list].sort((a, b) => getMin(a.readingTime) - getMin(b.readingTime));
    }

    return list;
  }, [articles, searchQuery, selectedCategory, showBookmarksOnly, sortOption]);

  const handleArticlePress = (id: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    router.push(`/knowledge/${id}` as any);
  };

  const handleBookmarkToggle = (id: string) => {
    setArticles((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isBookmarked: !a.isBookmarked } : a))
    );
  };

  const renderHeader = () => (
    <View style={styles.headerContent}>
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search legal articles, guides, or laws..."
        onClear={() => setSearchQuery('')}
      />

      <View style={styles.filterBar}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryRow}
        >
          <Chip
            label="★ Bookmarks"
            selected={showBookmarksOnly}
            onPress={() => setShowBookmarksOnly(!showBookmarksOnly)}
          />

          {KNOWLEDGE_CATEGORIES.map((cat) => (
            <Chip
              key={cat}
              label={cat}
              selected={!showBookmarksOnly && selectedCategory === cat}
              onPress={() => {
                setShowBookmarksOnly(false);
                setSelectedCategory(cat);
              }}
            />
          ))}
        </ScrollView>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryRow}
      >
        <Chip
          label="Newest"
          selected={sortOption === 'newest'}
          onPress={() => setSortOption('newest')}
        />
        <Chip
          label="Most Popular"
          selected={sortOption === 'popular'}
          onPress={() => setSortOption('popular')}
        />
        <Chip
          label="Reading Time (Shortest)"
          selected={sortOption === 'read_time'}
          onPress={() => setSortOption('read_time')}
        />
      </ScrollView>

      {!searchQuery && !showBookmarksOnly && selectedCategory === 'All' && featuredArticle && (
        <View style={styles.sectionBlock}>
          <FeaturedArticleCard
            article={featuredArticle}
            onPress={() => handleArticlePress(featuredArticle.id)}
          />
        </View>
      )}

      {!searchQuery && !showBookmarksOnly && selectedCategory === 'All' && trendingArticles.length > 0 && (
        <View style={styles.sectionBlock}>
          <SectionHeader title="Trending Legal Topics" style={styles.sectionHeaderOverride} />
          <View style={styles.trendingList}>
            {trendingArticles.map((art) => (
              <ArticleCard
                key={`trending-${art.id}`}
                article={art}
                onPress={() => handleArticlePress(art.id)}
                onBookmarkToggle={() => handleBookmarkToggle(art.id)}
              />
            ))}
          </View>
        </View>
      )}

      <SectionHeader
        title={
          showBookmarksOnly
            ? `Bookmarked Articles (${filteredArticles.length})`
            : `Articles (${filteredArticles.length})`
        }
        style={styles.sectionHeaderOverride}
      />
    </View>
  );

  const renderItem: ListRenderItem<ArticlePayload> = ({ item }) => (
    <ArticleCard
      article={item}
      onPress={() => handleArticlePress(item.id)}
      onBookmarkToggle={() => handleBookmarkToggle(item.id)}
    />
  );

  return (
    <SafeScreenWrapper edges={['top', 'left', 'right']}>
      <AppHeader title="Knowledge Centre" />

      {isLoading ? (
        <View style={styles.skeletonPadding}>
          <SkeletonList count={3} />
        </View>
      ) : (
        <FlatList
          data={filteredArticles}
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
              title={showBookmarksOnly ? 'No Bookmarks Yet' : 'No Articles Found'}
              description={
                showBookmarksOnly
                  ? 'Save articles by tapping the bookmark icon to read them later.'
                  : `No articles matched "${searchQuery || selectedCategory}".`
              }
              symbol={{ ios: 'bookmark.slash.fill', android: 'article', web: 'article' }}
              actionLabel="Reset Filters"
              onActionPress={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setShowBookmarksOnly(false);
                setSortOption('newest');
              }}
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
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
    gap: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  filterBar: {
    marginTop: -Spacing.xs,
  },
  categoryRow: {
    gap: Spacing.sm,
    paddingRight: Spacing.md,
  },
  sectionBlock: {
    gap: Spacing.sm,
  },
  sectionHeaderOverride: {
    paddingVertical: 0,
  },
  trendingList: {
    gap: Spacing.md,
  },
  separator: {
    height: Spacing.md,
  },
});
