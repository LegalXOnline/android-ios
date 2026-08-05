import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors, FontSize, FontWeight, Radii, Shadows, Spacing, Typography } from '@theme';
import type { ArticlePayload } from '../knowledge.placeholder';

interface ArticleCardProps {
  article: ArticlePayload;
  onPress: () => void;
  onBookmarkToggle?: () => void;
}

export function ArticleCard({ article, onPress, onBookmarkToggle }: ArticleCardProps) {
  return (
    <View style={styles.card}>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`Article: ${article.title}`}
        style={({ pressed }) => [styles.cardBody, pressed && styles.pressed]}
      >
        <View style={styles.iconBox}>
          <SymbolView
            name={{ ios: 'newspaper.fill', android: 'newspaper', web: 'newspaper' }}
            size={24}
            tintColor={Colors.primary}
          />
        </View>

        <View style={styles.info}>
          <View style={styles.topRow}>
            <Text style={styles.category}>{article.category.toUpperCase()}</Text>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.readingTime}>{article.readingTime}</Text>
          </View>

          <Text style={styles.title} numberOfLines={2}>
            {article.title}
          </Text>

          <View style={styles.bottomRow}>
            <Text style={styles.author}>{article.author}</Text>
            <Text style={styles.date}>{article.publishedDate}</Text>
          </View>
        </View>
      </Pressable>

      {onBookmarkToggle && (
        <Pressable
          onPress={onBookmarkToggle}
          accessibilityRole="button"
          accessibilityLabel="Bookmark article"
          style={({ pressed }) => [styles.bookmarkBtn, pressed && styles.pressed]}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <SymbolView
            name={
              article.isBookmarked
                ? { ios: 'bookmark.fill', android: 'bookmark', web: 'bookmark' }
                : { ios: 'bookmark', android: 'bookmark_border', web: 'bookmark_border' }
            }
            size={18}
            tintColor={article.isBookmarked ? Colors.primary : Colors.textSecondary}
          />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radii.card,
    position: 'relative',
    overflow: 'hidden',
    ...Shadows.card,
  },
  cardBody: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: Spacing.md,
    gap: Spacing.md,
  },
  pressed: {
    opacity: 0.85,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: Radii.sm,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  info: {
    flex: 1,
    gap: Spacing.xs / 2,
    paddingRight: Spacing.lg,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  category: {
    fontSize: 10,
    fontWeight: FontWeight.semibold,
    color: Colors.primary,
    letterSpacing: 0.5,
  },
  dot: {
    fontSize: 10,
    color: Colors.textSecondary,
  },
  readingTime: {
    fontSize: FontSize.bodySmall,
    color: Colors.textSecondary,
  },
  title: {
    ...Typography.h2,
    fontSize: 15,
    color: Colors.ink,
    lineHeight: 20,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: 2,
  },
  author: {
    fontSize: FontSize.bodySmall,
    fontWeight: FontWeight.medium,
    color: Colors.textSecondary,
  },
  date: {
    fontSize: FontSize.bodySmall,
    color: Colors.textSecondary,
  },
  bookmarkBtn: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    zIndex: 2,
  },
});
