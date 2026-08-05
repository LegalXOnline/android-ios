import { useRouter, type Href } from 'expo-router';
import { useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import {
  AppHeader,
  EmptyState,
  SafeScreenWrapper,
} from '@shared/components';
import { Layout, Spacing } from '@theme';

import { ArticleCard } from '../knowledge/components/ArticleCard';
import { PLACEHOLDER_ARTICLES, type ArticlePayload } from '../knowledge/knowledge.placeholder';

export function SavedArticlesScreen() {
  const router = useRouter();
  const [savedArticles, setSavedArticles] = useState<ArticlePayload[]>(
    PLACEHOLDER_ARTICLES.filter((a) => a.isBookmarked)
  );

  const handleArticlePress = (id: string) => {
    router.push(`/knowledge/${id}` as Href);
  };

  const handleRemoveBookmark = (id: string) => {
    setSavedArticles((prev) => prev.filter((a) => a.id !== id));
  };

  const renderItem = ({ item }: { item: ArticlePayload }) => (
    <ArticleCard
      article={item}
      onPress={() => handleArticlePress(item.id)}
      onBookmarkToggle={() => handleRemoveBookmark(item.id)}
    />
  );

  return (
    <SafeScreenWrapper edges={['top', 'left', 'right']}>
      <AppHeader title="Saved Articles" showBack onBackPress={() => router.back()} />

      <FlatList
        data={savedArticles}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <EmptyState
            title="No Saved Articles"
            description="You haven't bookmarked any legal guides or articles yet."
            symbol={{ ios: 'bookmark.slash.fill', android: 'bookmark_border', web: 'bookmark_border' }}
            actionLabel="Explore Knowledge Centre"
            onActionPress={() => router.push('/(tabs)/knowledge-centre' as Href)}
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
    paddingVertical: Spacing.md,
    paddingBottom: Spacing.xxl + 20,
  },
  separator: {
    height: Spacing.md,
  },
});
