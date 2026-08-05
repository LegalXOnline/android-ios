import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import {
  AppHeader,
  EmptyState,
  LawyerCard,
  SafeScreenWrapper,
  type LawyerCardData,
} from '@shared/components';
import { Layout, Spacing } from '@theme';

import { PLACEHOLDER_LAWYERS_FULL, type LawyerDetailPayload } from '../lawyer/lawyer.placeholder';

export function SavedLawyersScreen() {
  const router = useRouter();
  const [favouriteLawyers, setFavouriteLawyers] = useState<LawyerDetailPayload[]>(
    PLACEHOLDER_LAWYERS_FULL.slice(0, 3)
  );

  const handleLawyerPress = useCallback(
    (lawyerId: string) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      router.push(`/lawyer/${lawyerId}` as any);
    },
    [router]
  );

  const handleRemoveFavourite = useCallback((lawyerId: string) => {
    setFavouriteLawyers((prev) => prev.filter((l) => l.id !== lawyerId));
  }, []);

  const renderItem = ({ item }: { item: LawyerDetailPayload }) => (
    <LawyerCard
      lawyer={item as LawyerCardData}
      onPress={() => handleLawyerPress(item.id)}
      onFavouritePress={() => handleRemoveFavourite(item.id)}
      isFavourited
    />
  );

  return (
    <SafeScreenWrapper edges={['top', 'left', 'right']}>
      <AppHeader title="Saved Lawyers" showBack onBackPress={() => router.back()} />

      <FlatList
        data={favouriteLawyers}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <EmptyState
            title="No Saved Lawyers"
            description="You haven't favorited any advocates yet. Tap the heart icon on any advocate profile to save them here."
            actionLabel="Browse Advocates"
            onActionPress={() => router.push('/(tabs)/talk-to-lawyer' as any)}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeScreenWrapper>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: Layout.screenPaddingHWide,
    paddingVertical: Spacing.md,
    paddingBottom: Spacing.xxl + 20,
  },
  separator: {
    height: Spacing.md,
  },
});
