import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View, type ListRenderItem } from 'react-native';

import {
  AppHeader,
  Chip,
  EmptyState,
  ErrorState,
  SafeScreenWrapper,
  SearchBar,
  SectionHeader,
  ServiceCard,
  SkeletonList,
  FilterModal,
} from '@shared/components';
import {
  useTabBarAutoHide,
  useTabBarInset,
} from '@shared/components/navigation/FloatingTabBar';
import { SymbolView } from 'expo-symbols';
import { Colors, Layout, Spacing, Typography, Radii } from '@theme';
import { TouchableOpacity, Text } from 'react-native';

import { getServices, type ServiceCard as ServiceCardData } from '@services/services.service';

type DocCategory = 'All' | 'TAX & REGISTRATION' | 'CONTRACTS' | 'PROPERTY' | 'PERSONAL';
type DocSort = 'default' | 'price_low' | 'price_high' | 'alphabetical';

const CATEGORIES: DocCategory[] = [
  'All',
  'TAX & REGISTRATION',
  'CONTRACTS',
  'PROPERTY',
  'PERSONAL',
];

/**
 * The three steps an application actually takes. Replaces the video and
 * verification cards, which promised features the backend does not have.
 */
function HowItWorksBanner() {
  const steps = ['Fill the form', 'Upload documents', 'We take over'];

  return (
    <View style={styles.banner}>
      {steps.map((label, i) => (
        <View key={label} style={styles.bannerStep}>
          <View style={styles.bannerNumber}>
            <Text style={styles.bannerNumberText}>{i + 1}</Text>
          </View>
          <Text style={styles.bannerLabel} numberOfLines={2}>
            {label}
          </Text>
          {i < steps.length - 1 && <View style={styles.bannerArrow} />}
        </View>
      ))}
    </View>
  );
}

export function DocumentationListScreen() {
  const { onScroll } = useTabBarAutoHide();
  const bottomInset = useTabBarInset();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<DocCategory>('All');
  const [sortOption, setSortOption] = useState<DocSort>('default');
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

  const [services, setServices] = useState<ServiceCardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const list = await getServices();
        if (!cancelled) {
          setServices(list);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) setError((err as Error).message);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
          setRefreshing(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [attempt]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setAttempt((n) => n + 1);
  }, []);

  const retry = useCallback(() => {
    setIsLoading(true);
    setError(null);
    setAttempt((n) => n + 1);
  }, []);

  const filteredServices = useMemo(() => {
    let list = services.filter((service) => {
      if (selectedCategory !== 'All') {
        if (service.tag.toUpperCase() !== selectedCategory) return false;
      }

      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = service.title.toLowerCase().includes(q);
        const matchesDesc = service.description.toLowerCase().includes(q);
        const matchesTag = service.tag.toLowerCase().includes(q);
        const matchesAct = service.legalAct.toLowerCase().includes(q);
        return matchesTitle || matchesDesc || matchesTag || matchesAct;
      }

      return true;
    });

    if (sortOption === 'alphabetical') {
      list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOption === 'price_low') {
      list = [...list].sort((a, b) => a.priceNumeric - b.priceNumeric);
    } else if (sortOption === 'price_high') {
      list = [...list].sort((a, b) => b.priceNumeric - a.priceNumeric);
    }

    return list;
  }, [services, searchQuery, selectedCategory, sortOption]);

  const handleServicePress = (serviceId: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    router.push(`/(tabs)/documentation/${serviceId}` as any);
  };

  const renderHeader = () => (
    <View style={styles.headerContent}>
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        onClear={() => setSearchQuery('')}
      />

      <View style={styles.filterRow}>
        <Text style={styles.resultCount}>
          <Text style={{ fontWeight: '600', color: Colors.ink }}>{filteredServices.length}</Text> services
        </Text>
        <TouchableOpacity style={styles.filterBtn} onPress={() => setIsFilterModalVisible(true)}>
          <SymbolView name={{ ios: 'line.3.horizontal.decrease', android: 'filter_list', web: 'filter_list' }} size={16} tintColor={Colors.textSecondary as any} />
          <Text style={styles.filterBtnText}>Filters</Text>
        </TouchableOpacity>
      </View>

      <HowItWorksBanner />

      <SectionHeader
        title={`All Legal Services (${filteredServices.length})`}
        style={styles.sectionHeader}
      />
    </View>
  );

  const renderItem: ListRenderItem<ServiceCardData> = ({ item }) => (
    <ServiceCard
      title={item.title}
      description={item.description}
      priceLine={item.priceLine}
      onPress={() => handleServicePress(item.slug)}
      style={styles.serviceCard}
    />
  );

  return (
    <SafeScreenWrapper edges={['top', 'left', 'right']}>
      <AppHeader title="Documentation" />
      {isLoading ? (
        <View style={styles.skeletonPadding}>
          <SkeletonList count={4} />
        </View>
      ) : error ? (
        <ErrorState
          title="Could not load services"
          description={error}
          onRetry={retry}
        />
      ) : (
        <FlatList
          data={filteredServices}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={[styles.listContent, { paddingBottom: bottomInset }]}
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
              title="No Services Found"
              description={`No document service matches "${searchQuery || selectedCategory}".`}
              symbol={{ ios: 'doc.viewfinder.fill', android: 'search', web: 'search' }}
              actionLabel="Reset Filters"
              onActionPress={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSortOption('default');
              }}
            />
          }
          showsVerticalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
        />
      )}

      <FilterModal
        visible={isFilterModalVisible}
        onClose={() => setIsFilterModalVisible(false)}
        sections={[
          {
            title: 'SORT BY',
            type: 'radio',
            selectedValue: sortOption,
            onSelect: (val) => setSortOption(val as DocSort),
            options: [
              { label: 'Default', value: 'default' },
              { label: 'Price: Low → High', value: 'price_low' },
            ],
          },
          {
            title: 'CATEGORY',
            type: 'radio',
            selectedValue: selectedCategory,
            onSelect: (val) => setSelectedCategory(val as DocCategory),
            options: CATEGORIES.map((cat) => ({ label: cat === 'All' ? 'All Services' : cat, value: cat })),
          },
        ]}
      />
    </SafeScreenWrapper>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceAlt,
    borderRadius: Radii.card,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    marginBottom: Spacing.md,
  },
  bannerStep: { flex: 1, alignItems: 'center', gap: 6 },
  bannerNumber: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerNumberText: { color: Colors.surfaceAlt, fontSize: 13, fontWeight: '700' },
  bannerLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 2,
  },
  bannerArrow: {
    position: 'absolute',
    right: -6,
    top: 12,
    width: 12,
    height: 1,
    backgroundColor: Colors.border,
  },
  listContent: {
    paddingHorizontal: Layout.screenPaddingHWide,
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
  sectionHeader: {
    paddingVertical: 0,
  },
  serviceCard: {
    width: '100%',
  },
  separator: {
    height: Spacing.md,
  },
});
