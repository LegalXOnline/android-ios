import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { FlatList, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import {
  AppHeader,
  Badge,
  Chip,
  EmptyState,
  PrimaryButton,
  SafeScreenWrapper,
  SecondaryButton,
  type BadgeVariant,
} from '@shared/components';
import { Colors, FontSize, FontWeight, Layout, Radii, Shadows, Spacing, Typography } from '@theme';

import { PLACEHOLDER_ORDERS, type OrderPayload, type OrderStatus } from './profile.placeholder';

export function OrdersScreen() {
  const router = useRouter();
  const [orders] = useState<OrderPayload[]>(PLACEHOLDER_ORDERS);
  const [selectedFilter, setSelectedFilter] = useState<'All' | OrderStatus>('All');
  const [selectedOrder, setSelectedOrder] = useState<OrderPayload | null>(null);
  const [toastNotice, setToastNotice] = useState('');

  const filteredOrders = orders.filter((o) => {
    if (selectedFilter === 'All') return true;
    return o.status.toLowerCase() === selectedFilter.toLowerCase();
  });

  const getBadgeVariant = (status: OrderStatus): BadgeVariant => {
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

  const handleDownloadInvoice = (orderId: string) => {
    setToastNotice(`Official Invoice #${orderId}.pdf downloaded to device.`);
    setTimeout(() => setToastNotice(''), 3000);
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
          <View style={styles.idRow}>
            <Text style={styles.orderId}>{item.id}</Text>
            <Text style={styles.orderType}>• {item.orderType}</Text>
          </View>
          <Text style={styles.serviceTitle}>{item.serviceTitle}</Text>
          <Text style={styles.orderDate}>Ordered on {item.date}</Text>
        </View>

        <Badge label={item.status} variant={getBadgeVariant(item.status)} />
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.amountText}>₹{item.amount}</Text>

        <SecondaryButton
          label="View Details"
          onPress={() => setSelectedOrder(item)}
          style={styles.detailsBtn}
          testID={`view-order-${item.id}`}
        />
      </View>
    </View>
  );

  return (
    <SafeScreenWrapper edges={['top', 'left', 'right']}>
      <AppHeader title="My Orders" showBack onBackPress={() => router.back()} />

      {toastNotice ? (
        <View style={styles.toast}>
          <Text style={styles.toastText}>{toastNotice}</Text>
        </View>
      ) : null}

      <View style={styles.filterBar}>
        {(['All', 'Pending', 'Completed', 'Cancelled', 'Refunded'] as const).map((filter) => (
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

      <Modal
        visible={Boolean(selectedOrder)}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedOrder(null)}
      >
        {selectedOrder && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <View>
                  <Text style={styles.modalTitle}>Order Details</Text>
                  <Text style={styles.modalSub}>{selectedOrder.id}</Text>
                </View>
                <Pressable onPress={() => setSelectedOrder(null)} style={styles.closeBtn}>
                  <SymbolView
                    name={{ ios: 'xmark.circle.fill', android: 'cancel', web: 'cancel' }}
                    size={24}
                    tintColor={Colors.textSecondary}
                  />
                </Pressable>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.modalScroll}>
                <View style={styles.timelineBlock}>
                  <Text style={styles.sectionLabel}>Fulfillment Timeline</Text>
                  <View style={styles.timelineRow}>
                    <View style={[styles.timelineNode, styles.nodeActive]}>
                      <Text style={styles.nodeText}>Placed</Text>
                    </View>
                    <View style={[styles.timelineLine, styles.lineActive]} />
                    <View style={[styles.timelineNode, styles.nodeActive]}>
                      <Text style={styles.nodeText}>In Progress</Text>
                    </View>
                    <View style={[styles.timelineLine, selectedOrder.status === 'Completed' && styles.lineActive]} />
                    <View
                      style={[
                        styles.timelineNode,
                        selectedOrder.status === 'Completed' ? styles.nodeActive : styles.nodePending,
                      ]}
                    >
                      <Text style={styles.nodeText}>Completed</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.detailBlock}>
                  <Text style={styles.sectionLabel}>Service Summary</Text>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoKey}>Service Name</Text>
                    <Text style={styles.infoVal}>{selectedOrder.serviceTitle}</Text>
                  </View>
                  {selectedOrder.planName && (
                    <View style={styles.infoRow}>
                      <Text style={styles.infoKey}>Package / Plan</Text>
                      <Text style={styles.infoVal}>{selectedOrder.planName}</Text>
                    </View>
                  )}
                  {selectedOrder.lawyerName && (
                    <View style={styles.infoRow}>
                      <Text style={styles.infoKey}>Assigned Advocate</Text>
                      <Text style={styles.infoVal}>{selectedOrder.lawyerName}</Text>
                    </View>
                  )}
                  {selectedOrder.uploadedFileName && (
                    <View style={styles.infoRow}>
                      <Text style={styles.infoKey}>Attached File</Text>
                      <Text style={styles.infoVal}>{selectedOrder.uploadedFileName}</Text>
                    </View>
                  )}
                  <View style={styles.infoRow}>
                    <Text style={styles.infoKey}>Order Status</Text>
                    <Badge label={selectedOrder.status} variant={getBadgeVariant(selectedOrder.status)} />
                  </View>
                </View>

                <View style={styles.detailBlock}>
                  <Text style={styles.sectionLabel}>Payment Summary</Text>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoKey}>Subtotal</Text>
                    <Text style={styles.infoVal}>₹{selectedOrder.subtotal || selectedOrder.amount}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoKey}>Taxes (18% GST)</Text>
                    <Text style={styles.infoVal}>₹{selectedOrder.taxAmount || 0}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoKeyTotal}>Total Amount Paid</Text>
                    <Text style={styles.infoValTotal}>₹{selectedOrder.amount}</Text>
                  </View>
                </View>

                <View style={styles.actionBlock}>
                  <PrimaryButton
                    label="Download Invoice (PDF)"
                    onPress={() => handleDownloadInvoice(selectedOrder.id)}
                    testID="download-invoice-button"
                  />
                  <SecondaryButton
                    label="Need Help with this Order?"
                    onPress={() => {
                      setSelectedOrder(null);
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      router.push('/profile/support' as any);
                    }}
                    testID="order-help-button"
                  />
                </View>
              </ScrollView>
            </View>
          </View>
        )}
      </Modal>
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
  idRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  orderId: {
    fontSize: 11,
    fontWeight: FontWeight.semibold,
    color: Colors.primary,
  },
  orderType: {
    fontSize: 11,
    color: Colors.textSecondary,
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
  detailsBtn: {
    paddingVertical: 6,
    paddingHorizontal: Spacing.md,
  },
  separator: {
    height: Spacing.md,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.surfaceAlt,
    borderTopLeftRadius: Radii.card,
    borderTopRightRadius: Radii.card,
    maxHeight: '85%',
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    ...Typography.h2,
    fontSize: 20,
    color: Colors.ink,
  },
  modalSub: {
    fontSize: FontSize.bodySmall,
    color: Colors.textSecondary,
  },
  closeBtn: {
    padding: 4,
  },
  modalScroll: {
    gap: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  timelineBlock: {
    gap: Spacing.sm,
  },
  sectionLabel: {
    fontSize: FontSize.bodySmall,
    fontWeight: FontWeight.semibold,
    color: Colors.ink,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xs,
  },
  timelineNode: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: Radii.pill,
    backgroundColor: Colors.surface,
  },
  nodeActive: {
    backgroundColor: Colors.primary,
  },
  nodePending: {
    backgroundColor: Colors.border,
  },
  nodeText: {
    fontSize: 11,
    fontWeight: FontWeight.semibold,
    color: Colors.surfaceAlt,
  },
  timelineLine: {
    flex: 1,
    height: 2,
    backgroundColor: Colors.border,
    marginHorizontal: 4,
  },
  lineActive: {
    backgroundColor: Colors.primary,
  },
  detailBlock: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.card,
    padding: Spacing.md,
    gap: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  infoKey: {
    fontSize: FontSize.bodySmall,
    color: Colors.textSecondary,
  },
  infoVal: {
    fontSize: FontSize.bodySmall,
    fontWeight: FontWeight.semibold,
    color: Colors.ink,
  },
  infoKeyTotal: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.semibold,
    color: Colors.ink,
  },
  infoValTotal: {
    ...Typography.price,
    fontSize: 18,
    color: Colors.primary,
  },
  actionBlock: {
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
});
