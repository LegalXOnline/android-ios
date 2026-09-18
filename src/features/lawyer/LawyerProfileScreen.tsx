import { useRouter, type Href } from 'expo-router';
import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import {
  AppHeader,
  Avatar,
  Badge,
  Chip,
  ErrorState,
  FaqAccordion,
  SafeScreenWrapper,
  SkeletonCard,
  SkeletonList,
  SecondaryButton,
} from '@shared/components';
import { useHideTabBar } from '@shared/components/navigation/FloatingTabBar';
import { Colors, FontSize, FontWeight, Layout, Radii, Shadows, Spacing, Typography } from '@theme';
import { useGoBack } from '@shared/hooks/useGoBack';

import { StickyBottomCTA } from '../billing/components/StickyBottomCTA';
import {
  getLawyerBySlug,
  toDetailRow,
  type LawyerDetailRow,
} from '@services/lawyers.service';
import { getWalletBalance, toCoins } from '@services/profile.service';
import {
  initiateConsultation,
  type ConsultationType,
} from '@services/consultations.service';

type ConsultationMode = 'Chat' | 'Voice' | 'Video';

interface OptionItem {
  mode: ConsultationMode;
  title: string;
  symbol: SymbolViewProps['name'];
  duration: string;
  getFee: (lawyer?: LawyerDetailRow) => number;
}

/**
 * The three ways to consult.
 *
 * getFee returns the advocate's own per-minute rate, straight from the API.
 * It used to multiply by fifteen and fall back to invented numbers, which
 * printed a fixed price the client was never charged: the server holds credit
 * up front and then bills ceil(minutes) x rate for the time actually used.
 */
const CONSULTATION_OPTIONS: OptionItem[] = [
  {
    mode: 'Chat',
    title: 'Text Chat',
    symbol: { ios: 'message.fill', android: 'chat', web: 'chat' },
    duration: 'Billed per minute',
    getFee: (l) => l?.fee_chat ?? 0,
  },
  {
    mode: 'Voice',
    title: 'Voice Call',
    symbol: { ios: 'phone.fill', android: 'call', web: 'call' },
    duration: 'Billed per minute',
    getFee: (l) => l?.fee_voice ?? 0,
  },
  {
    mode: 'Video',
    title: 'Video Call',
    symbol: { ios: 'video.fill', android: 'videocam', web: 'videocam' },
    duration: 'Billed per minute',
    getFee: (l) => l?.fee_video ?? 0,
  },
];

interface LawyerProfileScreenProps {
  lawyerId: string;
}

