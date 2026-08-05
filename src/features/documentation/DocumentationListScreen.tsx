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
} from '@shared/components';
import { Colors, Layout, Spacing } from '@theme';

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
        placeholder="Search 8 predefined legal services..."
        onClear={() => setSearchQuery('')}
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryRow}
      >
        {CATEGORIES.map((cat) => (
          <Chip
            key={cat}
            label={cat === 'All' ? 'All Services' : cat}
            selected={selectedCategory === cat}
            onPress={() => setSelectedCategory(cat)}
          />
        ))}
      </ScrollView>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryRow}
      >
        <Chip
          label="Sort: Default"
          selected={sortOption === 'default'}
          onPress={() => setSortOption('default')}
        />
        <Chip
          label="A → Z"
          selected={sortOption === 'alphabetical'}
          onPress={() => setSortOption('alphabetical')}
        />
        <Chip
          label="Price: Low → High"
          selected={sortOption === 'price_low'}
          onPress={() => setSortOption('price_low')}
        />
        <Chip
          label="Price: High → Low"
          selected={sortOption === 'price_high'}
          onPress={() => setSortOption('price_high')}
        />
      </ScrollView>

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
  categoryRow: {
    gap: Spacing.xs,
    paddingRight: Spacing.md,
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
