/**
 * HomeScreen — SCR-01
 *
 * Spec: 06_Module_Home.md
 * Layout order (exact, per §2.1 — do not reorder):
 *   1. HomeHeader    — greeting + avatar + LX Coins
 *   2. SearchBar     — full-width, taps to search (SCR-02, stub in Phase 3)
 *   3. OurServicesRow — 3 entry cards
 *   4. PopularDocumentsRow — horizontal scroll, max 6
 *   5. PopularLawyersRow   — horizontal scroll, max 6, hidden if empty
 *
 * Phase 3 rules:
 * - Placeholder data only — no Supabase, no API calls.
 * - Navigation routing wired; destination screens are stubs.
 * - States: loading resolves immediately (placeholder), error state exists
 *   for structure correctness.
 * - Safe area: SafeScreenWrapper with edges=['top','left','right'].
 *   Tab bar handles bottom padding automatically via expo-router Tabs.
 */
import { useRouter } from 'expo-router';
import { StyleSheet, ScrollView, View } from 'react-native';

import { SearchBar, SafeScreenWrapper } from '@shared/components';
import { Layout, Spacing } from '@theme';

import { HomeHeader } from './components/HomeHeader';
import { OurServicesRow } from './components/OurServicesRow';
import { PopularDocumentsRow } from './components/PopularDocumentsRow';
import { PopularLawyersRow } from './components/PopularLawyersRow';
import {
  PLACEHOLDER_POPULAR_SERVICES,
  PLACEHOLDER_LAWYERS,
} from './home.placeholder';

export function HomeScreen() {
  const router = useRouter();

  // ─── Navigation handlers ──────────────────────────────────────────────────
  // Phase 3: all routes go to existing tab stubs or profile stack.
  // Phase 4+ will replace stub destinations with real screens.

  const handleAvatarPress = () => {
    // Profile is a stack pushed on top of tabs (02_IA §1, 24_BUILD §11)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    router.push('/profile' as any);
  };

  const handleCoinsPress = () => {
    // LX Coins balance view — view-only (12_Module_Profile §4)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    router.push('/profile/lx-coins' as any);
  };

  const handleSearchPress = () => {
    // SCR-02 not built in Phase 3 — routes to documentation tab as stub
    // Phase 4 will replace with router.push('/(tabs)/search') or similar
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
    // Route directly to Service Detail screen (SCR-04)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    router.push(`/(tabs)/documentation/${serviceId}` as any);
  };

  const handleLawyerPress = (lawyerId: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    router.push(`/lawyer/${lawyerId}` as any);
  };

  const handleFavouritePress = (_lawyerId: string) => {
    // Phase 5 will dispatch to auth-guarded favourite store
    // Phase 3: no-op — toggle handled locally in PopularLawyersRow
  };

  const handleDocumentsSeeAll = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    router.push('/(tabs)/documentation' as any);
  };

  const handleLawyersSeeAll = () => {
    router.push('/(tabs)/talk-to-lawyer');
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    // edges: top/left/right only — tab bar handles bottom safe area
    <SafeScreenWrapper edges={['top', 'left', 'right']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        // Bounce on Android is handled by overScrollMode
        overScrollMode="never"
      >
        {/* 1. Header — renders immediately, no skeleton (06_Module_Home §2.3) */}
        <HomeHeader
          firstName={null} // Phase 3: no auth — shows "Welcome back"
          lxCoinBalance={null} // Phase 3: no wallet data — shows "— LX"
          onAvatarPress={handleAvatarPress}
          onCoinsPress={handleCoinsPress}
        />

        {/* 2. Search bar */}
        <View style={styles.searchContainer}>
          <SearchBar
            value=""
            onChangeText={() => undefined} // Phase 3: read-only tap trigger
            placeholder="Search documents, lawyers, or topics"
            style={styles.searchBar}
            // Tapping the bar navigates to search (SCR-02 stub)
            testID="home-search-bar"
          />
          {/* Overlay Pressable to capture full-bar taps before keyboard opens */}
          <View
            style={styles.searchTapOverlay}
            // Use pointerEvents so the underlying TextInput still works
            pointerEvents="box-only"
            accessible
            accessibilityRole="button"
            accessibilityLabel="Search documents, lawyers, or topics"
            onTouchEnd={handleSearchPress}
          />
        </View>

        {/* 3. Our Services — 3 entry cards */}
        <OurServicesRow
          onDocumentationPress={handleDocumentationPress}
          onKnowledgeCentrePress={handleKnowledgeCentrePress}
          onTalkToLawyerPress={handleTalkToLawyerPress}
        />

        {/* Divider spacing between major sections */}
        <View style={styles.sectionGap} />

        {/* 4. Popular Documents */}
        <PopularDocumentsRow
          services={PLACEHOLDER_POPULAR_SERVICES}
          isLoading={false}
          onServicePress={handleServicePress}
          onSeeAllPress={handleDocumentsSeeAll}
        />

        <View style={styles.sectionGap} />

        {/* 5. Popular Lawyers — hidden if empty (06_Module_Home §2.3) */}
        <PopularLawyersRow
          lawyers={PLACEHOLDER_LAWYERS}
          isLoading={false}
          hasError={false}
          onLawyerPress={handleLawyerPress}
          onFavouritePress={handleFavouritePress}
          onSeeAllPress={handleLawyersSeeAll}
        />

        {/* Bottom breathing room */}
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
  },
  searchContainer: {
    paddingHorizontal: Layout.screenPaddingHWide,
    position: 'relative',
  },
  searchBar: {
    // Full-width within horizontal padding
  },
  // Transparent overlay captures the tap to navigate before keyboard fires
  searchTapOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'transparent',
  },
  sectionGap: {
    height: Spacing.xs,
  },
  bottomPadding: {
    height: Spacing.xxl,
  },
});
