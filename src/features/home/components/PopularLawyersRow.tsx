/**
 * PopularLawyersRow — Horizontal scroll of LawyerCards.
 *
 * Spec (06_Module_Home.md §2.1 item 5):
 * - Max 6 items shown, horizontal scroll.
 * - SectionHeader with "See all" → SCR-07 (Lawyer Listing).
 * - Each card tap → SCR-09 (Lawyer Profile Detail) directly.
 *   In Phase 3: routes to Talk to Lawyer tab (SCR-09 not built yet).
 * - If empty: row HIDDEN entirely (not an empty-state message).
 *   (06_Module_Home §2.3: "Popular Lawyers row hidden entirely rather than
 *   showing an empty state — this is a discovery row, not a required one.")
 *
 * States:
 * - Loading: skeleton placeholder cards
 * - Error: row-level inline retry
 * - Empty: row not rendered (hidden entirely per spec)
 */
import { useState } from 'react';
import {
  FlatList,
  StyleSheet,
  View,
  type ListRenderItem,
} from 'react-native';

import { ErrorState, LawyerCard, SectionHeader, type LawyerCardData } from '@shared/components';
import { Layout, Spacing } from '@theme';

import { LawyerSkeletonCard } from './skeletons/LawyerSkeletonCard';

interface PopularLawyersRowProps {
  lawyers: LawyerCardData[];
  isLoading?: boolean;
  hasError?: boolean;
  onLawyerPress: (lawyerId: string) => void;
  onFavouritePress: (lawyerId: string) => void;
  onSeeAllPress: () => void;
}

const CARD_WIDTH = 300;
const SKELETON_ITEMS = [1, 2] as const;

export function PopularLawyersRow({
  lawyers,
  isLoading = false,
  hasError = false,
  onLawyerPress,
  onFavouritePress,
  onSeeAllPress,
}: PopularLawyersRowProps) {
  // Local favourite state — Phase 3 only, not persisted
  const [favourited, setFavourited] = useState<Set<string>>(new Set());

  const handleFavourite = (lawyerId: string) => {
    setFavourited((prev) => {
      const next = new Set(prev);
      if (next.has(lawyerId)) next.delete(lawyerId);
      else next.add(lawyerId);
      return next;
    });
    onFavouritePress(lawyerId);
  };

  const renderItem: ListRenderItem<LawyerCardData> = ({ item }) => (
    <LawyerCard
      lawyer={item}
      onPress={() => onLawyerPress(item.id)}
      onFavouritePress={() => handleFavourite(item.id)}
      isFavourited={favourited.has(item.id)}
      style={styles.card}
    />
  );

  // Hidden entirely when empty (per 06_Module_Home §2.3)
  if (!isLoading && !hasError && lawyers.length === 0) {
    return null;
  }

  return (
    <View style={styles.section}>
      <SectionHeader
        title="Popular Lawyers"
        actionLabel="See all"
        onActionPress={onSeeAllPress}
        style={styles.sectionHeader}
      />

      {isLoading ? (
        <View style={styles.skeletonRow}>
          {SKELETON_ITEMS.map((key) => (
            <LawyerSkeletonCard key={key} />
          ))}
        </View>
      ) : hasError ? (
        // Row-level error — doesn't block the whole screen
        <ErrorState
          title="Couldn't load lawyers"
          description="Please try again."
          style={styles.rowError}
        />
      ) : (
        <FlatList
          data={lawyers}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          removeClippedSubviews
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: Spacing.sm,
  },
  sectionHeader: {
    paddingHorizontal: Layout.screenPaddingHWide,
  },
  card: {
    width: CARD_WIDTH,
  },
  listContent: {
    paddingHorizontal: Layout.screenPaddingHWide,
    paddingBottom: Spacing.xs,
  },
  separator: {
    width: Spacing.md,
  },
  skeletonRow: {
    flexDirection: 'row',
    paddingHorizontal: Layout.screenPaddingHWide,
    gap: Spacing.md,
  },
  rowError: {
    flex: 0,
    paddingVertical: Spacing.xl,
    minHeight: 0,
  },
});
