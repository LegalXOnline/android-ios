/**
 * ConsultationDetailsScreen — Appointment Booking Style UI
 *
 * ONLY shown when user selected Plan 2 (Expert Review + Consultation).
 * Fields:
 *   - Consultation Type (Chat / Voice / Video with icons)
 *   - Date (Maximum 5 days ahead)
 *   - Time Slot
 *   - Language
 *   - Summary Card (Verification Price, Consultation Price, Total)
 *   - Continue Button at bottom
 */
import { useRouter } from 'expo-router';
import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppHeader, Chip, PrimaryButton, SafeScreenWrapper } from '@shared/components';
import { Colors, FontSize, FontWeight, Layout, Radii, Shadows, Spacing, Typography } from '@theme';

import { VERIFICATION_PLANS, useVerificationStore } from './verification.store';

interface ModeOption {
  type: 'Chat' | 'Voice' | 'Video';
  symbol: SymbolViewProps['name'];
  label: string;
}

const CONSULTATION_MODES: ModeOption[] = [
  {
    type: 'Chat',
    label: 'Text Chat',
    symbol: { ios: 'message.fill', android: 'chat', web: 'chat' },
  },
  {
    type: 'Voice',
    label: 'Voice Call',
    symbol: { ios: 'phone.fill', android: 'call', web: 'call' },
  },
  {
    type: 'Video',
    label: 'Video Call',
    symbol: { ios: 'video.fill', android: 'videocam', web: 'videocam' },
  },
];

const DATE_OPTIONS = ['Today', 'Tomorrow', 'In 2 Days', 'In 3 Days', 'In 4 Days'];

const TIME_SLOTS = [
  '10:00 AM',
  '11:30 AM',
  '02:00 PM',
  '04:30 PM',
  '06:00 PM',
];

const LANGUAGES = ['English', 'Hindi', 'Bengali', 'Marathi', 'Tamil', 'Telugu', 'Kannada'];

export function ConsultationDetailsScreen() {
  const router = useRouter();
  const [storeState, setStoreState] = useVerificationStore();

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
    // Navigates to Billing placeholder as per IA spec
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    router.push('/(tabs)/documentation' as any);
  };

  const planPrice = VERIFICATION_PLANS.REVIEW_CONSULTATION.priceNumeric;

  return (
    <SafeScreenWrapper edges={['top', 'left', 'right']}>
      <AppHeader
        title="Consultation Details"
        showBack
        onBackPress={() => router.back()}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Heading */}
        <View style={styles.headerBlock}>
          <Text style={styles.heading}>Schedule Consultation</Text>
          <Text style={styles.subtitle}>
            Book your 15-minute 1-on-1 legal review session with an expert.
          </Text>
        </View>

        {/* 1. Consultation Type Cards */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionTitle}>1. Select Consultation Mode</Text>
          <View style={styles.modeRow}>
            {CONSULTATION_MODES.map((option) => {
              const isSelected = storeState.consultationType === option.type;
              return (
                <Pressable
                  key={option.type}
                  onPress={() => handleSelectMode(option.type)}
                  accessibilityRole="button"
                  accessibilityLabel={option.label}
                  style={({ pressed }) => [
                    styles.modeCard,
                    isSelected && styles.modeCardSelected,
                    pressed && styles.pressed,
                  ]}
                >
                  <SymbolView
                    name={option.symbol}
                    size={22}
                    tintColor={isSelected ? Colors.primary : Colors.textSecondary}
                  />
                  <Text style={[styles.modeLabel, isSelected && styles.modeLabelSelected]}>
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* 2. Date Selection (Next 5 days) */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionTitle}>2. Select Date (Next 5 Days)</Text>
          <View style={styles.chipRow}>
            {DATE_OPTIONS.map((dateStr) => (
              <Chip
                key={dateStr}
                label={dateStr}
                selected={storeState.consultationDate === dateStr}
                onPress={() => handleSelectDate(dateStr)}
              />
            ))}
          </View>
        </View>

        {/* 3. Time Selection */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionTitle}>3. Select Time Slot</Text>
          <View style={styles.chipRow}>
            {TIME_SLOTS.map((timeStr) => (
              <Chip
                key={timeStr}
                label={timeStr}
                selected={storeState.consultationTime === timeStr}
                onPress={() => handleSelectTime(timeStr)}
              />
            ))}
          </View>
        </View>

        {/* 4. Language Selection */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionTitle}>4. Preferred Language</Text>
          <View style={styles.chipRow}>
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

        {/* 5. Summary Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Appointment & Order Summary</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Verification Plan ({VERIFICATION_PLANS.REVIEW_CONSULTATION.title})</Text>
            <Text style={styles.summaryVal}>₹{planPrice}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>15-Min {storeState.consultationType} Consultation</Text>
            <Text style={styles.summaryValIncluded}>Included (₹0)</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Slot</Text>
            <Text style={styles.summaryVal}>{storeState.consultationDate} at {storeState.consultationTime}</Text>
          </View>

          <View style={styles.summaryDivider} />

          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalVal}>₹{planPrice}</Text>
          </View>
        </View>

        {/* Primary CTA at Bottom */}
        <View style={styles.ctaContainer}>
          <PrimaryButton
            label={`Continue to Billing — ₹${planPrice}`}
            onPress={handleContinueToBilling}
            testID="consultation-continue-button"
          />
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
    gap: Spacing.xl,
  },
  headerBlock: {
    gap: Spacing.xs,
  },
  heading: {
    ...Typography.h1,
    color: Colors.ink,
    fontSize: 24,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  sectionBlock: {
    gap: Spacing.sm,
  },
  sectionTitle: {
    ...Typography.h2,
    color: Colors.ink,
  },
  modeRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  modeCard: {
    flex: 1,
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radii.card,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    ...Shadows.card,
  },
  modeCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: '#FEFCF5',
  },
  modeLabel: {
    fontSize: FontSize.label,
    fontWeight: FontWeight.medium,
    color: Colors.ink,
    textAlign: 'center',
  },
  modeLabelSelected: {
    color: Colors.primary,
    fontWeight: FontWeight.semibold,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  summaryCard: {
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radii.card,
    padding: Layout.cardPadding,
    gap: Spacing.sm,
    ...Shadows.card,
    marginTop: Spacing.xs,
  },
  summaryTitle: {
    ...Typography.h2,
    color: Colors.ink,
    marginBottom: Spacing.xs / 2,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summaryLabel: {
    ...Typography.body,
    color: Colors.textSecondary,
    flex: 1,
  },
  summaryVal: {
    ...Typography.body,
    fontWeight: FontWeight.medium,
    color: Colors.ink,
  },
  summaryValIncluded: {
    ...Typography.body,
    fontWeight: FontWeight.semibold,
    color: Colors.success,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.xs,
  },
  totalLabel: {
    ...Typography.h2,
    color: Colors.ink,
  },
  totalVal: {
    ...Typography.price,
    fontSize: 22,
    color: Colors.primary,
  },
  ctaContainer: {
    marginTop: Spacing.sm,
    paddingBottom: Spacing.xxl,
  },
  pressed: {
    opacity: 0.8,
  },
});
