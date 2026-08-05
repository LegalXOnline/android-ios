/**
 * LawyerProfileScreen — SCR-09
 *
 * Spec: 09_Module_Talk_to_Lawyer.md §4
 * Layout:
 *   1. App Header (with back button)
 *   2. Profile Header (Avatar, Name, Title, Location, Bar Registration, Availability Badge)
 *   3. Stat Row (Rating, Experience, Consultations, Cases)
 *   4. Languages (Chips)
 *   5. About Section
 *   6. Expertise Tags (Chips)
 *   7. Education & Credentials
 *   8. Practice Areas & Courts
 *   9. Consultation Options (3 Premium Mode Cards: Chat / Voice / Video with radio state)
 *  10. Sticky Bottom CTA ("Continue") respecting Safe Area insets
 */
import { useRouter } from 'expo-router';
import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  AppHeader,
  Avatar,
  Badge,
  Chip,
  Divider,
  ErrorState,
  PrimaryButton,
  SafeScreenWrapper,
} from '@shared/components';
import { Colors, FontSize, FontWeight, Layout, Radii, Shadows, Spacing, Typography } from '@theme';

import { getLawyerById } from './lawyer.placeholder';

export type ConsultationMode = 'Chat' | 'Voice' | 'Video';

interface ModeOption {
  mode: ConsultationMode;
  title: string;
  symbol: SymbolViewProps['name'];
  duration: string;
  getFee: (lawyer: ReturnType<typeof getLawyerById>) => number;
}

