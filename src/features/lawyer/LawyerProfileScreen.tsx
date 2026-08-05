import { useRouter } from 'expo-router';
import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import {
  AppHeader,
  Avatar,
  Badge,
  Chip,
  ErrorState,
  FaqAccordion,
  SafeScreenWrapper,
} from '@shared/components';
import { DEFAULT_TIME_SLOTS, getNextFiveDays } from '@shared/utils/dateTime';
import { Colors, FontSize, FontWeight, Layout, Radii, Shadows, Spacing, Typography } from '@theme';

import { StickyBottomCTA } from '../billing/components/StickyBottomCTA';
import { getBillingOrder, setBillingOrder } from '../billing/billing.store';
import { getLawyerById, type LawyerDetailPayload } from './lawyer.placeholder';

type ConsultationMode = 'Chat' | 'Voice' | 'Video';

interface OptionItem {
  mode: ConsultationMode;
  title: string;
  symbol: SymbolViewProps['name'];
  duration: string;
  getFee: (lawyer?: LawyerDetailPayload) => number;
}

const CONSULTATION_OPTIONS: OptionItem[] = [
  {
    mode: 'Chat',
    title: 'Text Chat',
    symbol: { ios: 'message.fill', android: 'chat', web: 'chat' },
    duration: '15 Min Session',
    getFee: (l) => (l ? l.fee_chat * 15 : 150),
  },
  {
    mode: 'Voice',
    title: 'Voice Call',
    symbol: { ios: 'phone.fill', android: 'call', web: 'call' },
    duration: '15 Min Session',
    getFee: (l) => (l ? l.fee_voice * 15 : 225),
  },
  {
    mode: 'Video',
    title: 'Video Call',
    symbol: { ios: 'video.fill', android: 'videocam', web: 'videocam' },
    duration: '15 Min Session',
    getFee: (l) => (l ? l.fee_video * 15 : 300),
  },
];

interface LawyerProfileScreenProps {
  lawyerId: string;
}

