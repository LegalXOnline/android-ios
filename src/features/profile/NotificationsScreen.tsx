import { SymbolView } from 'expo-symbols';
import { useEffect, useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';

import {
  AppHeader,
  Badge,
  Chip,
  EmptyState,
  SafeScreenWrapper,
  SecondaryButton,
  type BadgeVariant,
} from '@shared/components';
import { Colors, FontSize, FontWeight, Layout, Radii, Shadows, Spacing } from '@theme';
import { getNotifications } from '@services/profile.service';
import { useGoBack } from '@shared/hooks/useGoBack';

import {
  type NotificationCategory,
  type NotificationPayload,
} from './profile.placeholder';

export function NotificationsScreen() {
  const goBack = useGoBack();
  const [notifications, setNotifications] =
    useState<NotificationPayload[]>([]);

  // The same rows the website's bell shows, scoped to this account by the
  // endpoint rather than by anything sent from here.
  useEffect(() => {
    let cancelled = false;
    getNotifications()
      .then((rows) => {
        if (cancelled) return;
        setNotifications(
          rows.map((n) => ({
            id: n.id,
            category: (n.type === 'consultation'
              ? 'Consultation'
              : n.type === 'payment'
                ? 'Payment'
                : n.type === 'document'
                  ? 'Order Update'
                  : 'System') as NotificationCategory,
            title: n.title,
            message: n.message,
            time: new Date(n.created_at).toLocaleString('en-IN', {
              day: 'numeric',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit',
            }),
            isRead: n.is_read,
          })),
        );
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);
  const [filterTab, setFilterTab] = useState<'All' | 'Unread' | 'Read'>('All');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const filteredNotifications = notifications.filter((item) => {
    if (filterTab === 'Unread') return !item.isRead;
    if (filterTab === 'Read') return item.isRead;
    return true;
  });

  const getCategoryBadgeVariant = (cat: NotificationCategory): BadgeVariant => {
    switch (cat) {
      case 'Consultation':
      case 'Document Ready':
        return 'success';
      case 'Payment':
      case 'LX Coins':
        return 'default';
      case 'Order Update':
        return 'warning';
      default:
        return 'default';
    }
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: !n.isRead } : n))
    );
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const renderItem = ({ item }: { item: NotificationPayload }) => (
    <View style={[styles.card, !item.isRead && styles.cardUnread]}>
      <View style={styles.cardHeader}>
        <View style={styles.titleRow}>
          {!item.isRead && <View style={styles.unreadDot} />}
          <Text style={styles.cardTitle}>{item.title}</Text>
        </View>

        <Badge
          label={item.category}
          variant={getCategoryBadgeVariant(item.category)}
        />
      </View>

      <Text style={styles.cardMessage}>{item.message}</Text>

      <View style={styles.cardFooter}>
        <Text style={styles.timeText}>{item.time}</Text>

        <View style={styles.actionsRow}>
          <Pressable
            onPress={() => handleMarkAsRead(item.id)}
            style={({ pressed }) => [styles.actionBtn, pressed && styles.pressed]}
          >
            <Text style={styles.actionText}>
              {item.isRead ? 'Mark Unread' : 'Mark Read'}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => handleDeleteNotification(item.id)}
            style={({ pressed }) => [styles.deleteBtn, pressed && styles.pressed]}
          >
            <SymbolView
              name={{ ios: 'trash.fill', android: 'delete', web: 'delete' }}
              size={16}
              tintColor={Colors.danger}
            />
          </Pressable>
        </View>
      </View>
    </View>
  );

  return (
    <SafeScreenWrapper edges={['top', 'left', 'right']}>
      <AppHeader title="Notification Centre" showBack onBackPress={goBack} />

      <View style={styles.headerBar}>
        <View style={styles.tabsRow}>
          {(['All', 'Unread', 'Read'] as const).map((tab) => (
            <Chip
              key={tab}
              label={tab}
              selected={filterTab === tab}
              onPress={() => setFilterTab(tab)}
            />
          ))}
        </View>

        {notifications.some((n) => !n.isRead) && (
          <SecondaryButton
            label="Mark All Read"
            onPress={handleMarkAllRead}
            style={styles.markAllBtn}
            testID="mark-all-read-button"
          />
        )}
      </View>

      <FlatList
        data={filteredNotifications}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
        ListEmptyComponent={
          <EmptyState
            title="No Notifications"
            description="You're all caught up! Updates regarding consultations and documents will appear here."
            symbol={{ ios: 'bell.slash.fill', android: 'notifications_off', web: 'notifications_off' }}
            actionLabel="Return to Profile"
            onActionPress={goBack}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeScreenWrapper>
  );
}

const styles = StyleSheet.create({
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.screenPaddingHWide,
    paddingVertical: Spacing.sm,
  },
  tabsRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  markAllBtn: {
    paddingVertical: 4,
    paddingHorizontal: Spacing.xs,
  },
  listContent: {
    paddingHorizontal: Layout.screenPaddingHWide,
    paddingVertical: Spacing.md,
    paddingBottom: Spacing.xxl + 20,
  },
  card: {
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radii.card,
    padding: Spacing.md,
    gap: Spacing.xs,
    ...Shadows.card,
  },
  cardUnread: {
    borderColor: Colors.primary,
    backgroundColor: '#FEFCF5',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  cardTitle: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.semibold,
    color: Colors.ink,
  },
  cardMessage: {
    fontSize: FontSize.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Spacing.xs,
    marginTop: 2,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  timeText: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  actionBtn: {
    paddingVertical: 2,
  },
  actionText: {
    fontSize: 11,
    fontWeight: FontWeight.semibold,
    color: Colors.primary,
  },
  deleteBtn: {
    padding: 2,
  },
  pressed: {
    opacity: 0.7,
  },
  separator: {
    height: Spacing.md,
  },
});
