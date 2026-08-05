import * as DocumentPicker from 'expo-document-picker';
import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { FlatList, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import {
  AppHeader,
  AppTextInput,
  Badge,
  Chip,
  EmptyState,
  FaqAccordion,
  PrimaryButton,
  SafeScreenWrapper,
  SecondaryButton,
  type BadgeVariant,
} from '@shared/components';
import { Colors, FontSize, FontWeight, Layout, Radii, Shadows, Spacing, Typography } from '@theme';

import {
  PLACEHOLDER_TICKETS,
  type SupportTicketPayload,
  type TicketCategory,
  type TicketStatus,
} from './profile.placeholder';

const TICKET_CATEGORIES: TicketCategory[] = [
  'Payments',
  'Documents',
  'Verification',
  'Consultation',
  'Account',
  'Other',
];

export function SupportScreen() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'faq' | 'create' | 'my_tickets'>('faq');

  const [selectedCategory, setSelectedCategory] = useState<TicketCategory>('Payments');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [attachedFile, setAttachedFile] = useState<string | null>(null);

  const [tickets, setTickets] = useState<SupportTicketPayload[]>(PLACEHOLDER_TICKETS);
  const [ticketFilter, setTicketFilter] = useState<'All' | TicketStatus>('All');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicketPayload | null>(null);
  const [replyText, setReplyText] = useState('');

  const [toastNotice, setToastNotice] = useState('');

  const filteredTickets = tickets.filter((t) => {
    if (ticketFilter === 'All') return true;
    return t.status.toLowerCase() === ticketFilter.toLowerCase();
  });

  const getStatusBadgeVariant = (status: TicketStatus): BadgeVariant => {
    switch (status) {
      case 'Open':
        return 'warning';
      case 'In Progress':
        return 'default';
      case 'Resolved':
        return 'success';
      case 'Closed':
        return 'danger';
      default:
        return 'default';
    }
  };

  const handlePickAttachment = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/jpeg', 'image/png'],
      });
      if (!res.canceled && res.assets && res.assets.length > 0) {
        setAttachedFile(res.assets[0].name);
      }
    } catch {
      setAttachedFile('Attachment_Screenshot.png');
    }
  };

  const handleCreateTicket = () => {
    if (!subject.trim() || !description.trim()) {
      setToastNotice('Please fill in both subject and description.');
      setTimeout(() => setToastNotice(''), 3000);
      return;
    }

    const newTicket: SupportTicketPayload = {
      id: `TICK-${Math.floor(1000 + Math.random() * 9000)}`,
      category: selectedCategory,
      subject: subject.trim(),
      description: description.trim(),
      date: 'Today',
      status: 'Open',
      messages: [
        {
          sender: 'User',
          text: description.trim(),
          time: 'Just now',
        },
      ],
    };

    setTickets([newTicket, ...tickets]);
    setSubject('');
    setDescription('');
    setAttachedFile(null);
    setToastNotice('Support ticket submitted successfully!');
    setActiveTab('my_tickets');
    setTimeout(() => setToastNotice(''), 3000);
  };

  const handleSendReply = () => {
    if (!replyText.trim() || !selectedTicket) return;

    const newMsg = {
      sender: 'User' as const,
      text: replyText.trim(),
      time: 'Just now',
    };

    const updated = {
      ...selectedTicket,
      messages: [...selectedTicket.messages, newMsg],
    };

    setSelectedTicket(updated);
    setTickets((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    setReplyText('');
  };

  const FAQ_ITEMS = [
    {
      id: 'faq-1',
      question: 'How do I download my draft or verified legal documents?',
      answer:
        'Once your document order status shows "Completed", navigate to Account → My Orders to download your official PDF copy directly.',
    },
    {
      id: 'faq-2',
      question: 'What happens during a 1-on-1 Advocate Consultation?',
      answer:
        'You will connect directly with your selected enrolled Advocate via text chat, voice call, or video call for 15 minutes to review legal strategy and contract terms.',
    },
    {
      id: 'faq-3',
      question: 'Can I reschedule or request a refund for a consultation?',
      answer:
        'Consultation reschedules or refund requests can be submitted to LegalX support via email (support@legalx.in) or by submitting a ticket below.',
    },
  ];

  return (
    <SafeScreenWrapper edges={['top', 'left', 'right']}>
      <AppHeader title="Support & Helpdesk" showBack onBackPress={() => router.back()} />

      {toastNotice ? (
        <View style={styles.toast}>
          <Text style={styles.toastText}>{toastNotice}</Text>
        </View>
      ) : null}

      <View style={styles.topTabBar}>
        <Chip
          label="FAQs"
          selected={activeTab === 'faq'}
          onPress={() => setActiveTab('faq')}
        />
        <Chip
          label="Submit Ticket"
          selected={activeTab === 'create'}
          onPress={() => setActiveTab('create')}
        />
        <Chip
          label={`My Tickets (${tickets.length})`}
          selected={activeTab === 'my_tickets'}
          onPress={() => setActiveTab('my_tickets')}
        />
      </View>

      {activeTab === 'faq' && (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
          <View style={styles.contactBanner}>
            <View style={styles.contactBox}>
              <SymbolView
                name={{ ios: 'envelope.fill', android: 'email', web: 'email' }}
                size={22}
                tintColor={Colors.primary}
              />
              <Text style={styles.contactTitle}>Email Support</Text>
              <Text style={styles.contactVal}>support@legalx.in</Text>
            </View>

            <View style={styles.contactBox}>
              <SymbolView
                name={{ ios: 'phone.fill', android: 'call', web: 'call' }}
                size={22}
                tintColor={Colors.primary}
              />
              <Text style={styles.contactTitle}>Helpline</Text>
              <Text style={styles.contactVal}>1800-123-LEGAL</Text>
            </View>
          </View>

          <View style={styles.sectionBlock}>
            <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
            <FaqAccordion items={FAQ_ITEMS} />
          </View>

          <PrimaryButton
            label="Need More Help? Submit Ticket"
            onPress={() => setActiveTab('create')}
            testID="open-create-ticket-tab"
          />
        </ScrollView>
      )}

      {activeTab === 'create' && (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
          <View style={styles.formCard}>
            <Text style={styles.cardHeading}>Create Support Ticket</Text>
            <Text style={styles.cardSub}>Select issue category and describe your inquiry.</Text>

            <Text style={styles.fieldLabel}>Issue Category</Text>
            <View style={styles.chipGrid}>
              {TICKET_CATEGORIES.map((cat) => (
                <Chip
                  key={cat}
                  label={cat}
                  selected={selectedCategory === cat}
                  onPress={() => setSelectedCategory(cat)}
                />
              ))}
            </View>

            <AppTextInput
              label="Subject / Topic"
              value={subject}
              onChangeText={setSubject}
              placeholder="e.g. Question about order #LX-ORD-8492"
              testID="support-subject-input"
            />

            <AppTextInput
              label="Description"
              value={description}
              onChangeText={setDescription}
              placeholder="Describe your query or issue in detail..."
              multiline
              numberOfLines={4}
              testID="support-description-input"
            />

            <View style={styles.attachmentRow}>
              <SecondaryButton
                label={attachedFile ? `File: ${attachedFile}` : "Attach Screenshot / PDF (Optional)"}
                onPress={handlePickAttachment}
                style={styles.attachBtn}
                testID="attach-file-button"
              />
            </View>

            <PrimaryButton
              label="Submit Ticket"
              onPress={handleCreateTicket}
              testID="support-submit-button"
            />
          </View>
        </ScrollView>
      )}

      {activeTab === 'my_tickets' && (
        <View style={styles.ticketsContainer}>
          <View style={styles.filterBar}>
            {(['All', 'Open', 'In Progress', 'Resolved', 'Closed'] as const).map((status) => (
              <Chip
                key={status}
                label={status}
                selected={ticketFilter === status}
                onPress={() => setTicketFilter(status)}
              />
            ))}
          </View>

          <FlatList
            data={filteredTickets}
            renderItem={({ item }) => (
              <View style={styles.ticketCard}>
                <View style={styles.ticketHeader}>
                  <View>
                    <Text style={styles.ticketId}>{item.id}</Text>
                    <Text style={styles.ticketSubject}>{item.subject}</Text>
                  </View>
                  <Badge label={item.status} variant={getStatusBadgeVariant(item.status)} />
                </View>

                <Text style={styles.ticketDesc} numberOfLines={2}>
                  {item.description}
                </Text>

                <View style={styles.ticketFooter}>
                  <Text style={styles.ticketDate}>
                    Category: {item.category} • {item.date}
                  </Text>
                  <SecondaryButton
                    label="View Conversation"
                    onPress={() => setSelectedTicket(item)}
                    style={styles.viewTicketBtn}
                    testID={`view-ticket-${item.id}`}
                  />
                </View>
              </View>
            )}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListEmptyComponent={
              <EmptyState
                title="No Support Tickets"
                description="You have no support tickets under this status filter."
                actionLabel="Create Support Ticket"
                onActionPress={() => setActiveTab('create')}
              />
            }
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}

      <Modal
        visible={Boolean(selectedTicket)}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedTicket(null)}
      >
        {selectedTicket && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <View>
                  <Text style={styles.modalTitle}>{selectedTicket.subject}</Text>
                  <Text style={styles.modalSub}>
                    {selectedTicket.id} • {selectedTicket.category}
                  </Text>
                </View>
                <Pressable onPress={() => setSelectedTicket(null)} style={styles.closeBtn}>
                  <SymbolView
                    name={{ ios: 'xmark.circle.fill', android: 'cancel', web: 'cancel' }}
                    size={24}
                    tintColor={Colors.textSecondary}
                  />
                </Pressable>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.modalScroll}>
                <View style={styles.messagesBlock}>
                  {selectedTicket.messages.map((msg, idx) => (
                    <View
                      key={idx}
                      style={[
                        styles.msgBubble,
                        msg.sender === 'User' ? styles.msgUser : styles.msgSupport,
                      ]}
                    >
                      <Text style={styles.msgSender}>{msg.sender === 'User' ? 'You' : 'LegalX Support'}</Text>
                      <Text style={styles.msgText}>{msg.text}</Text>
                      <Text style={styles.msgTime}>{msg.time}</Text>
                    </View>
                  ))}
                </View>

                {selectedTicket.status !== 'Closed' && (
                  <View style={styles.replyBox}>
                    <AppTextInput
                      label="Reply to Support"
                      value={replyText}
                      onChangeText={setReplyText}
                      placeholder="Type your message..."
                      multiline
                    />
                    <PrimaryButton
                      label="Send Message"
                      onPress={handleSendReply}
                      testID="send-reply-button"
                    />
                  </View>
                )}
              </ScrollView>
            </View>
          </View>
        )}
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
    gap: Spacing.xl,
  },
  toast: {
    backgroundColor: Colors.ink,
    marginHorizontal: Layout.screenPaddingHWide,
    marginTop: Spacing.xs,
    padding: Spacing.sm,
    borderRadius: Radii.button,
    alignItems: 'center',
  },
  toastText: {
    fontSize: FontSize.bodySmall,
    color: Colors.surfaceAlt,
    fontWeight: FontWeight.medium,
  },
  topTabBar: {
    flexDirection: 'row',
    paddingHorizontal: Layout.screenPaddingHWide,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  contactBanner: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  contactBox: {
    flex: 1,
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radii.card,
    padding: Spacing.md,
    alignItems: 'center',
    gap: 4,
    ...Shadows.card,
  },
  contactTitle: {
    fontSize: FontSize.bodySmall,
    color: Colors.textSecondary,
  },
  contactVal: {
    fontSize: FontSize.bodySmall,
    fontWeight: FontWeight.semibold,
    color: Colors.ink,
  },
  sectionBlock: {
    gap: Spacing.md,
  },
  sectionTitle: {
    ...Typography.h2,
    fontSize: 18,
    color: Colors.ink,
  },
  formCard: {
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radii.card,
    padding: Spacing.lg,
    gap: Spacing.md,
    ...Shadows.card,
  },
  cardHeading: {
    ...Typography.h2,
    fontSize: 20,
    color: Colors.ink,
  },
  cardSub: {
    fontSize: FontSize.bodySmall,
    color: Colors.textSecondary,
    marginTop: -Spacing.xs,
  },
  fieldLabel: {
    fontSize: FontSize.bodySmall,
    fontWeight: FontWeight.semibold,
    color: Colors.ink,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  attachmentRow: {
    marginVertical: 2,
  },
  attachBtn: {
    width: '100%',
  },
  ticketsContainer: {
    flex: 1,
  },
  filterBar: {
    flexDirection: 'row',
    paddingHorizontal: Layout.screenPaddingHWide,
    paddingVertical: Spacing.xs,
    gap: Spacing.sm,
    flexWrap: 'wrap',
  },
  listContent: {
    paddingHorizontal: Layout.screenPaddingHWide,
    paddingVertical: Spacing.md,
    paddingBottom: Spacing.xxl + 20,
  },
  ticketCard: {
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radii.card,
    padding: Spacing.md,
    gap: Spacing.sm,
    ...Shadows.card,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  ticketId: {
    fontSize: 11,
    fontWeight: FontWeight.semibold,
    color: Colors.primary,
  },
  ticketSubject: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.semibold,
    color: Colors.ink,
  },
  ticketDesc: {
    fontSize: FontSize.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  ticketFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  ticketDate: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  viewTicketBtn: {
    paddingVertical: 4,
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
    fontSize: 18,
    color: Colors.ink,
  },
  modalSub: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  closeBtn: {
    padding: 4,
  },
  modalScroll: {
    gap: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  messagesBlock: {
    gap: Spacing.sm,
  },
  msgBubble: {
    padding: Spacing.md,
    borderRadius: Radii.card,
    gap: 4,
    maxWidth: '85%',
  },
  msgUser: {
    backgroundColor: '#FEFCF5',
    borderWidth: 1,
    borderColor: Colors.primary,
    alignSelf: 'flex-end',
  },
  msgSupport: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignSelf: 'flex-start',
  },
  msgSender: {
    fontSize: 11,
    fontWeight: FontWeight.semibold,
    color: Colors.ink,
  },
  msgText: {
    fontSize: FontSize.bodySmall,
    color: Colors.ink,
    lineHeight: 20,
  },
  msgTime: {
    fontSize: 10,
    color: Colors.textSecondary,
    alignSelf: 'flex-end',
  },
  replyBox: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: Radii.card,
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
});
