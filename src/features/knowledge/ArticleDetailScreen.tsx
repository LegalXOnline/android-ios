import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import {
  AppHeader,
  Badge,
  Divider,
  ErrorState,
  IconButton,
  PrimaryButton,
  SafeScreenWrapper,
  SecondaryButton,
} from '@shared/components';
import { Colors, FontSize, FontWeight, Layout, Radii, Shadows, Spacing, Typography } from '@theme';

import { ArticleCard } from './components/ArticleCard';
import { getArticleById, PLACEHOLDER_ARTICLES } from './knowledge.placeholder';

interface ArticleDetailScreenProps {
  articleId: string;
}

export function ArticleDetailScreen({ articleId }: ArticleDetailScreenProps) {
  const router = useRouter();
  const article = getArticleById(articleId);

  const [isBookmarked, setIsBookmarked] = useState(article?.isBookmarked ?? false);
  const [shareNotice, setShareNotice] = useState(false);

  if (!article) {
    return (
      <SafeScreenWrapper edges={['top', 'left', 'right']}>
        <AppHeader title="Article Detail" showBack onBackPress={() => router.back()} />
        <ErrorState
          title="Article Not Found"
          description="The requested legal guide or article is unavailable."
          onRetry={() => router.back()}
        />
      </SafeScreenWrapper>
    );
  }

  const relatedArticles = PLACEHOLDER_ARTICLES.filter(
    (a) => a.id !== article.id && a.category === article.category
  ).slice(0, 2);

  const handleShare = () => {
    setShareNotice(true);
    setTimeout(() => setShareNotice(false), 2000);
  };

  const handleBookmarkToggle = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleDocumentationCrossSell = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    router.push('/(tabs)/documentation' as any);
  };

  const handleLawyerCrossSell = () => {
    router.push('/(tabs)/talk-to-lawyer');
  };

  const handleRelatedArticlePress = (id: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    router.push(`/knowledge/${id}` as any);
  };

  return (
    <SafeScreenWrapper edges={['top', 'left', 'right']}>
      <AppHeader
        title="Knowledge Guide"
        showBack
        onBackPress={() => router.back()}
        rightElement={
          <View style={styles.headerActions}>
            <IconButton
              symbol={{
                ios: isBookmarked ? 'bookmark.fill' : 'bookmark',
                android: isBookmarked ? 'bookmark' : 'bookmark_border',
                web: isBookmarked ? 'bookmark' : 'bookmark_border',
              }}
              onPress={handleBookmarkToggle}
              accessibilityLabel="Bookmark article"
            />
            <IconButton
              symbol={{ ios: 'square.and.arrow.up', android: 'share', web: 'share' }}
              onPress={handleShare}
              accessibilityLabel="Share article"
            />
          </View>
        }
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {shareNotice && (
          <View style={styles.toast}>
            <Text style={styles.toastText}>Article link copied to clipboard (UI only)</Text>
          </View>
        )}

        <View style={styles.heroPlaceholder}>
          <SymbolView
            name={{ ios: 'doc.richtext.fill', android: 'article', web: 'article' }}
            size={48}
            tintColor={Colors.primary}
          />
          <Text style={styles.heroSub}>LegalX Verified Knowledge Guide</Text>
        </View>

        <View style={styles.metaRow}>
          <Badge label={article.category} variant="default" />
          <Text style={styles.readingTime}>{article.readingTime}</Text>
        </View>

        <Text style={styles.title}>{article.title}</Text>

        <View style={styles.authorRow}>
          <View style={styles.authorInfo}>
            <Text style={styles.authorName}>{article.author}</Text>
            <Text style={styles.publishedDate}>Published {article.publishedDate}</Text>
          </View>

          <View style={styles.actionButtonsRow}>
            <Pressable
              onPress={handleBookmarkToggle}
              style={({ pressed }) => [styles.actionChip, pressed && styles.pressed]}
            >
              <SymbolView
                name={
                  isBookmarked
                    ? { ios: 'bookmark.fill', android: 'bookmark', web: 'bookmark' }
                    : { ios: 'bookmark', android: 'bookmark_border', web: 'bookmark_border' }
                }
                size={16}
                tintColor={isBookmarked ? Colors.primary : Colors.textSecondary}
              />
              <Text style={[styles.actionChipText, isBookmarked && styles.activeChipText]}>
                {isBookmarked ? 'Saved' : 'Save'}
              </Text>
            </Pressable>

            <Pressable
              onPress={handleShare}
              style={({ pressed }) => [styles.actionChip, pressed && styles.pressed]}
            >
              <SymbolView
                name={{ ios: 'square.and.arrow.up', android: 'share', web: 'share' }}
                size={16}
                tintColor={Colors.textSecondary}
              />
              <Text style={styles.actionChipText}>Share</Text>
            </Pressable>
          </View>
        </View>

        <Divider />

        <View style={styles.bodyBlock}>
          <Text style={styles.bodyText}>{article.body}</Text>
        </View>

        {article.sources.length > 0 && (
          <View style={styles.sourcesBlock}>
            <Text style={styles.sourcesTitle}>Statutory & Legal Sources</Text>
            {article.sources.map((src, idx) => (
              <View key={`src-${idx}`} style={styles.sourceRow}>
                <SymbolView
                  name={{ ios: 'link', android: 'link', web: 'link' }}
                  size={14}
                  tintColor={Colors.primary}
                />
                <Text style={styles.sourceText}>{src}</Text>
              </View>
            ))}
          </View>
        )}

        <Divider />

        <View style={styles.crossSellCard}>
          <Text style={styles.crossSellHeading}>Need Legal Assistance With This Topic?</Text>
          <Text style={styles.crossSellSub}>
            Take immediate action through LegalX verified document services or consultation with an Advocate.
          </Text>

          <View style={styles.crossSellButtons}>
            <PrimaryButton
              label="Draft / Verify Document →"
              onPress={handleDocumentationCrossSell}
              testID="cross-sell-documentation"
            />
            <SecondaryButton
              label="Talk to Legal Expert →"
              onPress={handleLawyerCrossSell}
              testID="cross-sell-lawyer"
            />
          </View>
        </View>

        {relatedArticles.length > 0 && (
          <View style={styles.relatedBlock}>
            <Text style={styles.relatedHeading}>Related Legal Guides</Text>
            <View style={styles.relatedList}>
              {relatedArticles.map((rel) => (
                <ArticleCard
                  key={`rel-${rel.id}`}
                  article={rel}
                  onPress={() => handleRelatedArticlePress(rel.id)}
                />
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Layout.screenPaddingHWide,
    paddingVertical: Spacing.md,
    paddingBottom: Spacing.xxl + 20,
    gap: Spacing.lg,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  toast: {
    backgroundColor: Colors.ink,
    padding: Spacing.sm,
    borderRadius: Radii.button,
    alignItems: 'center',
  },
  toastText: {
    fontSize: FontSize.bodySmall,
    color: Colors.surfaceAlt,
    fontWeight: FontWeight.medium,
  },
  heroPlaceholder: {
    height: 160,
    backgroundColor: '#FEFCF5',
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radii.card,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    ...Shadows.card,
  },
  heroSub: {
    fontSize: FontSize.bodySmall,
    color: Colors.textSecondary,
    fontWeight: FontWeight.medium,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  readingTime: {
    fontSize: FontSize.bodySmall,
    color: Colors.textSecondary,
  },
  title: {
    ...Typography.h1,
    fontSize: 22,
    color: Colors.ink,
    lineHeight: 28,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  authorInfo: {
    gap: 2,
  },
  authorName: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.semibold,
    color: Colors.ink,
  },
  publishedDate: {
    fontSize: FontSize.bodySmall,
    color: Colors.textSecondary,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  actionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radii.pill,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
  },
  actionChipText: {
    fontSize: FontSize.bodySmall,
    fontWeight: FontWeight.medium,
    color: Colors.ink,
  },
  activeChipText: {
    color: Colors.primary,
    fontWeight: FontWeight.semibold,
  },
  pressed: {
    opacity: 0.8,
  },
  bodyBlock: {
    gap: Spacing.md,
  },
  bodyText: {
    ...Typography.body,
    fontSize: 16,
    color: Colors.ink,
    lineHeight: 26,
  },
  sourcesBlock: {
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radii.card,
    padding: Spacing.md,
    gap: Spacing.xs,
  },
  sourcesTitle: {
    fontSize: FontSize.label,
    fontWeight: FontWeight.semibold,
    color: Colors.ink,
    marginBottom: 2,
  },
  sourceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  sourceText: {
    fontSize: FontSize.bodySmall,
    color: Colors.textSecondary,
  },
  crossSellCard: {
    backgroundColor: '#FEFCF5',
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderRadius: Radii.card,
    padding: Spacing.lg,
    gap: Spacing.md,
    ...Shadows.card,
  },
  crossSellHeading: {
    ...Typography.h2,
    fontSize: 18,
    color: Colors.ink,
  },
  crossSellSub: {
    ...Typography.body,
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  crossSellButtons: {
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  relatedBlock: {
    gap: Spacing.md,
  },
  relatedHeading: {
    ...Typography.h2,
    fontSize: 18,
    color: Colors.ink,
  },
  relatedList: {
    gap: Spacing.md,
  },
});