export function LawyerProfileScreen({ lawyerId }: LawyerProfileScreenProps) {
  const router = useRouter();
  const [selectedMode, setSelectedMode] = useState<ConsultationMode>('Video');
  const [isBookingStep, setIsBookingStep] = useState(false);

  const dynamicDates = getNextFiveDays();
  const [selectedDate, setSelectedDate] = useState(dynamicDates[0].val);
  const [selectedTime, setSelectedTime] = useState(DEFAULT_TIME_SLOTS[0]);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [clientNotes, setClientNotes] = useState('');

  const lawyer = getLawyerById(lawyerId);

  if (!lawyer) {
    return (
      <SafeScreenWrapper edges={['top', 'left', 'right']}>
        <AppHeader title="Lawyer Profile" showBack onBackPress={() => router.back()} />
        <ErrorState
          title="Lawyer Profile Not Found"
          description="The advocate profile you requested could not be located."
          onRetry={() => router.back()}
        />
      </SafeScreenWrapper>
    );
  }

  const initials = lawyer.name
    .replace('Adv. ', '')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2);

  const activeOption = CONSULTATION_OPTIONS.find((o) => o.mode === selectedMode)!;
  const currentPrice = activeOption.getFee(lawyer);

  const handleContinue = () => {
    if (!lawyer.is_available_now && !isBookingStep) {
      setIsBookingStep(true);
      return;
    }

    const existing = getBillingOrder();
    const dateTimeStr = !lawyer.is_available_now
      ? `${selectedDate} at ${selectedTime}`
      : undefined;

    setBillingOrder({
      order_type: 'consultation',
      item_id: lawyer.id,
      item_title: `Consultation with ${lawyer.name}`,
      lawyer_name: lawyer.name,
      mode: selectedMode,
      date_time: dateTimeStr,
      notes: clientNotes.trim() || undefined,
      price: currentPrice,
      discount_amount: 0,
      tax_amount: Math.round(currentPrice * 0.18),
      total_amount: Math.round(currentPrice * 1.18),
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
        title={isBookingStep ? 'Book Consultation' : 'Lawyer Profile'}
        showBack
        onBackPress={() => {
          if (isBookingStep) {
            setIsBookingStep(false);
          } else {
            router.back();
          }
        }}
      />

      <View style={styles.container}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerCard}>
            <Avatar
              uri={lawyer.photo_url}
              initials={initials}
              size="xl"
            />

            <View style={styles.headerInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.lawyerName}>{lawyer.name}</Text>
                <SymbolView
                  name={{ ios: 'checkmark.seal.fill', android: 'verified', web: 'verified' }}
                  size={20}
                  tintColor={Colors.primary}
                />
              </View>
              <Text style={styles.titleSub}>{lawyer.title}</Text>
              <Text style={styles.barNumber}>Bar Council Reg: {lawyer.bar_registration}</Text>
            </View>

            <View style={styles.metaRow}>
              <Badge label={`★ ${lawyer.rating_avg} (${lawyer.review_count} reviews)`} variant="success" />
              <Badge label={`${lawyer.experience_years} Years Experience`} variant="default" />
              {lawyer.is_available_now ? (
                <Badge label="Available Now" variant="success" />
              ) : (
                <Badge label="Offline — Book for Later" variant="warning" />
              )}
            </View>
          </View>

          {isBookingStep || !lawyer.is_available_now ? (
            <View style={styles.bookingCard}>
              <Text style={styles.sectionTitle}>Consultation Schedule Details</Text>

              <View style={styles.sectionBlock}>
                <Text style={styles.inputLabel}>Select Date</Text>
                <View style={styles.tagsWrap}>
                  {dynamicDates.map((d) => (
                    <Chip
                      key={d.val}
                      label={d.label}
                      selected={selectedDate === d.val}
                      onPress={() => setSelectedDate(d.val)}
                    />
                  ))}
                </View>
              </View>

              <View style={styles.sectionBlock}>
                <Text style={styles.inputLabel}>Select Time Slot</Text>
                <View style={styles.tagsWrap}>
                  {DEFAULT_TIME_SLOTS.map((t) => (
                    <Chip
                      key={t}
                      label={t}
                      selected={selectedTime === t}
                      onPress={() => setSelectedTime(t)}
                    />
                  ))}
                </View>
              </View>

              <View style={styles.sectionBlock}>
                <Text style={styles.inputLabel}>Consultation Mode</Text>
                <View style={styles.tagsWrap}>
                  {CONSULTATION_OPTIONS.map((opt) => (
                    <Chip
                      key={opt.mode}
                      label={opt.title}
                      selected={selectedMode === opt.mode}
                      onPress={() => setSelectedMode(opt.mode)}
                    />
                  ))}
                </View>
              </View>

              <View style={styles.sectionBlock}>
                <Text style={styles.inputLabel}>Preferred Spoken Language</Text>
                <View style={styles.tagsWrap}>
                  {lawyer.languages.map((lang) => (
                    <Chip
                      key={lang}
                      label={lang}
                      selected={selectedLanguage === lang}
                      onPress={() => setSelectedLanguage(lang)}
                    />
                  ))}
                </View>
              </View>

              <View style={styles.sectionBlock}>
                <Text style={styles.inputLabel}>Optional Notes for Advocate</Text>
                <TextInput
                  value={clientNotes}
                  onChangeText={setClientNotes}
                  placeholder="Briefly describe your legal query or case context..."
                  placeholderTextColor={Colors.textSecondary}
                  style={styles.notesInput}
                  multiline
                  numberOfLines={3}
                />
              </View>
            </View>
          ) : (
            <View style={styles.sectionBlock}>
              <Text style={styles.sectionTitle}>Select Consultation Mode</Text>

              <View style={styles.modeCardsGrid}>
                {CONSULTATION_OPTIONS.map((opt) => {
                  const isSelected = selectedMode === opt.mode;
                  const fee = opt.getFee(lawyer);

                  return (
                    <Pressable
                      key={opt.mode}
                      onPress={() => setSelectedMode(opt.mode)}
                      accessibilityRole="radio"
                      accessibilityState={{ checked: isSelected }}
                      style={({ pressed }) => [
                        styles.modeCard,
                        isSelected && styles.modeCardSelected,
                        pressed && styles.pressed,
                      ]}
                    >
                      <View style={styles.modeHeader}>
                        <View style={styles.iconCircle}>
                          <SymbolView
                            name={opt.symbol}
                            size={22}
                            tintColor={isSelected ? Colors.primary : Colors.textSecondary}
                          />
                        </View>
                        <View style={styles.modeText}>
                          <Text style={[styles.modeTitle, isSelected && styles.modeTitleSelected]}>
                            {opt.title}
                          </Text>
                          <Text style={styles.modeDuration}>{opt.duration}</Text>
                        </View>
                      </View>

                      <View style={styles.modeFeeRow}>
                        <Text style={styles.feeVal}>₹{fee}</Text>
                        <View style={[styles.radioCircle, isSelected && styles.radioCircleSelected]}>
                          {isSelected && <View style={styles.radioDot} />}
                        </View>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}

          <View style={styles.sectionBlock}>
            <Text style={styles.sectionTitle}>Practice Areas & Expertise</Text>
            <View style={styles.tagsWrap}>
              {lawyer.practice_areas.map((tag) => (
                <Chip key={tag} label={tag} />
              ))}
            </View>
          </View>

          <View style={styles.sectionBlock}>
            <Text style={styles.sectionTitle}>Languages Spoken</Text>
            <View style={styles.tagsWrap}>
              {lawyer.languages.map((lang) => (
                <Chip key={lang} label={lang} />
              ))}
            </View>
          </View>

          <View style={styles.sectionBlock}>
            <Text style={styles.sectionTitle}>Court Practice Locations</Text>
            {lawyer.courts.map((court, idx) => (
              <View key={idx} style={styles.courtRow}>
                <SymbolView
                  name={{ ios: 'building.columns.fill', android: 'account_balance', web: 'account_balance' }}
                  size={16}
                  tintColor={Colors.primary}
                />
                <Text style={styles.courtText}>{court}</Text>
              </View>
            ))}
          </View>

          <View style={styles.sectionBlock}>
            <Text style={styles.sectionTitle}>About Advocate</Text>
            <Text style={styles.bioText}>{lawyer.about}</Text>
          </View>

          <View style={styles.sectionBlock}>
            <Text style={styles.sectionTitle}>Education & Qualifications</Text>
            {lawyer.education.map((edu, idx) => (
              <View key={idx} style={styles.eduRow}>
                <SymbolView
                  name={{ ios: 'checkmark.circle.fill', android: 'check_circle', web: 'check_circle' }}
                  size={16}
                  tintColor={Colors.primary}
                />
                <Text style={styles.eduText}>{edu}</Text>
              </View>
            ))}
          </View>

          <View style={styles.sectionBlock}>
            <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
            <FaqAccordion
              items={[
                {
                  id: 'faq-l1',
                  question: 'How do I connect with the Advocate after booking?',
                  answer:
                    'Your Advocate will connect with you via chat, voice call, or video call at the scheduled session time.',
                },
              ]}
            />
          </View>
        </ScrollView>

        <StickyBottomCTA
          label={
            lawyer.is_available_now
              ? `Continue to Billing — ₹${currentPrice}`
              : isBookingStep
              ? `Proceed to Billing — ₹${currentPrice}`
              : `Book Consultation — ₹${currentPrice}`
          }
          onPress={handleContinue}
          testID="lawyer-continue-button"
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
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  lawyerName: {
    ...Typography.h1,
    fontSize: 22,
    color: Colors.ink,
  },
  titleSub: {
    fontSize: FontSize.bodySmall,
    color: Colors.primary,
    fontWeight: FontWeight.semibold,
  },
  barNumber: {
    fontSize: FontSize.bodySmall,
    color: Colors.textSecondary,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  bookingCard: {
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderRadius: Radii.card,
    padding: Spacing.md,
    gap: Spacing.md,
    ...Shadows.card,
  },
  inputLabel: {
    fontSize: FontSize.bodySmall,
    fontWeight: FontWeight.semibold,
    color: Colors.ink,
    marginBottom: 4,
  },
  notesInput: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radii.card,
    padding: Spacing.sm,
    fontSize: FontSize.bodySmall,
    color: Colors.ink,
    textAlignVertical: 'top',
  },
  sectionBlock: {
    gap: Spacing.xs,
  },
  sectionTitle: {
    ...Typography.h2,
    fontSize: 18,
    color: Colors.ink,
    marginBottom: Spacing.xs / 2,
  },
  modeCardsGrid: {
    gap: Spacing.sm,
  },
  modeCard: {
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radii.card,
    padding: Spacing.md,
    gap: Spacing.sm,
    ...Shadows.card,
  },
  modeCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: '#FEFCF5',
  },
  pressed: {
    opacity: 0.85,
  },
  modeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeText: {
    flex: 1,
    gap: 2,
  },
  modeTitle: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.semibold,
    color: Colors.ink,
  },
  modeTitleSelected: {
    color: Colors.primary,
  },
  modeDuration: {
    fontSize: FontSize.bodySmall,
    color: Colors.textSecondary,
  },
  modeFeeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  feeVal: {
    ...Typography.price,
    fontSize: 18,
    color: Colors.ink,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
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
  tagsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  courtRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: 2,
  },
  courtText: {
    fontSize: FontSize.bodySmall,
    color: Colors.ink,
  },
  bioText: {
    ...Typography.body,
    fontSize: FontSize.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  eduRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: 3,
  },
  eduText: {
    fontSize: FontSize.bodySmall,
    color: Colors.ink,
    flex: 1,
  },
});
