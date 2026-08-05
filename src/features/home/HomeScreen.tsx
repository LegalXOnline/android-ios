import { useRouter } from 'expo-router';
import { useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

import { SafeScreenWrapper, SearchBar } from '@shared/components';
import { Colors, Layout, Spacing } from '@theme';

import { HomeHeader } from './components/HomeHeader';
import { OurServicesRow } from './components/OurServicesRow';
import { PopularDocumentsRow } from './components/PopularDocumentsRow';
import { PopularLawyersRow } from './components/PopularLawyersRow';
import {
  PLACEHOLDER_LAWYERS,
  PLACEHOLDER_POPULAR_SERVICES,
} from './home.placeholder';

export function HomeScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleAvatarPress = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    router.push('/profile' as any);
  };

  const handleCoinsPress = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    router.push('/profile/lx-coins' as any);
  };

  const handleSearchPress = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    router.push('/(tabs)/documentation' as any);
  };

  const handleDocumentationPress = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    router.push('/(tabs)/documentation' as any);
  };

  const handleKnowledgeCentrePress = () => {
    router.push('/(tabs)/knowledge-centre');
  };

  const handleTalkToLawyerPress = () => {
    router.push('/(tabs)/talk-to-lawyer');
  };

  const handleServicePress = (serviceId: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    router.push(`/(tabs)/documentation/${serviceId}` as any);
  };

  const handleLawyerPress = (lawyerId: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    router.push(`/lawyer/${lawyerId}` as any);
  };

  const handleFavouritePress = () => {};

  const handleDocumentsSeeAll = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    router.push('/(tabs)/documentation' as any);
  };

  const handleLawyersSeeAll = () => {
    router.push('/(tabs)/talk-to-lawyer');
  };

  return (
    <SafeScreenWrapper edges={['top', 'left', 'right']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
      >
        <HomeHeader
          firstName={null}
          lxCoinBalance={null}
          onAvatarPress={handleAvatarPress}
          onCoinsPress={handleCoinsPress}
        />

        <View style={styles.searchContainer}>
          <SearchBar
            value=""
            onChangeText={() => undefined}
            placeholder="Search documents, lawyers, or topics"
            style={styles.searchBar}
            testID="home-search-bar"
          />
          <View
            style={styles.searchTapOverlay}
            pointerEvents="box-only"
            accessible
            accessibilityRole="button"
            accessibilityLabel="Search documents, lawyers, or topics"
            onTouchEnd={handleSearchPress}
          />
        </View>

        <OurServicesRow
          onDocumentationPress={handleDocumentationPress}
          onKnowledgeCentrePress={handleKnowledgeCentrePress}
          onTalkToLawyerPress={handleTalkToLawyerPress}
        />

        <View style={styles.sectionGap} />

        <PopularDocumentsRow
          services={PLACEHOLDER_POPULAR_SERVICES}
          isLoading={false}
          onServicePress={handleServicePress}
          onSeeAllPress={handleDocumentsSeeAll}
        />

        <View style={styles.sectionGap} />

        <PopularLawyersRow
          lawyers={PLACEHOLDER_LAWYERS}
          isLoading={false}
          hasError={false}
          onLawyerPress={handleLawyerPress}
          onFavouritePress={handleFavouritePress}
          onSeeAllPress={handleLawyersSeeAll}
        />

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  scrollContent: {
    gap: Spacing.lg,
    paddingTop: Spacing.sm,
  },
  searchContainer: {
    paddingHorizontal: Layout.screenPaddingHWide,
    position: 'relative',
  },
  searchBar: {},
  searchTapOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'transparent',
  },
  sectionGap: {
    height: Spacing.sm,
  },
  bottomPadding: {
    height: Spacing.xxl,
  },
});