export function LawyerProfileScreen({ lawyerId }: LawyerProfileScreenProps) {
  useHideTabBar();
  const router = useRouter();
  const goBack = useGoBack();
  const [selectedMode, setSelectedMode] = useState<ConsultationMode>('Video');
  const [starting, setStarting] = useState(false);
  const [coins, setCoins] = useState<number | null>(null);
  const [startError, setStartError] = useState<string | null>(null);


  const [lawyer, setLawyer] = useState<LawyerDetailRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    getWalletBalance()
      .then((w) => {
        if (!cancelled) setCoins(toCoins(w.spendablePaise));
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!lawyerId) return;
    let cancelled = false;
    (async () => {
      const found = await getLawyerBySlug(lawyerId);
      if (!cancelled) {
        setLawyer(found ? toDetailRow(found) : null);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [lawyerId, attempt]);

  // While the profile is still arriving, show that it is loading. This used to
  // fall straight through to "not found" because only `lawyer` was checked, so
  // every open flashed an error for as long as the request took.
  if (loading) {
    return (
      <SafeScreenWrapper edges={['top', 'left', 'right']}>
        <AppHeader title="Lawyer Profile" showBack onBackPress={goBack} />
        <View style={styles.loadingWrap}>
          <SkeletonCard />
          <SkeletonList count={3} />
        </View>
      </SafeScreenWrapper>
    );
  }

  if (!lawyer) {
    return (
      <SafeScreenWrapper edges={['top', 'left', 'right']}>
        <AppHeader title="Lawyer Profile" showBack onBackPress={goBack} />
        <ErrorState
          title="Advocate not found"
          description="That profile could not be loaded. Check your connection and try again."
          onRetry={() => {
            setLoading(true);
            setAttempt((n) => n + 1);
          }}
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
  const currentPrice = lawyer ? activeOption.getFee(lawyer) : 0;

  // What the balance actually buys at this advocate's rate. The server holds
  // credit on the same arithmetic, so the two agree.
  const affordableMinutes =
    coins !== null && currentPrice > 0 ? Math.floor(coins / currentPrice) : null;

  // The server bills a whole minute the moment a call connects, so anything
  // under one minute's rate cannot start at all.
  const shortOfCoins = coins !== null && currentPrice > 0 && coins < currentPrice;

  /**
   * Starting a consultation is not a checkout.
   *
   * The server holds credit and opens the channel in one call, and answers
   * whether the balance covered it. Only when it did not does money come into
   * it — and that path is not live on mobile yet, so it says so rather than
   * dropping the client into a dead payment screen.
   */
  const startNow = async () => {
    const type: ConsultationType =
      selectedMode === 'Video' ? 'video' : selectedMode === 'Voice' ? 'voice' : 'chat';

    setStarting(true);
    setStartError(null);
    try {
      const result = await initiateConsultation({ lawyerId: lawyer.id, type });

      if (result.fundedBy === 'razorpay') {
        setStartError('Your LX balance ran out. Add coins from your profile to continue.');
        return;
      }

      router.push({
        pathname: '/consultation/[id]',
        params: {
          id: result.consultationId,
          name: result.lawyerName ?? lawyer.name,
          fee: String(currentPrice),
          type,
        },
      });
    } catch (err) {
      setStartError((err as Error).message);
    } finally {
      setStarting(false);
    }
  };

  return (
    <SafeScreenWrapper edges={['top', 'left', 'right']}>
      <AppHeader title="Lawyer Profile" showBack onBackPress={goBack} />

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

          {!lawyer.is_available_now ? (
            <View style={styles.bookingCard}>
              <Text style={styles.sectionTitle}>Currently offline</Text>
              <Text style={styles.offlineNote}>
                {lawyer.name} is not taking consultations right now. Booking a slot for later is
                not supported yet, so rather than take a time we cannot honour, try an advocate who
                is online.
              </Text>
              <SecondaryButton
                label="See advocates online now"
                onPress={() => router.replace('/(tabs)/talk-to-lawyer')}
              />
            </View>
          ) : (
            <View style={styles.sectionBlock}>
              <Text style={styles.sectionTitle}>Start a consultation</Text>

              <View style={styles.balanceRow}>
                <SymbolView
                  name={{ ios: 'indianrupeesign.circle.fill', android: 'paid', web: 'paid' }}
                  size={18}
                  tintColor={Colors.primary}
                />
                <Text style={styles.balanceText}>
                  {coins === null
                    ? 'Checking your LX balance…'
                    : shortOfCoins
                      ? `${coins} LX — not enough for a minute at ₹${currentPrice}/min`
                      : `${coins} LX available · about ${affordableMinutes} min of ${selectedMode.toLowerCase()}`}
                </Text>

                {shortOfCoins && (
                  <Pressable
                    onPress={() => router.push('/profile/lx-coins' as Href)}
                    accessibilityRole="button"
                    hitSlop={8}
                  >
                    <Text style={styles.addCoins}>Add coins</Text>
                  </Pressable>
                )}
              </View>

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
                        <Text style={styles.feeVal}>₹{fee}/min</Text>
                        <View style={[styles.radioCircle, isSelected && styles.radioCircleSelected]}>
                          {isSelected && <View style={styles.radioDot} />}
                        </View>
                      </View>
                    </Pressable>
                  );
                })}
              </View>

              <Text style={styles.billingNote}>
                Paid in LX coins — one coin is ₹1 — and charged by the minute for the time you
                actually use. New accounts start with 100 free coins.
              </Text>
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

        {startError && (
          <View style={styles.startError}>
            <Text style={styles.startErrorText}>{startError}</Text>
          </View>
        )}

        <StickyBottomCTA
          label={
            starting
              ? 'Connecting…'
              : !lawyer.is_available_now
                ? 'Advocate is offline'
                : shortOfCoins
                  ? 'Add coins to start'
                  : `Start ${activeOption.title} — ${currentPrice} LX/min`
          }
          onPress={() =>
            shortOfCoins ? router.push('/profile/lx-coins' as Href) : void startNow()
          }
          disabled={starting || !lawyer.is_available_now}
          testID="lawyer-continue-button"
        />
      </View>
    </SafeScreenWrapper>
  );
}

const styles = StyleSheet.create({
  loadingWrap: { padding: Spacing.md, gap: Spacing.md },
  offlineNote: {
    fontSize: FontSize.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: Radii.card,
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
  },
  balanceText: { flex: 1, fontSize: FontSize.bodySmall, color: Colors.ink },
  addCoins: { fontSize: FontSize.bodySmall, fontWeight: FontWeight.semibold, color: Colors.primary },
  billingNote: {
    fontSize: FontSize.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginTop: Spacing.sm,
  },
  startError: {
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
    padding: Spacing.md,
    borderRadius: Radii.card,
    borderWidth: 1,
    borderColor: Colors.danger,
    backgroundColor: Colors.surfaceAlt,
  },
  startErrorText: { fontSize: FontSize.bodySmall, color: Colors.danger, lineHeight: 18 },
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
