import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import {
  AppHeader,
  AppTextInput,
  Divider,
  SafeScreenWrapper,
} from '@shared/components';
import { Colors, FontSize, FontWeight, Layout, Radii, Shadows, Spacing, Typography } from '@theme';
import { useGoBack } from '@shared/hooks/useGoBack';

import { useAuth } from '@providers/AuthProvider';
import { getProfile } from '@services/profile.service';

import { StickyBottomCTA } from './components/StickyBottomCTA';
import { getBillingOrder, setBillingOrder } from './billing.store';

const NEXT_STEPS = [
  { title: 'Application submitted', desc: 'Our team is notified the moment you confirm.' },
  { title: 'We review it', desc: 'Usually within one working day, and we ask if anything is missing.' },
  { title: 'You get updates', desc: 'By email and in the app, until the filing is done.' },
];

export function BillingScreen() {
  const router = useRouter();
  const goBack = useGoBack();
  const { user } = useAuth();
  const order = getBillingOrder();

  // Editable, because the order needs a number to reach the client and the
  // account may not have one yet. The screen used to print an empty Phone row
  // and then the payment step refused to continue, with nowhere to fix it.
  const [name, setName] = useState(
    order.user_name || (user ? `${user.firstName} ${user.lastName}`.trim() : ''),
  );
  const [phone, setPhone] = useState(order.user_phone ?? '');
  const [phoneError, setPhoneError] = useState('');
  const email = user?.email || order.user_email || '';

  // Prefill from the saved profile so a returning client is not asked twice.
  useEffect(() => {
    let cancelled = false;
    getProfile()
      .then((p) => {
        if (cancelled) return;
        setName((n) => n || `${p.firstName} ${p.lastName}`.trim());
        setPhone((v) => v || p.phone);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  const subtotal = order.price;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + tax;

  const handleProceedToPayment = () => {
    const digits = phone.replace(/[\s-]/g, '').replace(/^\+91/, '');
    if (!name.trim()) {
      setPhoneError('Enter your full name.');
      return;
    }
    if (!/^[6-9]\d{9}$/.test(digits)) {
      setPhoneError('Enter a 10-digit Indian mobile number.');
      return;
    }

    setPhoneError('');
    setBillingOrder({ ...order, user_name: name.trim(), user_phone: digits, user_email: email });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    router.push('/billing/payment' as any);
  };

  return (
    <SafeScreenWrapper edges={['top', 'left', 'right']}>
      <AppHeader title="Order & Billing" showBack onBackPress={goBack} />

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

            {order.order_type === 'coins' && (
              <View style={styles.summaryItem}>
                <View style={styles.iconBox}>
                  <SymbolView
                    name={{ ios: 'star.fill', android: 'stars', web: 'stars' }}
                    size={22}
                    tintColor={Colors.primary}
                  />
                </View>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemTitle}>{order.item_title}</Text>
                  <Text style={styles.itemSub}>LX Coins Credits Purchase</Text>
                </View>
                <Text style={styles.itemPrice}>₹{order.price}</Text>
              </View>
            )}
          </View>

          <View style={styles.card}>
            <Text style={styles.cardHeaderTitle}>Contact & Billing Details</Text>

            <View style={styles.detailsGrid}>
              <View style={styles.detailRow}>
                <AppTextInput
                  label="Full Name"
                  value={name}
                  onChangeText={(t) => {
                    setName(t);
                    setPhoneError('');
                  }}
                  autoCapitalize="words"
                  testID="billing-name-input"
                />
              </View>

              <View style={styles.detailRow}>
                <AppTextInput
                  label="Mobile Number"
                  value={phone}
                  onChangeText={(t) => {
                    setPhone(t);
                    setPhoneError('');
                  }}
                  keyboardType="phone-pad"
                  maxLength={13}
                  supporting="We call this number to confirm your application"
                  error={phoneError || undefined}
                  testID="billing-phone-input"
                />
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Email</Text>
                <Text style={styles.detailVal}>{email}</Text>
              </View>

              {order.order_type !== 'consultation' && order.order_type !== 'coins' && order.user_address && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Address</Text>
                  <Text style={styles.detailVal}>{order.user_address}</Text>
                </View>
              )}
            </View>
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

            <Divider />

            <View style={styles.priceRow}>
              <Text style={styles.totalLabel}>Total Amount Payable</Text>
              <Text style={styles.totalVal}>₹{total}</Text>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardHeaderTitle}>What happens next</Text>
            {NEXT_STEPS.map((step, i) => (
              <View key={step.title} style={styles.nextRow}>
                <View style={styles.nextNumber}>
                  <Text style={styles.nextNumberText}>{i + 1}</Text>
                </View>
                <View style={styles.nextText}>
                  <Text style={styles.nextTitle}>{step.title}</Text>
                  <Text style={styles.nextDesc}>{step.desc}</Text>
                </View>
              </View>
            ))}
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
  nextRow: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.sm },
  nextNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextNumberText: { color: Colors.surfaceAlt, fontSize: 12, fontWeight: '700' },
  nextText: { flex: 1, gap: 2 },
  nextTitle: { fontSize: FontSize.body, fontWeight: FontWeight.semibold, color: Colors.ink },
  nextDesc: { fontSize: FontSize.bodySmall, color: Colors.textSecondary, lineHeight: 18 },
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
    paddingBottom: 24,
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
