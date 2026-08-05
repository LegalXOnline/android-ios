/**
 * PopularDocumentsRow — Horizontal scroll of ServiceCards.
 *
 * Spec (06_Module_Home.md §2.1 item 4):
 * - Max 6 items shown, horizontal scroll.
 * - SectionHeader with "See all" → SCR-03 (Documentation list).
 * - Each card tap → SCR-04 (Service Detail) directly, skipping the list.
 *   In Phase 3: routes to Documentation tab (SCR-04 not built yet).
 *
 * States (04_Design_System §6, 06_Module_Home §2.3):
 * - Loading: skeleton placeholder cards
 * - Error: row-level inline retry (doesn't block the whole screen)
 * - Empty: N/A — services list is fixed (8 services, never empty)
 */
import {
  FlatList,
  StyleSheet,
  View,
  type ListRenderItem,
} from 'react-native';

import { SectionHeader, ServiceCard } from '@shared/components';
import { Layout, Spacing } from '@theme';

import type { HomePlaceholderService } from '../home.placeholder';
import { DocumentSkeletonCard } from './skeletons/DocumentSkeletonCard';

interface PopularDocumentsRowProps {
  services: HomePlaceholderService[];
  isLoading?: boolean;
  onServicePress: (serviceId: string) => void;
  onSeeAllPress: () => void;
}

const CARD_WIDTH = 200;
const SKELETON_ITEMS = [1, 2, 3] as const;

export function PopularDocumentsRow({
  services,
  isLoading = false,
  onServicePress,
  onSeeAllPress,
}: PopularDocumentsRowProps) {
  const renderItem: ListRenderItem<HomePlaceholderService> = ({ item }) => (
    <ServiceCard
      title={item.title}
      description={item.description}
      priceLine={item.priceLine}
      onPress={() => onServicePress(item.id)}
      style={styles.card}
    />
  );

  return (
    <View style={styles.section}>
      <SectionHeader
        title="Popular Documents"
        actionLabel="See all"
        onActionPress={onSeeAllPress}
        style={styles.sectionHeader}
      />

      {isLoading ? (
        // Skeleton row — doesn't block the screen (06_Module_Home §2.3)
        <View style={styles.skeletonRow}>
          {SKELETON_ITEMS.map((key) => (
            <DocumentSkeletonCard key={key} />
          ))}
        </View>
      ) : (
        <FlatList
          data={services}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          // Memoized renderItem key prevents re-renders
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
});
