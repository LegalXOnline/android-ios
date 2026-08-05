import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import {
  AppHeader,
  AppTextInput,
  Badge,
  Divider,
  SafeScreenWrapper,
  SecondaryButton,
} from '@shared/components';
import { Colors, FontSize, FontWeight, Layout, Radii, Shadows, Spacing, Typography } from '@theme';

import { StickyBottomCTA } from './components/StickyBottomCTA';
import { getBillingOrder } from './billing.store';

export function BillingScreen() {
  const router = useRouter();
  const order = getBillingOrder();

  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState('');

  const subtotal = order.price;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + tax - discount;

  const handleApplyCoupon = () => {
    if (coupon.trim().toUpperCase() === 'LEGALX100') {
      setDiscount(100);
      setCouponApplied(true);
      setCouponError('');
    } else if (coupon.trim().length > 0) {
      setCouponError('Invalid coupon code. Try "LEGALX100"');
      setCouponApplied(false);
    }
  };

  const handleProceedToPayment = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    router.push('/billing/payment' as any);
  };

  return (
    <SafeScreenWrapper edges={['top', 'left', 'right']}>
      <AppHeader title="Order & Billing" showBack onBackPress={() => router.back()} />

      <View style={styles.container}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            <Text style={styles.cardHeaderTitle}>Order Summary</Text>

            {order.order_type === 'document' && (
              <View style={styles.summaryItem}>
                <View style={styles.iconBox}>
                  <SymbolView
                    name={{ ios: 'doc.text.fill', android: 'description', web: 'description' }}
                    size={22}
                    tintColor={Colors.primary}
                  />
                </View>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemTitle}>{order.item_title}</Text>
                  <Text style={styles.itemSub}>Document Drafting & Legal Formatting</Text>
                </View>
                <Text style={styles.itemPrice}>₹{order.price}</Text>
              </View>
            )}

            {order.order_type === 'verification' && (
              <View style={styles.summaryItem}>
                <View style={styles.iconBox}>
                  <SymbolView
                    name={{ ios: 'shield.fill', android: 'verified_user', web: 'verified_user' }}
                    size={22}
                    tintColor={Colors.primary}
                  />
                </View>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemTitle}>{order.package_name || order.item_title}</Text>
                  <Text style={styles.itemSub}>
                    File: {order.uploaded_file_name || 'Rental_Agreement.pdf'}
                  </Text>
                </View>
                <Text style={styles.itemPrice}>₹{order.price}</Text>
              </View>
            )}

            {order.order_type === 'consultation' && (
              <View style={styles.summaryItem}>
                <View style={styles.iconBox}>
                  <SymbolView
                    name={{ ios: 'person.fill', android: 'person', web: 'person' }}
                    size={22}
                    tintColor={Colors.primary}
                  />
                </View>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemTitle}>{order.lawyer_name || 'Adv. Priya Sharma'}</Text>
                  <Text style={styles.itemSub}>
                    {order.mode || 'Video'} Session • 15 Mins
                  </Text>
                </View>
                <Text style={styles.itemPrice}>₹{order.price}</Text>
              </View>
            )}
          </View>

          <View style={styles.card}>
            <Text style={styles.cardHeaderTitle}>Contact & Billing Details</Text>

            <View style={styles.detailsGrid}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Full Name</Text>
                <Text style={styles.detailVal}>{order.user_name}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Phone</Text>
                <Text style={styles.detailVal}>{order.user_phone}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Email</Text>
                <Text style={styles.detailVal}>{order.user_email}</Text>
              </View>

              {order.order_type !== 'consultation' && order.user_address && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Address</Text>
                  <Text style={styles.detailVal}>{order.user_address}</Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardHeaderTitle}>Have a Coupon Code?</Text>

            <View style={styles.couponRow}>
              <View style={styles.couponInputBox}>
                <AppTextInput
                  label="Coupon Code"
                  value={coupon}
                  onChangeText={setCoupon}
                  placeholder="Enter code (try LEGALX100)"
                  autoCapitalize="characters"
                  testID="coupon-input"
                />
              </View>

              <SecondaryButton
                label={couponApplied ? 'Applied' : 'Apply'}
                onPress={handleApplyCoupon}
                style={styles.applyBtn}
                testID="apply-coupon-button"
              />
            </View>

            {couponApplied && (
              <Badge label="★ Coupon LEGALX100 Applied — ₹100 Off" variant="success" />
            )}
            {couponError ? <Text style={styles.errorText}>{couponError}</Text> : null}
          </View>

          <View style={styles.card}>
            <Text style={styles.cardHeaderTitle}>Price Breakdown</Text>

            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Base Service Subtotal</Text>
              <Text style={styles.priceVal}>₹{subtotal}</Text>
            </View>

            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>GST & Regulatory Fees (18%)</Text>
              <Text style={styles.priceVal}>+ ₹{tax}</Text>
            </View>

            {discount > 0 && (
              <View style={styles.priceRow}>
                <Text style={styles.discountLabel}>Coupon Discount</Text>
                <Text style={styles.discountVal}>- ₹{discount}</Text>
              </View>
            )}

            <Divider />

            <View style={styles.priceRow}>
              <Text style={styles.totalLabel}>Total Amount Payable</Text>
              <Text style={styles.totalVal}>₹{total}</Text>
            </View>
          </View>
        </ScrollView>

        <StickyBottomCTA
          label={`Proceed to Payment — ₹${total}`}
          onPress={handleProceedToPayment}
          testID="proceed-to-payment-button"
        />
      </View>
    </SafeScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Layout.screenPaddingHWide,
    paddingVertical: Spacing.md,
    paddingBottom: 110,
    gap: Spacing.lg,
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
  cardHeaderTitle: {
    ...Typography.h2,
    fontSize: 17,
    color: Colors.ink,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: Radii.sm,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemInfo: {
    flex: 1,
    gap: 2,
  },
  itemTitle: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.semibold,
    color: Colors.ink,
  },
  itemSub: {
    fontSize: FontSize.bodySmall,
    color: Colors.textSecondary,
  },
  itemPrice: {
    ...Typography.price,
    fontSize: 18,
    color: Colors.primary,
  },
  detailsGrid: {
    gap: Spacing.sm,
  },
  detailRow: {
    gap: 2,
  },
  detailLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  detailVal: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.medium,
    color: Colors.ink,
  },
  couponRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  couponInputBox: {
    flex: 1,
  },
  applyBtn: {
    minWidth: 90,
    marginTop: 20,
  },
  errorText: {
    fontSize: FontSize.bodySmall,
    color: Colors.danger,
    fontWeight: FontWeight.medium,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceLabel: {
    fontSize: FontSize.bodySmall,
    color: Colors.textSecondary,
  },
  priceVal: {
    fontSize: FontSize.bodySmall,
    fontWeight: FontWeight.semibold,
    color: Colors.ink,
  },
  discountLabel: {
    fontSize: FontSize.bodySmall,
    color: Colors.success,
  },
  discountVal: {
    fontSize: FontSize.bodySmall,
    fontWeight: FontWeight.semibold,
    color: Colors.success,
  },
  totalLabel: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.semibold,
    color: Colors.ink,
  },
  totalVal: {
    ...Typography.price,
    fontSize: 22,
    color: Colors.primary,
  },
});
