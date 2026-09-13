import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Badge } from '@shared/components';
import { Colors, FontSize, FontWeight, Radii, Shadows, Spacing, Typography } from '@theme';
import type { ArticlePayload } from '../knowledge.placeholder';

interface FeaturedArticleCardProps {
  article: ArticlePayload;
  onPress: () => void;
}

export function FeaturedArticleCard({ article, onPress }: FeaturedArticleCardProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Featured article: ${article.title}`}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.heroPlaceholder}>
        <SymbolView
          name={{ ios: 'doc.richtext.fill', android: 'article', web: 'article' }}
          size={36}
          tintColor={Colors.primary}
        />
        <View style={styles.featuredBadge}>
          <Text style={styles.featuredText}>FEATURED ARTICLE</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.metaRow}>
          <Badge label={article.category} variant="default" />
          <Text style={styles.readingTime}>{article.readingTime}</Text>
        </View>

        <Text style={styles.title} numberOfLines={2}>
          {article.title}
        </Text>

        <Text style={styles.teaser} numberOfLines={2}>
          {article.teaser}
        </Text>

        <View style={styles.footerRow}>
          <Text style={styles.author}>{article.author}</Text>
          <Text style={styles.date}>{article.publishedDate}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radii.card,
    overflow: 'hidden',
    ...Shadows.card,
  },
  pressed: {
    opacity: 0.88,
  },
  heroPlaceholder: {
    height: 130,
    backgroundColor: '#FEFCF5',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  featuredBadge: {
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xs + 2,
    paddingVertical: 3,
    borderRadius: Radii.sm,
  },
  featuredText: {
    fontSize: 10,
    fontWeight: FontWeight.semibold,
    color: Colors.surfaceAlt,
    letterSpacing: 0.5,
  },
  content: {
    padding: Spacing.lg,
    gap: Spacing.sm,
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
    ...Typography.h2,
    fontSize: 19,
    color: Colors.ink,
    lineHeight: 24,
  },
  teaser: {
    ...Typography.body,
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.xs,
  },
  author: {
    fontSize: FontSize.bodySmall,
    fontWeight: FontWeight.semibold,
    color: Colors.ink,
  },
  date: {
    fontSize: FontSize.bodySmall,
    color: Colors.textSecondary,
  },
});
