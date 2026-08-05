/**
 * DocumentationListScreen — SCR-03
 *
 * Spec: 07_Module_Documentation.md §2
 * Displays:
 *   - App Header
 *   - Search Bar (UI filter for the 8 services)
 *   - Featured / Information Video section
 *   - Section Header
 *   - Grid/List of 8 predefined legal services (ServiceCard)
 *   - Navigation to Service Detail (SCR-04)
 */
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, StyleSheet, View, type ListRenderItem } from 'react-native';

import {
  AppHeader,
  SafeScreenWrapper,
  SearchBar,
  SectionHeader,
  ServiceCard,
} from '@shared/components';
import { Layout, Spacing } from '@theme';

import { DOCUMENT_SERVICES, type ServiceDetailPayload } from './documentation.placeholder';
import { FeaturedVideoCard } from './components/FeaturedVideoCard';

export function DocumentationListScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter services by search query
  const filteredServices = DOCUMENT_SERVICES.filter(
    (service) =>
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.tag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleServicePress = (serviceId: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    router.push(`/(tabs)/documentation/${serviceId}` as any);
  };

  const renderHeader = () => (
    <View style={styles.headerContent}>
      {/* Search bar UI */}
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search 8 predefined legal services..."
        onClear={() => setSearchQuery('')}
      />

      {/* Featured Video Card */}
      <FeaturedVideoCard />

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
      <FlatList
        data={filteredServices}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        showsVerticalScrollIndicator={false}
      />
    </SafeScreenWrapper>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: Layout.screenPaddingHWide,
    paddingBottom: Spacing.xxl,
  },
  headerContent: {
    gap: Spacing.lg,
    paddingVertical: Spacing.md,
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
