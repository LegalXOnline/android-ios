import { useRouter } from 'expo-router';
import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import {
  AppHeader,
  SafeScreenWrapper,
  SecondaryButton,
} from '@shared/components';
import { Colors, FontSize, FontWeight, Layout, Radii, Shadows, Spacing, Typography } from '@theme';

import { StickyBottomCTA } from './components/StickyBottomCTA';
import { getBillingOrder } from './billing.store';

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
  const order = getBillingOrder();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('UPI');
  const [orderId] = useState('ORD-84920');

  const subtotal = order.price;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + tax - order.discount_amount;

  const handlePaySuccess = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    router.push('/billing/success' as any);
  };

  const handleTriggerFailTest = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    router.push('/billing/failed' as any);
  };

  return (
    <SafeScreenWrapper edges={['top', 'left', 'right']}>
      <AppHeader title="Select Payment Method" showBack onBackPress={() => router.back()} />

      <View style={styles.container}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.bannerCard}>
            <Text style={styles.bannerLabel}>Total Payable Amount</Text>
            <Text style={styles.bannerAmount}>₹{total}</Text>
            <Text style={styles.bannerSub}>Order ID: {orderId}</Text>
          </View>

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

          <View style={styles.testSection}>
            <SecondaryButton
              label="Simulate Payment Failure (Test)"
              onPress={handleTriggerFailTest}
              testID="simulate-failed-button"
            />
          </View>
        </ScrollView>

        <StickyBottomCTA
          label={`Pay ₹${total}`}
          onPress={handlePaySuccess}
          testID="pay-now-button"
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
