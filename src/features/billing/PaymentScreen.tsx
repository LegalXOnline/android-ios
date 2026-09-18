import { useRouter } from 'expo-router';
import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import {
  AppHeader,
  SafeScreenWrapper,
} from '@shared/components';
import { Colors, FontSize, FontWeight, Layout, Radii, Shadows, Spacing, Typography } from '@theme';
import { useGoBack } from '@shared/hooks/useGoBack';
import { useAuth } from '@providers/AuthProvider';
import { submitApplication } from '@services/orders.service';

import { StickyBottomCTA } from './components/StickyBottomCTA';
import { getBillingOrder, setOrderReference } from './billing.store';

type PaymentMethod = 'UPI' | 'Card' | 'NetBanking' | 'Wallet' | 'LXCoins';

interface PaymentOption {
  id: PaymentMethod;
  title: string;
  subtitle: string;
  symbol: SymbolViewProps['name'];
}

const PAYMENT_OPTIONS: PaymentOption[] = [
  {
    id: 'UPI',
    title: 'UPI Payment',
    subtitle: 'Google Pay, PhonePe, Paytm, BHIM UPI',
    symbol: { ios: 'qrcode', android: 'qr_code', web: 'qr_code' },
  },
  {
    id: 'Card',
    title: 'Credit / Debit Card',
    subtitle: 'Visa, Mastercard, RuPay, Maestro',
    symbol: { ios: 'creditcard.fill', android: 'credit_card', web: 'credit_card' },
  },
  {
    id: 'NetBanking',
    title: 'Net Banking',
    subtitle: 'SBI, HDFC, ICICI, Axis, Kotak & 50+ Banks',
    symbol: { ios: 'building.columns.fill', android: 'account_balance', web: 'account_balance' },
  },
  {
    id: 'Wallet',
    title: 'Digital Wallets',
    subtitle: 'Paytm Wallet, Amazon Pay, Mobikwik',
    symbol: { ios: 'wallet.pass.fill', android: 'account_balance_wallet', web: 'account_balance_wallet' },
  },
  {
    id: 'LXCoins',
    title: 'LX Coins Balance',
    subtitle: 'Use promotional & pre-authorized credits',
    symbol: { ios: 'star.fill', android: 'stars', web: 'stars' },
  },
];

