import { useRouter, type Href } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, RefreshControl, StyleSheet, Text, View } from 'react-native';

import {
  categoryLabel,
  categoryTone,
  listCards,
  listCategories,
  searchCards,
  type CategoryCount,
  type KnowledgeCard,
} from '@services/knowledge.service';
import { LXCard } from '@shared/components/lx';
import { LX, LXShape, LXType } from '@theme';

import { CategoryStrip } from './CategoryStrip';
import type { FeedScrollProps } from './types';
import { FeedState } from './FeedState';

export function RightsFeed({ search, bottomInset, onScroll, headerHeight }: FeedScrollProps & { search: string; bottomInset: number }) {
  const router = useRouter();

  const [categories, setCategories] = useState<CategoryCount[]>([]);
  const [category, setCategory] = useState('all');
  const [cards, setCards] = useState<KnowledgeCard[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const [busy, setBusy] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  const generation = useRef(0);

  const term = search.trim();
  // The rights search endpoint requires at least two characters.
  const isSearching = term.length >= 2;

  useEffect(() => {
    listCategories()
      .then(setCategories)
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    const id = ++generation.current;
    let cancelled = false;

    const run = async () => {
      try {
        if (isSearching) {
          const found = await searchCards(term);
          if (cancelled || id !== generation.current) return;
          setCards(found);
          setHasMore(false);
        } else {
          const res = await listCards({ category, page: 1 });
          if (cancelled || id !== generation.current) return;
          setCards(res.cards);
          setHasMore(res.hasMore);
        }
        setPage(1);
        setError(null);
      } catch (err) {
        if (!cancelled && id === generation.current) setError((err as Error).message);
      } finally {
        if (!cancelled && id === generation.current) {
          setBusy(false);
          setRefreshing(false);
        }
      }
    };

    const timer = setTimeout(run, isSearching ? 350 : 0);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [category, term, isSearching, attempt]);

  const pickCategory = (next: string) => {
    if (next === category) return;
    setCategory(next);
    setBusy(true);
  };

  const reload = () => {
    setBusy(true);
    setError(null);
    setAttempt((n) => n + 1);
  };

  const onRefresh = () => {
    setRefreshing(true);
    setAttempt((n) => n + 1);
  };

  const loadMore = async () => {
    if (!hasMore || loadingMore || busy || isSearching) return;
    const id = generation.current;
    setLoadingMore(true);
    try {
      const res = await listCards({ category, page: page + 1 });
      if (id !== generation.current) return;
      setCards((prev) => [...prev, ...res.cards]);
      setHasMore(res.hasMore);
      setPage(res.page);
    } catch {
      // A failed page leaves the list as it is; scrolling again retries.
    } finally {
      setLoadingMore(false);
    }
  };

  const strip = isSearching ? null : (
    <CategoryStrip
          categories={categories}
          selected={category}
          onSelect={pickCategory}
          label={categoryLabel}
          tone={categoryTone}
    />
  );

  return (
    <Animated.FlatList
        data={cards}
        keyExtractor={(c) => c.id}
      contentContainerStyle={[styles.list, { paddingTop: headerHeight + 8, paddingBottom: bottomInset }]}
      onScroll={onScroll}
      scrollEventThrottle={16}
      ListHeaderComponent={strip}
        showsVerticalScrollIndicator={false}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={LX.goldText} />
        }
        ListEmptyComponent={
          <FeedState
            busy={busy}
            error={error}
            emptyTitle="Nothing matches that"
            emptyBody="Try a different word, or pick another category."
            onRetry={reload}
          />
        }
        ListFooterComponent={
          loadingMore ? (
            <View style={styles.footer}>
              <ActivityIndicator color={LX.gold} />
            </View>
          ) : null
        }
        renderItem={({ item }) => {
          const tone = categoryTone(item.category);
          return (
            <LXCard style={styles.card} onPress={() => router.push(`/knowledge/${item.slug}` as Href)}>
              <View style={styles.cardTop}>
                <View style={[styles.tag, { backgroundColor: tone.bg }]}>
                  <Text style={[styles.tagText, { color: tone.fg }]}>
                    {categoryLabel(item.category)}
                  </Text>
                </View>
                <SymbolView
                  name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
                  size={16}
                  tintColor={LX.inkFaint}
                />
              </View>

              <Text style={styles.title} numberOfLines={3}>
                {item.title}
              </Text>
              <Text style={styles.answer} numberOfLines={3}>
                {item.direct_answer}
              </Text>

              {item.case_reference && (
                <View style={styles.refRow}>
                  <SymbolView
                    name={{ ios: 'text.book.closed', android: 'gavel', web: 'gavel' }}
                    size={13}
                    tintColor={LX.goldText}
                  />
                  <Text style={styles.ref} numberOfLines={1}>
                    {item.case_reference}
                  </Text>
                </View>
              )}
            </LXCard>
          );
        }}
    />
  );
}

const styles = StyleSheet.create({
  list: { paddingHorizontal: 18, paddingTop: 16, gap: 11 },
  card: { padding: 16, gap: 8 },
  cardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  tag: { paddingHorizontal: 9, paddingVertical: 4, borderRadius: LXShape.xs },
  tagText: { ...LXType.overline, fontSize: 10 },
  title: { ...LXType.titleSmall, fontSize: 16.5, lineHeight: 23, color: LX.ink },
  answer: { ...LXType.bodySmall, color: LX.inkMuted },
  refRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 },
  ref: { ...LXType.bodySmall, fontSize: 12, color: LX.goldText, flex: 1 },
  footer: { paddingVertical: 20 },
});
