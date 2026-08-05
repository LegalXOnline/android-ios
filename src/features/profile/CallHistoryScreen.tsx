import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import {
  AppHeader,
  Badge,
  EmptyState,
  SafeScreenWrapper,
} from '@shared/components';
import { Colors, FontSize, FontWeight, Layout, Radii, Shadows, Spacing, Typography } from '@theme';

import { PLACEHOLDER_CONSULTATIONS, type ConsultationHistoryPayload } from './profile.placeholder';

export function CallHistoryScreen() {
  const router = useRouter();
  const [consultations] = useState<ConsultationHistoryPayload[]>(PLACEHOLDER_CONSULTATIONS);

  const renderItem = ({ item }: { item: ConsultationHistoryPayload }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.iconBox}>
          <SymbolView
            name={
              item.mode === 'Video'
                ? { ios: 'video.fill', android: 'videocam', web: 'videocam' }
                : { ios: 'phone.fill', android: 'call', web: 'call' }
            }
            size={22}
            tintColor={Colors.primary}
          />
        </View>

        <View style={styles.headerInfo}>
          <Text style={styles.lawyerName}>{item.lawyerName}</Text>
          <Text style={styles.lawyerTitle}>{item.lawyerTitle}</Text>
          <Text style={styles.dateText}>
            {item.date} • {item.duration} ({item.mode})
          </Text>
        </View>

        <Badge label="Completed" variant="success" />
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.feeLabel}>Paid Fee</Text>
        <Text style={styles.amountText}>₹{item.amount}</Text>
      </View>
    </View>
  );

  return (
    <SafeScreenWrapper edges={['top', 'left', 'right']}>
      <AppHeader title="My Consultations" showBack onBackPress={() => router.back()} />

      <FlatList
        data={consultations}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <EmptyState
            title="No Consultations Yet"
            description="You haven't scheduled or completed any advocate consultations yet."
            actionLabel="Find an Advocate"
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
  card: {
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radii.card,
    padding: Spacing.md,
    gap: Spacing.md,
    ...Shadows.card,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: Radii.sm,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerInfo: {
    flex: 1,
    gap: 2,
  },
  lawyerName: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.semibold,
    color: Colors.ink,
  },
  lawyerTitle: {
    fontSize: FontSize.bodySmall,
    color: Colors.primary,
    fontWeight: FontWeight.medium,
  },
  dateText: {
    fontSize: FontSize.bodySmall,
    color: Colors.textSecondary,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  feeLabel: {
    fontSize: FontSize.bodySmall,
    color: Colors.textSecondary,
  },
  amountText: {
    ...Typography.price,
    fontSize: 18,
    color: Colors.ink,
  },
  separator: {
    height: Spacing.md,
  },
});