export function PaymentScreen() {
  const router = useRouter();
  const goBack = useGoBack();
  const order = getBillingOrder();
  const { user } = useAuth();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('UPI');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);

  const subtotal = order.price;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + tax - order.discount_amount;

  /**
   * Demo checkout.
   *
   * Razorpay is not integrated on mobile, so no money moves. What does happen
   * is real: the lead and the application are created on the backend, which is
   * what notifies the team. The order is left awaiting payment rather than
   * marked paid, because it has not been.
   */
  const handleSubmitOrder = async () => {
    const name = (user ? `${user.firstName} ${user.lastName}`.trim() : order.user_name).trim();
    const phone = (order.user_phone ?? '').replace(/\s+/g, '');

    // Submitting needs a session: the backend's CSRF guard only stands aside
    // for a Bearer token, so a signed-out POST is rejected outright.
    if (!user) {
      setError('Please sign in to submit this order.');
      return;
    }
    if (!name) {
      setError('We need your name before submitting. Go back and fill it in.');
      return;
    }
    if (!/^(\+91)?[6-9]\d{9}$/.test(phone)) {
      setError('A valid 10-digit mobile number is required. Go back and add one.');
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      const { applicationId } = await submitApplication({
        name,
        phone: phone.replace('+91', ''),
        email: user?.email ?? order.user_email ?? undefined,
        serviceSlug: order.item_id,
        serviceTitle: order.item_title,
        documents: order.documents ?? [],
        formData: {
          mode: selectedMethod,
          amountPaise: total * 100,
          orderType: order.order_type,
        },
      });
      const ref = applicationId.slice(0, 8).toUpperCase();
      setReference(ref);
      setOrderReference(ref);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      router.push('/billing/success' as any);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeScreenWrapper edges={['top', 'left', 'right']}>
      <AppHeader title="Select Payment Method" showBack onBackPress={goBack} />

      <View style={styles.container}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.bannerCard}>
            <Text style={styles.bannerLabel}>Total Payable Amount</Text>
            <Text style={styles.bannerAmount}>₹{total}</Text>
            {reference && <Text style={styles.bannerSub}>Reference: {reference}</Text>}
          </View>

          <View style={styles.demoBanner}>
            <SymbolView
              name={{ ios: 'lock.fill', android: 'lock', web: 'lock' }}
              size={16}
              tintColor={Colors.primary}
            />
            <View style={styles.demoText}>
              <Text style={styles.demoTitle}>Demo mode — no payment is taken</Text>
              <Text style={styles.demoBody}>
                Your order is submitted for review and our team will contact you to arrange payment.
              </Text>
            </View>
          </View>

          {error && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorBannerText}>{error}</Text>
            </View>
          )}

          <View style={styles.sectionBlock}>
            <Text style={styles.sectionTitle}>Payment Options</Text>

            <View style={styles.optionsList}>
              {PAYMENT_OPTIONS.map((opt) => {
                const isSelected = selectedMethod === opt.id;

                return (
                  <Pressable
                    key={opt.id}
                    onPress={() => setSelectedMethod(opt.id)}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: isSelected }}
                    style={({ pressed }) => [
                      styles.methodCard,
                      isSelected && styles.methodCardSelected,
                      pressed && styles.pressed,
                    ]}
                  >
                    <View style={styles.iconBox}>
                      <SymbolView
                        name={opt.symbol}
                        size={22}
                        tintColor={isSelected ? Colors.primary : Colors.textSecondary}
                      />
                    </View>

                    <View style={styles.textInfo}>
                      <Text style={styles.optTitle}>{opt.title}</Text>
                      <Text style={styles.optSub}>{opt.subtitle}</Text>
                    </View>

                    <View style={[styles.radioCircle, isSelected && styles.radioCircleSelected]}>
                      {isSelected && <View style={styles.radioDot} />}
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>

        </ScrollView>

        <StickyBottomCTA
          label={submitting ? 'Submitting…' : `Complete Order (Demo) · ₹${total}`}
          onPress={handleSubmitOrder}
          disabled={submitting}
          testID="pay-now-button"
        />
      </View>
    </SafeScreenWrapper>
  );
}

const styles = StyleSheet.create({
  demoBanner: {
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'flex-start',
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: Radii.card,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  demoText: { flex: 1, gap: 2 },
  demoTitle: { fontSize: FontSize.body, fontWeight: FontWeight.semibold, color: Colors.ink },
  demoBody: { fontSize: FontSize.bodySmall, color: Colors.textSecondary, lineHeight: 18 },
  errorBanner: {
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.danger,
    borderRadius: Radii.card,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  errorBannerText: { fontSize: FontSize.bodySmall, color: Colors.danger, lineHeight: 18 },
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
    gap: Spacing.xl,
  },
  bannerCard: {
    backgroundColor: '#FEFCF5',
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderRadius: Radii.card,
    padding: Spacing.lg,
    alignItems: 'center',
    gap: 4,
    ...Shadows.card,
  },
  bannerLabel: {
    fontSize: FontSize.bodySmall,
    color: Colors.textSecondary,
  },
  bannerAmount: {
    ...Typography.price,
    fontSize: 32,
    color: Colors.primary,
  },
  bannerSub: {
    fontSize: FontSize.bodySmall,
    color: Colors.textSecondary,
    fontWeight: FontWeight.medium,
  },
  sectionBlock: {
    gap: Spacing.md,
  },
  sectionTitle: {
    ...Typography.h2,
    fontSize: 18,
    color: Colors.ink,
  },
  optionsList: {
    gap: Spacing.sm,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radii.card,
    padding: Spacing.md,
    gap: Spacing.md,
    ...Shadows.card,
  },
  methodCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: '#FEFCF5',
  },
  pressed: {
    opacity: 0.85,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInfo: {
    flex: 1,
    gap: 2,
  },
  optTitle: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.semibold,
    color: Colors.ink,
  },
  optSub: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleSelected: {
    borderColor: Colors.primary,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  testSection: {
    marginTop: Spacing.md,
  },
});
