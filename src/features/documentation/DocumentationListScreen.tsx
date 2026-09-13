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
  ServiceCard,
  SkeletonList,
  FilterModal,
} from '@shared/components';
import { SymbolView } from 'expo-symbols';
import { Colors, Layout, Spacing, Typography, Radii } from '@theme';
import { TouchableOpacity, Text } from 'react-native';

import { FeaturedVideoCard } from './components/FeaturedVideoCard';
import { VerificationCard } from './components/VerificationCard';
import { DOCUMENT_SERVICES, type ServiceDetailPayload } from './documentation.placeholder';

type DocCategory = 'All' | 'TAX & REGISTRATION' | 'CONTRACTS' | 'PROPERTY' | 'PERSONAL';
type DocSort = 'default' | 'price_low' | 'price_high' | 'alphabetical';

const CATEGORIES: DocCategory[] = [
  'All',
  'TAX & REGISTRATION',
  'CONTRACTS',
  'PROPERTY',
  'PERSONAL',
];

export function DocumentationListScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<DocCategory>('All');
  const [sortOption, setSortOption] = useState<DocSort>('default');
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading] = useState(false);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const filteredServices = useMemo(() => {
    let list = DOCUMENT_SERVICES.filter((service) => {
      if (selectedCategory !== 'All') {
        if (service.tag.toUpperCase() !== selectedCategory) return false;
      }

      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = service.title.toLowerCase().includes(q);
        const matchesDesc = service.description.toLowerCase().includes(q);
        const matchesTag = service.tag.toLowerCase().includes(q);
        const matchesDetails = service.keyDetails.some((k) => k.toLowerCase().includes(q));
        const matchesBenefits = service.benefits.some((b) => b.toLowerCase().includes(q));
        return matchesTitle || matchesDesc || matchesTag || matchesDetails || matchesBenefits;
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
  }, [searchQuery, selectedCategory, sortOption]);

  const handleServicePress = (serviceId: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    router.push(`/(tabs)/documentation/${serviceId}` as any);
  };

  const handleVerificationPress = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    router.push('/verification' as any);
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

      <FeaturedVideoCard />
      <VerificationCard onPress={handleVerificationPress} />

      <SectionHeader
        title={`All Legal Services (${filteredServices.length})`}
        style={styles.sectionHeader}
      />
    </View>
  );

  const renderItem: ListRenderItem<ServiceDetailPayload> = ({ item }) => (
    <ServiceCard
      title={item.title}
      description={item.description}
      priceLine={item.priceLine}
      onPress={() => handleServicePress(item.id)}
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
      ) : (
        <FlatList
          data={filteredServices}
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
  listContent: {
    paddingHorizontal: Layout.screenPaddingHWide,
    paddingBottom: Spacing.xxl + 20,
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
