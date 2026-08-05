import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import {
  AppHeader,
  Badge,
  Chip,
  EmptyState,
  SafeScreenWrapper,
  type BadgeVariant,
} from '@shared/components';
import { Colors, FontSize, FontWeight, Layout, Radii, Shadows, Spacing, Typography } from '@theme';

import { PLACEHOLDER_ORDERS, type OrderPayload } from './profile.placeholder';

type FilterStatus = 'All' | 'Completed' | 'Pending' | 'Cancelled' | 'Refunded';

export function OrdersScreen() {
  const router = useRouter();
  const [orders] = useState<OrderPayload[]>(PLACEHOLDER_ORDERS);
  const [selectedFilter, setSelectedFilter] = useState<FilterStatus>('All');
  const [downloadNotice, setDownloadNotice] = useState('');

  const filteredOrders = orders.filter((o) => {
    if (selectedFilter === 'All') return true;
    return o.status.toLowerCase() === selectedFilter.toLowerCase();
  });

  const getBadgeVariant = (status: string): BadgeVariant => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
      case 'refunded':
        return 'danger';
      default:
        return 'default';
    }
  };

  const handleDownloadReceipt = (orderId: string) => {
    setDownloadNotice(`Receipt #${orderId} downloaded to device (UI placeholder)`);
    setTimeout(() => setDownloadNotice(''), 2500);
  };

  const renderItem = ({ item }: { item: OrderPayload }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.iconBox}>
          <SymbolView
            name={{ ios: 'doc.plaintext.fill', android: 'receipt', web: 'receipt' }}
            size={22}
            tintColor={Colors.primary}
          />
        </View>

        <View style={styles.headerInfo}>
          <Text style={styles.serviceTitle}>{item.serviceTitle}</Text>
          <Text style={styles.orderDate}>Ordered on {item.date}</Text>
        </View>

        <Badge label={item.status} variant={getBadgeVariant(item.status)} />
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.amountText}>₹{item.amount}</Text>

        <Pressable
          onPress={() => handleDownloadReceipt(item.id)}
          style={({ pressed }) => [styles.downloadBtn, pressed && styles.pressed]}
        >
          <SymbolView
            name={{ ios: 'arrow.down.doc.fill', android: 'file_download', web: 'file_download' }}
            size={16}
            tintColor={Colors.primary}
          />
          <Text style={styles.downloadText}>Download PDF</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <SafeScreenWrapper edges={['top', 'left', 'right']}>
      <AppHeader title="My Orders" showBack onBackPress={() => router.back()} />

      {downloadNotice ? (
        <View style={styles.toast}>
          <Text style={styles.toastText}>{downloadNotice}</Text>
        </View>
      ) : null}

      <View style={styles.filterBar}>
        {(['All', 'Completed', 'Pending', 'Cancelled', 'Refunded'] as const).map((filter) => (
          <Chip
            key={filter}
            label={filter}
            selected={selectedFilter === filter}
            onPress={() => setSelectedFilter(filter)}
          />
        ))}
      </View>

      <FlatList
        data={filteredOrders}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <EmptyState
            title="No Orders Found"
            description="No document or consultation orders match your selected filter."
            actionLabel="Explore Services"
            onActionPress={() => router.push('/(tabs)/documentation' as any)}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeScreenWrapper>
  );
}

const styles = StyleSheet.create({
  filterBar: {
    flexDirection: 'row',
    paddingHorizontal: Layout.screenPaddingHWide,
    paddingVertical: Spacing.sm,
    gap: Spacing.xs,
    flexWrap: 'wrap',
  },
  listContent: {
    paddingHorizontal: Layout.screenPaddingHWide,
    paddingVertical: Spacing.md,
    paddingBottom: Spacing.xxl + 20,
  },
  toast: {
    backgroundColor: Colors.ink,
    marginHorizontal: Layout.screenPaddingHWide,
    marginTop: Spacing.sm,
    padding: Spacing.sm,
    borderRadius: Radii.button,
    alignItems: 'center',
  },
  toastText: {
    fontSize: FontSize.bodySmall,
    color: Colors.surfaceAlt,
    fontWeight: FontWeight.medium,
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
  serviceTitle: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.semibold,
    color: Colors.ink,
  },
  orderDate: {
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
  amountText: {
    ...Typography.price,
    fontSize: 18,
    color: Colors.ink,
  },
  downloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: Spacing.xs,
  },
  downloadText: {
    fontSize: FontSize.bodySmall,
    fontWeight: FontWeight.semibold,
    color: Colors.primary,
  },
  pressed: {
    opacity: 0.7,
  },
  separator: {
    height: Spacing.md,
  },
});
