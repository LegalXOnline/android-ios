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

import {
  PLACEHOLDER_CONSULTATIONS,
  type ConsultationHistoryPayload,
  type ConsultationStatus,
} from './profile.placeholder';

export function CallHistoryScreen() {
  const router = useRouter();
  const [consultations] =
    useState<ConsultationHistoryPayload[]>(PLACEHOLDER_CONSULTATIONS);
  const [filterTab, setFilterTab] = useState<'All' | ConsultationStatus>('All');
  const [selectedConsultation, setSelectedConsultation] =
    useState<ConsultationHistoryPayload | null>(null);

  const filteredConsultations = consultations.filter((item) => {
    if (filterTab === 'All') return true;
    return item.status.toLowerCase() === filterTab.toLowerCase();
  });

  const getStatusBadgeVariant = (status: ConsultationStatus): BadgeVariant => {
    switch (status) {
      case 'Upcoming':
        return 'warning';
      case 'Completed':
        return 'success';
      case 'Cancelled':
        return 'danger';
      default:
        return 'default';
    }
  };

  const handleBookAgain = (lawyerId: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    router.push(`/lawyer/${lawyerId}` as any);
  };

  const renderItem = ({ item }: { item: ConsultationHistoryPayload }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.iconBox}>
          <SymbolView
            name={
              item.mode === 'Video'
                ? { ios: 'video.fill', android: 'videocam', web: 'videocam' }
                : item.mode === 'Voice'
                  ? { ios: 'phone.fill', android: 'call', web: 'call' }
                  : { ios: 'bubble.left.and.bubble.right.fill', android: 'chat', web: 'chat' }
            }
            size={22}
            tintColor={Colors.primary}
          />
        </View>

        <View style={styles.headerInfo}>
          <Text style={styles.lawyerName}>{item.lawyerName}</Text>
          <Text style={styles.lawyerTitle}>{item.lawyerTitle}</Text>
          <Text style={styles.dateText}>
            {item.date} • {item.duration} ({item.mode})
          </Text>
        </View>

        <Badge
          label={item.status}
          variant={getStatusBadgeVariant(item.status)}
        />
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.amountText}>₹{item.amount}</Text>

        <View style={styles.actionsRow}>
          <SecondaryButton
            label="View Details"
            onPress={() => setSelectedConsultation(item)}
            style={styles.actionBtn}
            testID={`view-consultation-${item.id}`}
          />
          <PrimaryButton
            label="Book Again"
            onPress={() => handleBookAgain(item.lawyerId)}
            style={styles.bookBtn}
            testID={`book-again-${item.id}`}
          />
        </View>
      </View>
    </View>
  );

  return (
    <SafeScreenWrapper edges={['top', 'left', 'right']}>
      <AppHeader title="My Consultations" showBack onBackPress={() => router.back()} />

      <View style={styles.filterBar}>
        {(['All', 'Upcoming', 'Completed', 'Cancelled'] as const).map((tab) => (
          <Chip
            key={tab}
            label={tab}
            selected={filterTab === tab}
            onPress={() => setFilterTab(tab)}
          />
        ))}
      </View>

      <FlatList
        data={filteredConsultations}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <EmptyState
            title="No Consultations Found"
            description="You haven't scheduled or completed any advocate consultations under this filter."
            actionLabel="Find an Advocate"
            onActionPress={() => router.push('/(tabs)/talk-to-lawyer' as any)}
          />
        }
        showsVerticalScrollIndicator={false}
      />

      <Modal
        visible={Boolean(selectedConsultation)}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedConsultation(null)}
      >
        {selectedConsultation && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <View>
                  <Text style={styles.modalTitle}>Consultation Details</Text>
                  <Text style={styles.modalSub}>ID: {selectedConsultation.id}</Text>
                </View>
                <Pressable onPress={() => setSelectedConsultation(null)} style={styles.closeBtn}>
                  <SymbolView
                    name={{ ios: 'xmark.circle.fill', android: 'cancel', web: 'cancel' }}
                    size={24}
                    tintColor={Colors.textSecondary}
                  />
                </Pressable>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.modalScroll}>
                <View style={styles.detailBlock}>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoKey}>Advocate Name</Text>
                    <Text style={styles.infoVal}>{selectedConsultation.lawyerName}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoKey}>Specialization</Text>
                    <Text style={styles.infoVal}>{selectedConsultation.lawyerTitle}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoKey}>Consultation Mode</Text>
                    <Text style={styles.infoVal}>{selectedConsultation.mode} Call</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoKey}>Scheduled Time</Text>
                    <Text style={styles.infoVal}>{selectedConsultation.date}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoKey}>Duration</Text>
                    <Text style={styles.infoVal}>{selectedConsultation.duration}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoKey}>Status</Text>
                    <Badge
                      label={selectedConsultation.status}
                      variant={getStatusBadgeVariant(selectedConsultation.status)}
                    />
                  </View>
                </View>

                {selectedConsultation.notes && (
                  <View style={styles.detailBlock}>
                    <Text style={styles.sectionLabel}>Client Notes</Text>
                    <Text style={styles.notesText}>{selectedConsultation.notes}</Text>
                  </View>
                )}

                <View style={styles.detailBlock}>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoKeyTotal}>Fee Paid</Text>
                    <Text style={styles.infoValTotal}>₹{selectedConsultation.amount}</Text>
                  </View>
                </View>

                <View style={styles.modalActions}>
                  <PrimaryButton
                    label="Book Follow-up Session"
                    onPress={() => {
                      const lId = selectedConsultation.lawyerId;
                      setSelectedConsultation(null);
                      handleBookAgain(lId);
                    }}
                    testID="consultation-book-followup"
                  />
                  <SecondaryButton
                    label="Need Assistance?"
                    onPress={() => {
                      setSelectedConsultation(null);
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      router.push('/profile/support' as any);
                    }}
                    testID="consultation-support-button"
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
  lawyerName: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.semibold,
    color: Colors.ink,
  },
  lawyerTitle: {
    fontSize: FontSize.bodySmall,
    color: Colors.primary,
    fontWeight: FontWeight.medium,
  },
  dateText: {
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
  actionsRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  actionBtn: {
    paddingVertical: 6,
    paddingHorizontal: Spacing.sm,
  },
  bookBtn: {
    paddingVertical: 6,
    paddingHorizontal: Spacing.sm,
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
    maxHeight: '80%',
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
    gap: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  detailBlock: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.card,
    padding: Spacing.md,
    gap: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: FontWeight.semibold,
    color: Colors.ink,
    textTransform: 'uppercase',
  },
  notesText: {
    fontSize: FontSize.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 20,
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
  modalActions: {
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
});
