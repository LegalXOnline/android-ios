/**
 * VerificationLandingScreen — Premium V1 Plan Selection
 *
 * Displays Header, Subtitle, and ONLY TWO verification plans:
 *   - Plan 1: AI + Expert Review (₹99)
 *   - Plan 2: Expert Review + Consultation (₹499)
 */
import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppHeader, Badge, PrimaryButton, SafeScreenWrapper } from '@shared/components';
import { Colors, FontSize, FontWeight, Layout, Radii, Shadows, Spacing, Typography } from '@theme';

import { VERIFICATION_PLANS, useVerificationStore, type VerificationPlanId } from './verification.store';

export function VerificationLandingScreen() {
  const router = useRouter();
  const [storeState, setStoreState] = useVerificationStore();

  const selectedPlanId = storeState.selectedPlan;

  const handleSelectPlan = (planId: VerificationPlanId) => {
    setStoreState({ selectedPlan: planId });
  };

  const handleContinue = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    router.push('/verification/upload' as any);
  };

  return (
    <SafeScreenWrapper edges={['top', 'left', 'right']}>
      <AppHeader
        title="Document Verification"
        showBack
        onBackPress={() => router.back()}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header subtitle */}
        <View style={styles.subtitleBlock}>
          <Text style={styles.heading}>Choose Verification Plan</Text>
          <Text style={styles.subtitle}>
            Select the review package that best fits your document audit requirements.
          </Text>
        </View>

        {/* Plan 1: AI + Expert Review (₹99) */}
        <PlanCard
          title={VERIFICATION_PLANS.REVIEW_ONLY.title}
          priceLine={VERIFICATION_PLANS.REVIEW_ONLY.priceLine}
          unitLabel="/ document"
          includes={VERIFICATION_PLANS.REVIEW_ONLY.includes}
          isSelected={selectedPlanId === 'review_only'}
          onSelect={() => handleSelectPlan('review_only')}
          badgeText="POPULAR"
        />

        {/* Plan 2: Expert Review + Consultation (₹499) */}
        <PlanCard
          title={VERIFICATION_PLANS.REVIEW_CONSULTATION.title}
          priceLine={VERIFICATION_PLANS.REVIEW_CONSULTATION.priceLine}
          unitLabel="/ document + call"
          includes={VERIFICATION_PLANS.REVIEW_CONSULTATION.includes}
          isSelected={selectedPlanId === 'review_consultation'}
          onSelect={() => handleSelectPlan('review_consultation')}
          badgeText="RECOMMENDED"
          isRecommended
        />

        {/* Large Continue Button at Bottom */}
        <View style={styles.ctaContainer}>
          <PrimaryButton
            label="Continue to Upload"
            onPress={handleContinue}
            testID="landing-continue-button"
          />
        </View>
      </ScrollView>
    </SafeScreenWrapper>
  );
}

function PlanCard({
  title,
  priceLine,
  unitLabel,
  includes,
  isSelected,
  onSelect,
  badgeText,
  isRecommended = false,
}: {
  title: string;
  priceLine: string;
  unitLabel: string;
  includes: readonly string[];
  isSelected: boolean;
  onSelect: () => void;
  badgeText?: string;
  isRecommended?: boolean;
}) {
  return (
    <Pressable
      onPress={onSelect}
      accessibilityRole="radio"
      accessibilityState={{ checked: isSelected }}
      accessibilityLabel={`${title}, ${priceLine}`}
      style={({ pressed }) => [
        styles.planCard,
        isSelected && styles.planCardSelected,
        isRecommended && !isSelected && styles.planCardRecommended,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.cardTopRow}>
        <View style={styles.radioRow}>
          <View style={[styles.radioCircle, isSelected && styles.radioCircleSelected]}>
            {isSelected && <View style={styles.radioDot} />}
          </View>
          <View style={styles.titleBlock}>
            <Text style={styles.planTitle}>{title}</Text>
            <View style={styles.priceRow}>
              <Text style={styles.planPrice}>{priceLine}</Text>
              <Text style={styles.unitLabel}>{unitLabel}</Text>
            </View>
          </View>
        </View>

        {badgeText && (
          <Badge
            label={badgeText}
            variant={isSelected || isRecommended ? 'success' : 'default'}
          />
        )}
      </View>

      <View style={styles.divider} />

      <View style={styles.includesList}>
        <Text style={styles.includesHeading}>Included Services:</Text>
        {includes.map((item, idx) => (
          <View key={`inc-${idx}`} style={styles.includeRow}>
            <View style={styles.checkIconBox}>
              <SymbolView
                name={{ ios: 'checkmark', android: 'check', web: 'check' }}
                size={12}
                tintColor={isSelected ? Colors.success : Colors.primary}
              />
            </View>
            <Text style={styles.includeText}>{item}</Text>
          </View>
        ))}
      </View>
    </Pressable>
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
  subtitleBlock: {
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
  planCard: {
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radii.card,
    padding: Spacing.lg,
    gap: Spacing.md,
    ...Shadows.card,
  },
  planCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: '#FEFCF5', // soft warm gold accent fill
  },
  planCardRecommended: {
    borderColor: Colors.border,
  },
  pressed: {
    opacity: 0.85,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    flex: 1,
  },
  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  radioCircleSelected: {
    borderColor: Colors.primary,
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
  },
  titleBlock: {
    gap: Spacing.xs / 2,
    flex: 1,
  },
  planTitle: {
    ...Typography.h2,
    color: Colors.ink,
    fontSize: FontSize.h2,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Spacing.xs,
  },
  planPrice: {
    ...Typography.price,
    fontSize: 22,
    color: Colors.primary,
  },
  unitLabel: {
    fontSize: FontSize.bodySmall,
    color: Colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
  },
  includesList: {
    gap: Spacing.sm,
  },
  includesHeading: {
    fontSize: FontSize.label,
    fontWeight: FontWeight.semibold,
    color: Colors.ink,
  },
  includeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  checkIconBox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#E8F8F3', // light success tint
    alignItems: 'center',
    justifyContent: 'center',
  },
  includeText: {
    ...Typography.body,
    color: Colors.ink,
    fontSize: FontSize.body,
  },
  ctaContainer: {
    marginTop: Spacing.sm,
    paddingBottom: Spacing.xxl,
  },
});
