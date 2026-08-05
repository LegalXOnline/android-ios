import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import {
  AppHeader,
  Chip,
  SafeScreenWrapper,
} from '@shared/components';
import { DEFAULT_TIME_SLOTS, getNextFiveDays } from '@shared/utils/dateTime';
import { Colors, FontSize, FontWeight, Layout, Radii, Shadows, Spacing, Typography } from '@theme';

import { StickyBottomCTA } from '../billing/components/StickyBottomCTA';
import { getBillingOrder, setBillingOrder } from '../billing/billing.store';
import {
  useVerificationStore,
  VERIFICATION_PLANS,
} from './verification.store';

const LANGUAGES = ['English', 'Hindi', 'Bengali', 'Marathi', 'Tamil', 'Telugu', 'Kannada'];

export function ConsultationDetailsScreen() {
  const router = useRouter();
  const [storeState, setStoreState] = useVerificationStore();

  const dynamicDates = getNextFiveDays();
  const selectedDate = storeState.consultationDate || dynamicDates[0].val;
  const selectedTime = storeState.consultationTime || DEFAULT_TIME_SLOTS[0];

  const handleSelectMode = (mode: 'Chat' | 'Voice' | 'Video') => {
    setStoreState({ consultationType: mode });
  };

  const handleSelectDate = (dateStr: string) => {
    setStoreState({ consultationDate: dateStr });
  };

  const handleSelectTime = (timeStr: string) => {
    setStoreState({ consultationTime: timeStr });
  };

  const handleSelectLanguage = (lang: string) => {
    setStoreState({ consultationLanguage: lang });
  };

  const handleContinueToBilling = () => {
    const plan = VERIFICATION_PLANS.REVIEW_CONSULTATION;
    const price = plan.priceNumeric;

    const existing = getBillingOrder();
    setBillingOrder({
      order_type: 'verification',
      item_id: plan.id,
      item_title: `Verification + Consultation (${plan.title})`,
      package_name: plan.title,
      price,
      mode: storeState.consultationType,
      date_time: `${selectedDate} at ${selectedTime}`,
      uploaded_file_name: 'Property_Sale_Deed_Draft.pdf',
      discount_amount: 0,
      tax_amount: Math.round(price * 0.18),
      total_amount: Math.round(price * 1.18),
      user_name: existing.user_name || 'Prince Kumar',
      user_email: existing.user_email || 'prince.kumar@example.com',
      user_phone: existing.user_phone || '+91 98765 43210',
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    router.push('/billing' as any);
  };

  return (
    <SafeScreenWrapper edges={['top', 'left', 'right']}>
      <AppHeader
        title="Consultation Details"
        showBack
        onBackPress={() => router.back()}
      />

      <View style={styles.container}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerBlock}>
            <Text style={styles.heading}>Schedule Advocate Review</Text>
            <Text style={styles.subtitle}>
              Choose your preferred communication mode and consultation slot for your document review.
            </Text>
          </View>

          {/* Selection summary — helps user see current choices at a glance */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Your Selection</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryKey}>Mode</Text>
              <Text style={styles.summaryVal}>{storeState.consultationType} Call</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryKey}>Date</Text>
              <Text style={styles.summaryVal}>{selectedDate}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryKey}>Time</Text>
              <Text style={styles.summaryVal}>{selectedTime}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryKey}>Language</Text>
              <Text style={styles.summaryVal}>{storeState.consultationLanguage || 'English'}</Text>
            </View>
          </View>

          {/* Consultation Mode — full-width chips for consistent tap targets */}
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionTitle}>Consultation Mode</Text>
            <View style={styles.modeGrid}>
              {[
                { mode: 'Chat' as const, title: 'Text Chat' },
                { mode: 'Voice' as const, title: 'Voice Call' },
                { mode: 'Video' as const, title: 'Video Call' },
              ].map((opt) => (
                <Chip
                  key={opt.mode}
                  label={opt.title}
                  selected={storeState.consultationType === opt.mode}
                  onPress={() => handleSelectMode(opt.mode)}
                />
              ))}
            </View>
          </View>

          <View style={styles.sectionBlock}>
            <Text style={styles.sectionTitle}>Select Date</Text>
            <View style={styles.chipRow}>
              {dynamicDates.map((d) => (
                <Chip
                  key={d.val}
                  label={d.label}
                  selected={selectedDate === d.val}
                  onPress={() => handleSelectDate(d.val)}
                />
              ))}
            </View>
          </View>

          <View style={styles.sectionBlock}>
            <Text style={styles.sectionTitle}>Select Time Slot</Text>
            <View style={styles.chipGrid}>
              {DEFAULT_TIME_SLOTS.map((t) => (
                <Chip
                  key={t}
                  label={t}
                  selected={selectedTime === t}
                  onPress={() => handleSelectTime(t)}
                />
              ))}
            </View>
          </View>

          <View style={styles.sectionBlock}>
            <Text style={styles.sectionTitle}>Preferred Language</Text>
            <View style={styles.chipGrid}>
              {LANGUAGES.map((lang) => (
                <Chip
                  key={lang}
                  label={lang}
                  selected={storeState.consultationLanguage === lang}
                  onPress={() => handleSelectLanguage(lang)}
                />
              ))}
            </View>
          </View>
        </ScrollView>

        <StickyBottomCTA
          label={`Proceed to Billing — ₹${VERIFICATION_PLANS.REVIEW_CONSULTATION.priceNumeric}`}
          onPress={handleContinueToBilling}
          testID="consultation-billing-button"
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
    gap: Spacing.lg,
  },
  headerBlock: {
    gap: Spacing.xs,
  },
  heading: {
    ...Typography.h1,
    fontSize: 22,
    color: Colors.ink,
  },
  subtitle: {
    ...Typography.body,
    fontSize: FontSize.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  summaryCard: {
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radii.card,
    padding: Spacing.md,
    gap: Spacing.xs,
    ...Shadows.card,
  },
  summaryLabel: {
    fontSize: FontSize.label,
    fontWeight: FontWeight.semibold,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    marginBottom: Spacing.xs / 2,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 3,
  },
  summaryKey: {
    fontSize: FontSize.bodySmall,
    color: Colors.textSecondary,
  },
  summaryVal: {
    fontSize: FontSize.bodySmall,
    fontWeight: FontWeight.semibold,
    color: Colors.ink,
  },
  sectionBlock: {
    gap: Spacing.xs,
  },
  sectionTitle: {
    ...Typography.h2,
    fontSize: 16,
    color: Colors.ink,
    marginBottom: 2,
  },
  modeGrid: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
});
