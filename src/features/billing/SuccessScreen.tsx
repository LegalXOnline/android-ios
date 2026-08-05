import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import {
  AppHeader,
  Badge,
  PrimaryButton,
  SafeScreenWrapper,
  SecondaryButton,
} from '@shared/components';
import { Colors, FontSize, FontWeight, Layout, Radii, Shadows, Spacing, Typography } from '@theme';

import { getBillingOrder } from './billing.store';

export function SuccessScreen() {
  const router = useRouter();
  const order = getBillingOrder();
  const [orderId] = useState('ORD-84920');

  const handleViewOrders = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    router.push('/profile/orders' as any);
  };

  const handleBackToHome = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    router.replace('/(tabs)' as any);
  };

  return (
    <SafeScreenWrapper edges={['top', 'left', 'right']}>
      <AppHeader title="Order Confirmation" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.successCard}>
          <View style={styles.successIconCircle}>
            <SymbolView
              name={{ ios: 'checkmark.circle.fill', android: 'check_circle', web: 'check_circle' }}
              size={56}
              tintColor={Colors.success}
            />
          </View>

          <Text style={styles.title}>Payment Successful!</Text>
          <Text style={styles.orderIdText}>Order ID: {orderId}</Text>
          <Badge label="Payment Confirmed" variant="success" />
        </View>

        <View style={styles.detailsCard}>
          <Text style={styles.sectionHeading}>Order & Delivery Details</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Service Ordered</Text>
            <Text style={styles.infoVal}>{order.item_title}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Amount Billed</Text>
            <Text style={styles.infoVal}>₹{order.total_amount || order.price}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Fulfilment Timeline</Text>
            <Text style={styles.infoVal}>
              {order.order_type === 'consultation'
                ? 'Scheduled Session Ready'
                : 'Delivery within 24-48 Business Hours'}
            </Text>
          </View>
        </View>

        <View style={styles.actionsBlock}>
          <PrimaryButton
            label="View My Orders"
            onPress={handleViewOrders}
            testID="view-orders-button"
          />
          <SecondaryButton
            label="Back to Home"
            onPress={handleBackToHome}
            testID="back-home-button"
          />
        </View>
      </ScrollView>
    </SafeScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Layout.screenPaddingHWide,
    paddingVertical: Spacing.xl,
    paddingBottom: Spacing.xxl + 20,
    gap: Spacing.xl,
  },
  successCard: {
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1.5,
    borderColor: Colors.success,
    borderRadius: Radii.card,
    padding: Spacing.xl,
    alignItems: 'center',
    gap: Spacing.sm,
    ...Shadows.card,
  },
  successIconCircle: {
    marginBottom: Spacing.xs,
  },
  title: {
    ...Typography.h1,
    fontSize: 24,
    color: Colors.ink,
  },
  orderIdText: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.semibold,
    color: Colors.textSecondary,
  },
  detailsCard: {
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radii.card,
    padding: Spacing.lg,
    gap: Spacing.md,
    ...Shadows.card,
  },
  sectionHeading: {
    ...Typography.h2,
    fontSize: 17,
    color: Colors.ink,
  },
  infoRow: {
    gap: 2,
  },
  infoLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  infoVal: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.semibold,
    color: Colors.ink,
  },
  actionsBlock: {
    gap: Spacing.md,
  },
});
