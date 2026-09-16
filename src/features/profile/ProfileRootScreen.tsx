import { useFocusEffect, useRouter, type Href } from 'expo-router';
import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { useCallback, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useAuth } from '@providers/AuthProvider';
import { useIdentity, useProfile } from '@providers/ProfileProvider';
import {
  AppHeader,
  Avatar,
  Badge,
  Divider,
  PrimaryButton,
  SafeScreenWrapper,
  SecondaryButton,
} from '@shared/components';
import { Colors, FontSize, FontWeight, Layout, Radii, Shadows, Spacing, Typography } from '@theme';
import { useGoBack } from '@shared/hooks/useGoBack';

import { getWalletBalance, toCoins } from '@services/profile.service';

interface MenuItem {
  id: string;
  title: string;
  subtitle?: string;
  symbol: SymbolViewProps['name'];
  route?: string;
  badge?: string;
}

export function ProfileRootScreen() {
  const router = useRouter();
  const goBack = useGoBack();
  const { signOut } = useAuth();
  // The balance is the wallet's, not a fixture. Null until it arrives, so the
  // card shows a dash rather than a number nobody has earned.
  const [coins, setCoins] = useState<number | null>(null);
  const identity = useIdentity();
  const { refresh: refreshProfile } = useProfile();

  // Re-read on focus so a photo, a name or a balance changed elsewhere is
  // current the moment the user comes back.
  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      void refreshProfile();
      getWalletBalance()
        .then((w) => {
          if (!cancelled) setCoins(toCoins(w.spendablePaise));
        })
        .catch(() => undefined);
      return () => {
        cancelled = true;
      };
    }, [refreshProfile]),
  );

  const coinLabel = coins === null ? '—' : String(coins);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const name = identity.name;
  const initials = identity.initials;

  const MENU_ITEMS: MenuItem[] = [
    {
      id: 'orders',
      title: 'My Orders',
      subtitle: 'Purchased document services & downloads',
      symbol: { ios: 'doc.plaintext.fill', android: 'receipt', web: 'receipt' },
      route: '/profile/orders',
    },
    {
      id: 'consultations',
      title: 'My Consultations',
      subtitle: 'Past & upcoming voice, video & chat sessions',
      symbol: { ios: 'phone.fill', android: 'call', web: 'call' },
      route: '/profile/call-history',
    },
    {
      id: 'saved-lawyers',
      title: 'Saved Lawyers',
      subtitle: 'Favourited advocate profiles',
      symbol: { ios: 'heart.fill', android: 'favorite', web: 'favorite' },
      route: '/profile/favourites',
    },
    {
      id: 'saved-articles',
      title: 'Saved Articles',
      subtitle: 'Bookmarked legal guides & topics',
      symbol: { ios: 'bookmark.fill', android: 'bookmark', web: 'bookmark' },
      route: '/profile/saved-articles',
    },
    {
      id: 'notifications',
      title: 'Notification Centre',
      subtitle: 'Session updates and legal reminders',
      symbol: { ios: 'bell.fill', android: 'notifications', web: 'notifications' },
      route: '/profile/notifications',
    },
    {
      id: 'wallet',
      title: 'Wallet (LX Coins)',
      subtitle: `Balance: ${coinLabel} Coins`,
      symbol: { ios: 'creditcard.fill', android: 'account_balance_wallet', web: 'account_balance_wallet' },
      route: '/profile/lx-coins',
      badge: `${coinLabel} Coins`,
    },
    {
      id: 'support',
      title: 'Support & Helpdesk',
      subtitle: 'Submit tickets & FAQs',
      symbol: { ios: 'questionmark.circle.fill', android: 'help', web: 'help' },
      route: '/profile/support',
    },
    {
      id: 'settings',
      title: 'Settings',
      subtitle: 'Language, privacy, terms & app version',
      symbol: { ios: 'gearshape.fill', android: 'settings', web: 'settings' },
      route: '/profile/settings',
    },
  ];

  const handleMenuPress = (item: MenuItem) => {
    if (item.route) {
      router.push(item.route as Href);
    }
  };

  const handleEditProfile = () => {
    router.push('/profile/edit' as Href);
  };

  const handleConfirmLogout = async () => {
    setSigningOut(true);
    try {
      // Clears the stored session; AuthGate sends us to onboarding once the
      // user is gone. Navigating on our own would only bounce straight back.
      await signOut();
    } finally {
      setSigningOut(false);
      setShowLogoutModal(false);
    }
  };

  return (
    <SafeScreenWrapper edges={['top', 'left', 'right']}>
      <AppHeader title="Account & Profile" showBack onBackPress={goBack} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerCard}>
          <Avatar initials={initials} size="xl" uri={identity.avatarUrl} />

          <View style={styles.headerInfo}>
            <Text style={styles.userName}>{name}</Text>
            <Text style={styles.userContact}>{identity.email}</Text>
          </View>

          <SecondaryButton
            label="Edit Profile"
            onPress={handleEditProfile}
            style={styles.editBtn}
            testID="edit-profile-button"
          />
        </View>

        <Pressable
          onPress={() => router.push('/profile/lx-coins' as Href)}
          style={({ pressed }) => [styles.coinsBanner, pressed && styles.pressed]}
        >
          <View style={styles.coinsIconCircle}>
            <SymbolView
              name={{ ios: 'star.fill', android: 'stars', web: 'stars' }}
              size={24}
              tintColor={Colors.primary}
            />
          </View>

          <View style={styles.coinsTextInfo}>
            <Text style={styles.coinsTitle}>LX Coins Balance</Text>
            <Text style={styles.coinsSubtitle}>View held & available credits for consultations</Text>
          </View>

          <Text style={styles.coinsValue}>{coinLabel} LX</Text>
        </Pressable>

        <View style={styles.menuSection}>
          <Text style={styles.menuHeading}>Menu</Text>

          <View style={styles.menuList}>
            {MENU_ITEMS.map((item, idx) => (
              <View key={item.id}>
                {idx > 0 && <Divider style={styles.menuDivider} />}

                <Pressable
                  onPress={() => handleMenuPress(item)}
                  accessibilityRole="button"
                  accessibilityLabel={item.title}
                  style={({ pressed }) => [styles.menuRow, pressed && styles.pressed]}
                >
                  <View style={styles.menuIconBox}>
                    <SymbolView name={item.symbol} size={20} tintColor={Colors.primary} />
                  </View>

                  <View style={styles.menuTextInfo}>
                    <Text style={styles.menuTitle}>{item.title}</Text>
                    {item.subtitle ? <Text style={styles.menuSub}>{item.subtitle}</Text> : null}
                  </View>

                  {item.badge ? (
                    <Badge label={item.badge} variant="default" />
                  ) : (
                    <SymbolView
                      name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
                      size={18}
                      tintColor={Colors.textSecondary}
                    />
                  )}
                </Pressable>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.logoutBlock}>
          <SecondaryButton
            label="Log Out"
            onPress={() => setShowLogoutModal(true)}
            style={styles.logoutBtn}
            testID="profile-logout-button"
          />
        </View>
      </ScrollView>

      <Modal
        visible={showLogoutModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Log Out of LegalX?</Text>
            <Text style={styles.modalMessage}>
              You will need your email and password to sign back in.
            </Text>

            <View style={styles.modalActions}>
              <PrimaryButton
                label="Confirm Log Out"
                onPress={handleConfirmLogout}
                loading={signingOut}
                testID="confirm-logout-button"
              />
              <SecondaryButton
                label="Cancel"
                onPress={() => setShowLogoutModal(false)}
                testID="cancel-logout-button"
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Layout.screenPaddingHWide,
    paddingVertical: Spacing.md,
    paddingBottom: Spacing.xxl + 20,
    gap: Spacing.lg,
  },
  headerCard: {
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radii.card,
    padding: Spacing.lg,
    alignItems: 'center',
    gap: Spacing.md,
    ...Shadows.card,
  },
  headerInfo: {
    alignItems: 'center',
    gap: Spacing.xs / 2,
  },
  userName: {
    ...Typography.h1,
    fontSize: 22,
    color: Colors.ink,
  },
  userContact: {
    fontSize: FontSize.bodySmall,
    color: Colors.textSecondary,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  editBtn: {
    minWidth: 140,
  },
  coinsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEFCF5',
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderRadius: Radii.card,
    padding: Spacing.md,
    gap: Spacing.md,
    ...Shadows.card,
  },
  coinsIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coinsTextInfo: {
    flex: 1,
    gap: 2,
  },
  coinsTitle: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.semibold,
    color: Colors.ink,
  },
  coinsSubtitle: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  coinsValue: {
    ...Typography.price,
    fontSize: 18,
    color: Colors.primary,
  },
  pressed: {
    opacity: 0.85,
  },
  menuSection: {
    gap: Spacing.sm,
  },
  menuHeading: {
    ...Typography.h2,
    fontSize: 18,
    color: Colors.ink,
  },
  menuList: {
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radii.card,
    overflow: 'hidden',
    ...Shadows.card,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    gap: Spacing.md,
  },
  menuIconBox: {
    width: 36,
    height: 36,
    borderRadius: Radii.sm,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuTextInfo: {
    flex: 1,
    gap: 2,
  },
  menuTitle: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.semibold,
    color: Colors.ink,
  },
  menuSub: {
    fontSize: FontSize.bodySmall,
    color: Colors.textSecondary,
  },
  menuDivider: {
    marginVertical: 0,
  },
  logoutBlock: {
    marginTop: Spacing.sm,
  },
  logoutBtn: {
    borderColor: Colors.danger,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Layout.screenPaddingHWide,
  },
  modalCard: {
    width: '100%',
    backgroundColor: Colors.surfaceAlt,
    borderRadius: Radii.card,
    padding: Spacing.xl,
    gap: Spacing.md,
    ...Shadows.card,
  },
  modalTitle: {
    ...Typography.h2,
    fontSize: 20,
    color: Colors.ink,
  },
  modalMessage: {
    ...Typography.body,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  modalActions: {
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
});
