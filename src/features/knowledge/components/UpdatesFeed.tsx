import { useRouter, type Href } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, RefreshControl, StyleSheet, Text, View } from 'react-native';

import {
  listShortCategories,
  listShorts,
  searchShorts,
  shortCategoryLabel,
  shortCategoryTone,
  timeAgo,
  type CategoryCount,
  type LegalShort,
} from '@services/knowledge.service';
import { LXCard } from '@shared/components/lx';
import { LX, LXShape, LXType } from '@theme';

import { CategoryStrip } from './CategoryStrip';
import type { FeedScrollProps } from './types';
import { FeedState } from './FeedState';

interface UpdatesFeedProps extends FeedScrollProps {
  search: string;
  bottomInset: number;
}

export function UpdatesFeed({ search, bottomInset, onScroll, headerHeight }: UpdatesFeedProps) {
  const router = useRouter();

  const [categories, setCategories] = useState<CategoryCount[]>([]);
  const [category, setCategory] = useState('all');
  const [shorts, setShorts] = useState<LegalShort[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);

  const [busy, setBusy] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  const generation = useRef(0);

  const term = search.trim();
  const isSearching = term.length >= 1;

  useEffect(() => {
    listShortCategories()
      .then(setCategories)
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    const id = ++generation.current;
    let cancelled = false;

    const run = async () => {
      try {
        if (isSearching) {
          const found = await searchShorts(term);
          if (cancelled || id !== generation.current) return;
          setShorts(found);
          setHasMore(false);
          setCursor(null);
        } else {
          const res = await listShorts({ category });
          if (cancelled || id !== generation.current) return;
          setShorts(res.shorts);
          setHasMore(res.hasMore);
          setCursor(res.nextCursor);
        }
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
    if (!hasMore || !cursor || loadingMore || busy || isSearching) return;
    const id = generation.current;
    setLoadingMore(true);
    try {
      const res = await listShorts({ category, before: cursor });
      if (id !== generation.current) return;
      setShorts((prev) => [...prev, ...res.shorts]);
      setHasMore(res.hasMore);
      setCursor(res.nextCursor);
    } catch {
      // A failed page leaves the feed as it is; scrolling again retries.
    } finally {
      setLoadingMore(false);
    }
  };

  const strip = isSearching ? null : (
    <CategoryStrip
          categories={categories}
          selected={category}
          onSelect={pickCategory}
          label={shortCategoryLabel}
          tone={shortCategoryTone}
    />
  );

  return (
    <Animated.FlatList
        data={shorts}
        keyExtractor={(s) => s.id}
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
            emptyTitle="No updates yet"
            emptyBody="Nothing matches that. Try another word or category."
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
          const tone = shortCategoryTone(item.category);
          const actionable = item.relevance_tier === 'high';

          return (
            <LXCard
              style={styles.card}
              onPress={() => item.slug && router.push(`/updates/${item.slug}` as Href)}
            >
              <View style={styles.cardTop}>
                <View style={[styles.tag, { backgroundColor: tone.bg }]}>
                  <Text style={[styles.tagText, { color: tone.fg }]}>
                    {shortCategoryLabel(item.category)}
                  </Text>
                </View>

                {actionable && (
                  <View style={styles.actionTag}>
                    <SymbolView
                      name={{ ios: 'bolt.fill', android: 'bolt', web: 'bolt' }}
                      size={11}
                      tintColor={LX.goldText}
                    />
                    <Text style={styles.actionText}>ACT ON THIS</Text>
                  </View>
                )}

                <View style={styles.spacer} />
                <Text style={styles.age}>{timeAgo(item.published_at ?? item.created_at)}</Text>
              </View>

              <Text style={styles.title} numberOfLines={3}>
                {item.title}
              </Text>
              <Text style={styles.summary} numberOfLines={3}>
                {item.summary}
              </Text>

              {item.takeaway && (
                <View style={styles.takeaway}>
                  <Text style={styles.takeawayLabel}>WHAT IT MEANS FOR YOU</Text>
                  <Text style={styles.takeawayText} numberOfLines={3}>
                    {item.takeaway}
                  </Text>
                </View>
              )}

              {(item.source_name || item.deadline) && (
                <View style={styles.metaRow}>
                  {item.source_name && (
                    <Text style={styles.meta} numberOfLines={1}>
                      {item.source_name}
                    </Text>
                  )}
                  {item.deadline && <Text style={styles.deadline}>Deadline {item.deadline}</Text>}
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
  card: { padding: 16, gap: 9 },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  spacer: { flex: 1 },
  tag: { paddingHorizontal: 9, paddingVertical: 4, borderRadius: LXShape.xs },
  tagText: { ...LXType.overline, fontSize: 10 },
  actionTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: LXShape.xs,
    backgroundColor: LX.goldSoft,
  },
  actionText: { ...LXType.overline, fontSize: 9, color: LX.goldText },
  age: { ...LXType.bodySmall, fontSize: 11.5, color: LX.inkFaint },
  title: { ...LXType.titleSmall, fontSize: 16.5, lineHeight: 23, color: LX.ink },
  summary: { ...LXType.bodySmall, color: LX.inkMuted },
  takeaway: {
    backgroundColor: LX.goldSofter,
    borderRadius: LXShape.sm,
    padding: 12,
    gap: 4,
  },
  takeawayLabel: { ...LXType.overline, fontSize: 9.5, color: LX.goldText },
  takeawayText: { ...LXType.bodySmall, color: LX.ink },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  meta: { ...LXType.bodySmall, fontSize: 12, color: LX.inkFaint, flexShrink: 1 },
  deadline: { ...LXType.label, fontSize: 11.5, color: LX.danger },
  footer: { paddingVertical: 20 },
});
