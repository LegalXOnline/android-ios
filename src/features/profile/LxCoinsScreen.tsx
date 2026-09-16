import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import {
  AppHeader,
  Badge,
  Divider,
  PrimaryButton,
  SafeScreenWrapper,
} from '@shared/components';
import { Colors, FontSize, FontWeight, Layout, Radii, Shadows, Spacing, Typography } from '@theme';
import { useGoBack } from '@shared/hooks/useGoBack';

import { getWalletBalance, toCoins, type WalletSummary } from '@services/profile.service';

export function LxCoinsScreen() {
  const router = useRouter();
  const goBack = useGoBack();

  const [wallet, setWallet] = useState<WalletSummary | null>(null);

  useEffect(() => {
    let cancelled = false;
    getWalletBalance()
      .then((w) => {
        if (!cancelled) setWallet(w);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  const handleBuyCoins = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    router.push('/billing/buy-coins' as any);
  };

  return (
    <SafeScreenWrapper edges={['top', 'left', 'right']}>
      <AppHeader title="LX Coins Balance" showBack onBackPress={goBack} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <View style={styles.iconCircle}>
            <SymbolView
              name={{ ios: 'star.fill', android: 'stars', web: 'stars' }}
              size={36}
              tintColor={Colors.primary}
            />
          </View>

          <Text style={styles.balanceTitle}>Available Balance</Text>
          <Text style={styles.balanceAmount}>
            {wallet === null ? '—' : `${toCoins(wallet.spendablePaise)} Coins`}
          </Text>
          <Text style={styles.balanceSub}>1 LX Coin = ₹1, spent on consultations by the minute</Text>

          {wallet !== null && wallet.freeCreditPaise > 0 && (
            <Text style={styles.balanceBreakdown}>
              {toCoins(wallet.freeCreditPaise)} free · {toCoins(wallet.walletPaise)} purchased
            </Text>
          )}

          <View style={styles.demoNotice}>
            <SymbolView
              name={{ ios: 'lock.fill', android: 'lock', web: 'lock' }}
              size={14}
              tintColor={Colors.primary}
            />
            <Text style={styles.demoText}>
              Buying coins is in demo mode — no payment is taken yet. Every account starts with 100
              free coins.
            </Text>
          </View>

          <PrimaryButton
            label="Buy LX Coins"
            onPress={handleBuyCoins}
            style={styles.buyBtn}
            testID="lx-coins-buy-button"
          />
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>About LX Coins</Text>

          <View style={styles.infoRow}>
            <SymbolView
              name={{ ios: 'checkmark.seal.fill', android: 'verified', web: 'verified' }}
              size={18}
              tintColor={Colors.primary}
            />
            <Text style={styles.infoText}>
              LX Coins represent verified promotional credits and pre-authorization holds for consultation bookings.
            </Text>
          </View>

          <View style={styles.infoRow}>
            <SymbolView
              name={{ ios: 'lock.fill', android: 'lock', web: 'lock' }}
              size={18}
              tintColor={Colors.textSecondary}
            />
            <Text style={styles.infoText}>
              LX Coins can be used directly during consultation bookings or document verification checkouts.
            </Text>
          </View>
        </View>

        <Divider />

        <View style={styles.historySection}>
          <Text style={styles.sectionTitle}>Recent Coin Activity</Text>

          <View style={styles.historyCard}>
            <View style={styles.activityRow}>
              <View style={styles.actInfo}>
                <Text style={styles.actTitle}>Welcome Bonus Credits</Text>
                <Text style={styles.actDate}>Jul 01, 2026</Text>
              </View>

              <Badge label="+250 LX" variant="success" />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeScreenWrapper>
  );
}

const styles = StyleSheet.create({
  balanceBreakdown: {
    fontSize: FontSize.bodySmall,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  demoNotice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.xs,
    marginTop: Spacing.md,
    padding: Spacing.md,
    borderRadius: Radii.card,
    borderWidth: 1,
    borderColor: Colors.primary,
    backgroundColor: Colors.surfaceAlt,
  },
  demoText: { flex: 1, fontSize: FontSize.bodySmall, color: Colors.textSecondary, lineHeight: 18 },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Layout.screenPaddingHWide,
    paddingVertical: Spacing.md,
    paddingBottom: Spacing.xxl + 20,
    gap: Spacing.lg,
  },
  card: {
    backgroundColor: '#FEFCF5',
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderRadius: Radii.card,
    padding: Spacing.xl,
    alignItems: 'center',
    gap: Spacing.xs,
    ...Shadows.card,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
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
    fontWeight: FontWeight.medium,
  },
  balanceAmount: {
    ...Typography.price,
    fontSize: 28,
    color: Colors.primary,
  },
  balanceSub: {
    fontSize: FontSize.bodySmall,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 2,
  },
  buyBtn: {
    marginTop: Spacing.md,
    width: '100%',
  },
  infoSection: {
    gap: Spacing.md,
  },
  sectionTitle: {
    ...Typography.h2,
    fontSize: 18,
    color: Colors.ink,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radii.card,
    padding: Spacing.md,
  },
  infoText: {
    ...Typography.body,
    fontSize: 13,
    color: Colors.ink,
    flex: 1,
    lineHeight: 18,
  },
  historySection: {
    gap: Spacing.sm,
  },
  historyCard: {
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radii.card,
    padding: Spacing.md,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actInfo: {
    gap: 2,
  },
  actTitle: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.semibold,
    color: Colors.ink,
  },
  actDate: {
    fontSize: FontSize.bodySmall,
    color: Colors.textSecondary,
  },
});