const CONSULTATION_OPTIONS: ModeOption[] = [
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
  const insets = useSafeAreaInsets();
  const [selectedMode, setSelectedMode] = useState<ConsultationMode>('Video');

  const lawyer = getLawyerById(lawyerId);

  if (!lawyer) {
    return (
      <SafeScreenWrapper edges={['top', 'left', 'right']}>
        <AppHeader title="Lawyer Profile" showBack onBackPress={() => router.back()} />
        <ErrorState
          title="Lawyer Not Found"
          description="The requested advocate profile could not be found or is unavailable."
          onRetry={() => router.back()}
        />
      </SafeScreenWrapper>
    );
  }

  const initials = lawyer.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2);

  const activeOption = CONSULTATION_OPTIONS.find((o) => o.mode === selectedMode)!;
  const currentPrice = activeOption.getFee(lawyer);

  const handleContinue = () => {
    // Navigation per spec: Lawyer Listing -> Lawyer Profile -> Continue -> Consultation Placeholder
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    router.push('/(tabs)/talk-to-lawyer' as any);
  };

  return (
    <SafeScreenWrapper edges={['top', 'left', 'right']}>
      <AppHeader title="Lawyer Profile" showBack onBackPress={() => router.back()} />

      <View style={styles.container}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* 1. Profile Header Block */}
          <View style={styles.headerCard}>
            <Avatar
              uri={lawyer.photo_url}
              initials={initials}
              size="xl"
              accessibilityLabel={`${lawyer.name} profile photo`}
            />

            <View style={styles.headerInfo}>
              <View style={styles.titleBadgeRow}>
                <Text style={styles.name}>{lawyer.name}</Text>
                {lawyer.is_available_now && (
                  <Badge label="Available Today" variant="success" />
                )}
              </View>

              <Text style={styles.lawyerTitle}>{lawyer.title}</Text>

              <Text style={styles.regInfo}>
                {lawyer.location} • Reg No: {lawyer.bar_registration}
              </Text>
            </View>
          </View>

          {/* 2. Stats Grid (4 items) */}
          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <View style={styles.statIconRow}>
                <SymbolView
                  name={{ ios: 'star.fill', android: 'star', web: 'star' }}
                  size={16}
                  tintColor={Colors.primary}
                />
                <Text style={styles.statValue}>{lawyer.rating_avg.toFixed(1)}</Text>
              </View>
              <Text style={styles.statLabel}>{lawyer.review_count} reviews</Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statValue}>{lawyer.experience_years} Yrs</Text>
              <Text style={styles.statLabel}>Experience</Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statValue}>{lawyer.consultations_count}+</Text>
              <Text style={styles.statLabel}>Consultations</Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statValue}>{lawyer.cases_count}+</Text>
              <Text style={styles.statLabel}>Cases Handled</Text>
            </View>
          </View>

          <Divider />

          {/* 3. Spoken Languages */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Languages Spoken</Text>
            <View style={styles.chipRow}>
              {lawyer.languages.map((lang) => (
                <Chip key={lang} label={lang} />
              ))}
            </View>
          </View>

          {/* 4. About Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About Advocate</Text>
            <Text style={styles.aboutText}>{lawyer.about}</Text>
          </View>

          {/* 5. Expertise Tags */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Key Expertise</Text>
            <View style={styles.chipRow}>
              {lawyer.expertise_tags.map((tag) => (
                <Chip key={tag} label={tag} />
              ))}
            </View>
          </View>

          <Divider />

          {/* 6. Education & Credentials */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education & Credentials</Text>
            <View style={styles.bulletList}>
              {lawyer.education.map((edu, idx) => (
                <View key={`edu-${idx}`} style={styles.bulletRow}>
                  <SymbolView
                    name={{ ios: 'checkmark.seal.fill', android: 'verified', web: 'verified' }}
                    size={16}
                    tintColor={Colors.primary}
                  />
                  <Text style={styles.bulletText}>{edu}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* 7. Practice Areas & Courts */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Practice Courts & Tribunals</Text>
            <View style={styles.bulletList}>
              {lawyer.courts.map((court, idx) => (
                <View key={`court-${idx}`} style={styles.bulletRow}>
                  <SymbolView
                    name={{ ios: 'building.columns.fill', android: 'account_balance', web: 'account_balance' }}
                    size={16}
                    tintColor={Colors.textSecondary}
                  />
                  <Text style={styles.bulletText}>{court}</Text>
                </View>
              ))}
            </View>
          </View>

          <Divider />

          {/* 8. Consultation Options (3 Premium Cards) */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Consultation Mode</Text>
            <Text style={styles.sectionSubtitle}>
              Choose your preferred channel for a 1-on-1 private legal consultation.
            </Text>

            <View style={styles.modeContainer}>
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
                    <View style={styles.modeIconBox}>
                      <SymbolView
                        name={opt.symbol}
                        size={22}
                        tintColor={isSelected ? Colors.primary : Colors.textSecondary}
                      />
                    </View>

                    <View style={styles.modeTextInfo}>
                      <Text style={styles.modeTitle}>{opt.title}</Text>
                      <Text style={styles.modeDuration}>{opt.duration}</Text>
                    </View>

                    <View style={styles.modePriceBox}>
                      <Text style={styles.modePrice}>₹{fee}</Text>
                      <View style={[styles.radioCircle, isSelected && styles.radioCircleSelected]}>
                        {isSelected && <View style={styles.radioDot} />}
                      </View>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </ScrollView>

        {/* 9. GLOBAL STICKY BOTTOM CTA BAR */}
        <View style={[styles.stickyCtaBar, { paddingBottom: Math.max(insets.bottom, Spacing.md) }]}>
          <PrimaryButton
            label={`Continue (${selectedMode} — ₹${currentPrice})`}
            onPress={handleContinue}
            testID="lawyer-profile-continue-button"
          />
        </View>
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
    paddingTop: Spacing.md,
    paddingBottom: 110, // Generous padding so content scrolls above sticky bottom CTA
    gap: Spacing.lg,
  },
  headerCard: {
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radii.card,
    padding: Spacing.lg,
    alignItems: 'center',
    textAlign: 'center',
    gap: Spacing.md,
    ...Shadows.card,
  },
  headerInfo: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  titleBadgeRow: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  name: {
    ...Typography.h1,
    fontSize: 22,
    color: Colors.ink,
    textAlign: 'center',
  },
  lawyerTitle: {
    ...Typography.body,
    fontWeight: FontWeight.medium,
    color: Colors.primary,
    textAlign: 'center',
  },
  regInfo: {
    fontSize: FontSize.bodySmall,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radii.card,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xs,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    borderRightWidth: 1,
    borderRightColor: Colors.border,
  },
  statIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: FontWeight.semibold,
    color: Colors.ink,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  section: {
    gap: Spacing.sm,
  },
  sectionTitle: {
    ...Typography.h2,
    fontSize: 18,
    color: Colors.ink,
  },
  sectionSubtitle: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  aboutText: {
    ...Typography.body,
    color: Colors.ink,
    lineHeight: 22,
  },
  bulletList: {
    gap: Spacing.sm,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  bulletText: {
    ...Typography.body,
    color: Colors.ink,
    flex: 1,
  },
  modeContainer: {
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  modeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radii.card,
    padding: Spacing.md,
    gap: Spacing.md,
    ...Shadows.card,
  },
  modeCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: '#FEFCF5',
  },
  pressed: {
    opacity: 0.85,
  },
  modeIconBox: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeTextInfo: {
    flex: 1,
    gap: 2,
  },
  modeTitle: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.semibold,
    color: Colors.ink,
  },
  modeDuration: {
    fontSize: FontSize.bodySmall,
    color: Colors.textSecondary,
  },
  modePriceBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  modePrice: {
    ...Typography.price,
    fontSize: 18,
    color: Colors.primary,
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
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
  stickyCtaBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingHorizontal: Layout.screenPaddingHWide,
    paddingTop: Spacing.md,
    ...Shadows.card,
  },
});
