import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import {
  AppHeader,
  Badge,
  SafeScreenWrapper,
} from '@shared/components';
import { Colors, FontSize, FontWeight, Layout, Radii, Shadows, Spacing, Typography } from '@theme';
import { useGoBack } from '@shared/hooks/useGoBack';
import { useAuth } from '@providers/AuthProvider';

import { StickyBottomCTA } from './components/StickyBottomCTA';
import { getBillingOrder, setBillingOrder } from './billing.store';

interface CoinPack {
  id: string;
  coins: number;
  bonus: number;
  price: number;
  isPopular?: boolean;
}

const COIN_PACKS: CoinPack[] = [
  { id: 'pack-100', coins: 100, bonus: 0, price: 100 },
  { id: 'pack-250', coins: 250, bonus: 25, price: 250 },
  { id: 'pack-500', coins: 500, bonus: 75, price: 500, isPopular: true },
  { id: 'pack-1000', coins: 1000, bonus: 200, price: 1000 },
  { id: 'pack-2500', coins: 2500, bonus: 600, price: 2500 },
];

export function BuyLxCoinsScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const goBack = useGoBack();
  const [selectedPack, setSelectedPack] = useState<CoinPack>(COIN_PACKS[2]);

  const handleBuy = () => {
    const totalCoins = selectedPack.coins + selectedPack.bonus;
    const existing = getBillingOrder();
    setBillingOrder({
      order_type: 'coins',
      item_id: selectedPack.id,
      item_title: `${totalCoins} LX Coins Pack`,
      price: selectedPack.price,
      discount_amount: 0,
      tax_amount: Math.round(selectedPack.price * 0.18),
      total_amount: Math.round(selectedPack.price * 1.18),
      user_name: user ? `${user.firstName} ${user.lastName}`.trim() : existing.user_name,
      user_email: user?.email ?? existing.user_email,
      user_phone: existing.user_phone ?? '',
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    router.push('/billing/payment' as any);
  };

  return (
    <SafeScreenWrapper edges={['top', 'left', 'right']}>
      <AppHeader title="Buy LX Coins" showBack onBackPress={goBack} />

      <View style={styles.container}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.balanceCard}>
            <View style={styles.iconCircle}>
              <SymbolView
                name={{ ios: 'star.fill', android: 'stars', web: 'stars' }}
                size={36}
                tintColor={Colors.primary}
              />
            </View>

            <Text style={styles.balanceTitle}>Current LX Balance</Text>
            <Text style={styles.balanceCoins}>250 LX Coins</Text>
            <Text style={styles.balanceValue}>Equivalent Value: ₹250.00</Text>
          </View>

          <View style={styles.sectionBlock}>
            <Text style={styles.sectionTitle}>Select LX Coins Pack</Text>

            <View style={styles.packList}>
              {COIN_PACKS.map((pack) => {
                const isSelected = selectedPack.id === pack.id;

                return (
                  <Pressable
                    key={pack.id}
                    onPress={() => setSelectedPack(pack)}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: isSelected }}
                    style={({ pressed }) => [
                      styles.packCard,
                      isSelected && styles.packCardSelected,
                      pressed && styles.pressed,
                    ]}
                  >
                    <View style={styles.packHeaderRow}>
                      <View style={styles.packInfo}>
                        <Text style={styles.packCoins}>{pack.coins} LX Coins</Text>
                        {pack.bonus > 0 ? (
                          <Badge label={`+${pack.bonus} Bonus LX`} variant="success" />
                        ) : null}
                      </View>

                      {pack.isPopular && <Badge label="Most Popular" variant="warning" />}
                    </View>

                    <View style={styles.packFooterRow}>
                      <Text style={styles.packPrice}>₹{pack.price.toLocaleString('en-IN')}</Text>

                      <View style={[styles.radioCircle, isSelected && styles.radioCircleSelected]}>
                        {isSelected && <View style={styles.radioDot} />}
                      </View>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </ScrollView>

        <StickyBottomCTA
          label={`Buy ${selectedPack.coins + selectedPack.bonus} LX Coins — ₹${selectedPack.price}`}
          onPress={handleBuy}
          testID="buy-coins-cta-button"
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
    paddingBottom: 24,
    gap: Spacing.xl,
  },
  balanceCard: {
    backgroundColor: '#FEFCF5',
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderRadius: Radii.card,
    padding: Spacing.lg,
    alignItems: 'center',
    gap: 4,
    ...Shadows.card,
  },
  iconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  balanceTitle: {
    fontSize: FontSize.bodySmall,
    color: Colors.textSecondary,
  },
  balanceCoins: {
    ...Typography.price,
    fontSize: 28,
    color: Colors.primary,
  },
  balanceValue: {
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
  packList: {
    gap: Spacing.md,
  },
  packCard: {
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radii.card,
    padding: Spacing.md,
    gap: Spacing.md,
    ...Shadows.card,
  },
  packCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: '#FEFCF5',
  },
  pressed: {
    opacity: 0.85,
  },
  packHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  packInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  packCoins: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.semibold,
    color: Colors.ink,
  },
  packFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  packPrice: {
    ...Typography.price,
    fontSize: 20,
    color: Colors.ink,
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
});
