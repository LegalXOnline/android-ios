/**
 * VerificationCard — Standalone Premium Full-Width Card for Document Verification Entry.
 *
 * Spec & Requirements:
 *   - Shield / Security Icon
 *   - Title: "Need Document Verification?"
 *   - Subtitle: "Already have a legal document? Get it reviewed by AI + Legal Experts before using it."
 *   - Benefits: AI + Expert Review, Risk Detection, Clause Analysis, Legal Suggestions
 *   - Price: "Starting from ₹99"
 *   - CTA: "Verify Existing Document"
 *   - Navigation: Navigates to /verification on card / CTA press
 */
import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@shared/components';
import { Colors, FontSize, FontWeight, Radii, Shadows, Spacing, Typography } from '@theme';

interface VerificationCardProps {
  onPress: () => void;
}

const BENEFITS = [
  'AI + Expert Review',
  'Risk Detection',
  'Clause Analysis',
  'Legal Suggestions',
];

export function VerificationCard({ onPress }: VerificationCardProps) {
  return (
    <View style={styles.card}>
      {/* ─── Card Body Pressable ─── */}
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel="Need Document Verification? Already have a legal document? Get it reviewed by AI and Legal Experts. Starting from ₹99."
        style={({ pressed }) => [styles.cardBody, pressed && styles.pressed]}
      >
        {/* Top Header Row with Icon & Titles */}
        <View style={styles.headerRow}>
          <View style={styles.shieldIconCircle}>
            <SymbolView
              name={{ ios: 'shield.checkerboard', android: 'verified_user', web: 'verified_user' }}
              size={24}
              tintColor={Colors.primary}
            />
          </View>

          <View style={styles.headerTextInfo}>
            <Text style={styles.title}>Need Document Verification?</Text>
            <Text style={styles.subtitle}>
              Already have a legal document? Get it reviewed by AI + Legal Experts before using it.
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Benefits List (2x2 Grid) */}
        <View style={styles.benefitsGrid}>
          {BENEFITS.map((benefit, idx) => (
            <View key={`b-${idx}`} style={styles.benefitRow}>
              <View style={styles.checkCircle}>
                <SymbolView
                  name={{ ios: 'checkmark', android: 'check', web: 'check' }}
                  size={12}
                  tintColor={Colors.success}
                />
              </View>
              <Text style={styles.benefitText}>{benefit}</Text>
            </View>
          ))}
        </View>

        <View style={styles.divider} />

        {/* Price Row */}
        <View style={styles.priceBlock}>
          <Text style={styles.priceLabel}>Price</Text>
          <Text style={styles.priceValue}>Starting from ₹99</Text>
        </View>
      </Pressable>

      {/* ─── Primary CTA Button (Sibling to cardBody inside outer View) ─── */}
      <View style={styles.ctaWrapper}>
        <PrimaryButton
          label="Verify Existing Document"
          onPress={onPress}
          testID="verification-card-cta"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FEFCF5', // soft warm surface background
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radii.card,
    padding: Spacing.lg,
    gap: Spacing.md,
    ...Shadows.card,
  },
  cardBody: {
    gap: Spacing.md,
  },
  pressed: {
    opacity: 0.88,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  shieldIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextInfo: {
    flex: 1,
    gap: Spacing.xs / 2,
  },
  title: {
    ...Typography.h2,
    fontSize: FontSize.h2,
    color: Colors.ink,
  },
  subtitle: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
  },
  benefitsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: Spacing.sm,
    columnGap: Spacing.md,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    width: '46%', // 2 columns
  },
  checkCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#E8F8F3', // soft green tint
    alignItems: 'center',
    justifyContent: 'center',
  },
  benefitText: {
    fontSize: FontSize.bodySmall,
    fontWeight: FontWeight.medium,
    color: Colors.ink,
  },
  footerRow: {
    gap: Spacing.sm,
    paddingTop: Spacing.xs / 2,
  },
  priceBlock: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  priceLabel: {
    fontSize: FontSize.bodySmall,
    color: Colors.textSecondary,
  },
  priceValue: {
    ...Typography.price,
    fontSize: FontSize.h2,
    color: Colors.primary,
  },
  ctaWrapper: {
    width: '100%',
  },
});
