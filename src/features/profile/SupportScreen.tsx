import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import {
  AppHeader,
  AppTextInput,
  FaqAccordion,
  PrimaryButton,
  SafeScreenWrapper,
} from '@shared/components';
import { Colors, FontSize, FontWeight, Layout, Radii, Shadows, Spacing, Typography } from '@theme';

export function SupportScreen() {
  const router = useRouter();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sentNotice, setSentNotice] = useState(false);

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

  const handleSubmitTicket = () => {
    setSentNotice(true);
    setSubject('');
    setMessage('');
    setTimeout(() => setSentNotice(false), 3000);
  };

  return (
    <SafeScreenWrapper edges={['top', 'left', 'right']}>
      <AppHeader title="Support & Helpdesk" showBack onBackPress={() => router.back()} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contactBanner}>
          <View style={styles.contactBox}>
            <SymbolView
              name={{ ios: 'envelope.fill', android: 'email', web: 'email' }}
              size={24}
              tintColor={Colors.primary}
            />
            <Text style={styles.contactTitle}>Email Support</Text>
            <Text style={styles.contactVal}>support@legalx.in</Text>
          </View>

          <View style={styles.contactBox}>
            <SymbolView
              name={{ ios: 'phone.fill', android: 'call', web: 'call' }}
              size={24}
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

        <View style={styles.sectionBlock}>
          <Text style={styles.sectionTitle}>Submit a Support Ticket</Text>

          {sentNotice && (
            <View style={styles.toast}>
              <Text style={styles.toastText}>Your support ticket has been submitted!</Text>
            </View>
          )}

          <View style={styles.formCard}>
            <AppTextInput
              label="Subject / Topic"
              value={subject}
              onChangeText={setSubject}
              placeholder="e.g. Question about order #101"
              testID="support-subject-input"
            />

            <AppTextInput
              label="Message Description"
              value={message}
              onChangeText={setMessage}
              placeholder="Describe your issue or question in detail..."
              multiline
              numberOfLines={4}
              testID="support-message-input"
            />

            <PrimaryButton
              label="Submit Ticket"
              onPress={handleSubmitTicket}
              testID="support-submit-button"
            />
          </View>
        </View>
      </ScrollView>
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
  toast: {
    backgroundColor: Colors.success,
    padding: Spacing.sm,
    borderRadius: Radii.button,
    alignItems: 'center',
  },
  toastText: {
    fontSize: FontSize.bodySmall,
    color: Colors.surfaceAlt,
    fontWeight: FontWeight.semibold,
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
});
