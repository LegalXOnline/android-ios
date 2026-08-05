/**
 * LawyerCard — Clean, Premium Marketplace Listing Card.
 *
 * Spec & Requirements:
 * - Avatar, Name, Rating (star + number + count), Experience, Inline Availability Dot.
 * - Max 2 Practice Areas as subtle tags.
 * - Max 2 Languages as plain text ("English, Hindi").
 * - Starting price line ("Starting from ₹X/min") + "View Profile" secondary CTA button.
 * - Top-right Favourite heart button.
 * - Web compliant: Sibling interactive elements to avoid nested HTML <button> errors.
 */
import { SymbolView } from 'expo-symbols';
import { memo } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { Colors, FontSize, FontWeight, Radii, Shadows, Spacing, Typography } from '@theme';
import { Avatar } from '../primitives/Avatar';
import { SecondaryButton } from '../primitives/SecondaryButton';

export interface LawyerCardData {
  id: string;
  name: string;
  photo_url: string | null;
  experience_years: number;
  rating_avg: number;
  review_count: number;
  languages: string[];
  practice_areas: string[];
  /** Per-minute rates in INR */
  fee_chat: number;
  fee_voice: number;
  fee_video: number;
  is_available_now: boolean;
}

export interface LawyerCardProps {
  lawyer: LawyerCardData;
  onPress: () => void;
  onFavouritePress: () => void;
  isFavourited?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export const LawyerCard = memo(function LawyerCard({
  lawyer,
  onPress,
  onFavouritePress,
  isFavourited = false,
  style,
  testID,
}: LawyerCardProps) {
  const initials = lawyer.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2);

  // Maximum 2 practice areas & languages for clean listing view
  const topPracticeAreas = lawyer.practice_areas.slice(0, 2);
  const topLanguages = lawyer.languages.slice(0, 2).join(', ');

  // Calculate lowest starting fee
  const minFee = Math.min(lawyer.fee_chat, lawyer.fee_voice, lawyer.fee_video);

  return (
    <View style={[styles.card, style]}>
      {/* ─── Main Card Body (Pressable) ─── */}
      <Pressable
        onPress={onPress}
        testID={testID}
        accessibilityRole="button"
        accessibilityLabel={`${lawyer.name}. ${lawyer.experience_years} years experience.`}
        style={({ pressed }) => [styles.cardBody, pressed && styles.pressed]}
      >
        {/* Header Row: Avatar + Info */}
        <View style={styles.headerRow}>
          <Avatar
            uri={lawyer.photo_url}
            initials={initials}
            size="md"
            accessibilityLabel={`${lawyer.name} photo`}
          />

          <View style={styles.headerInfo}>
            <Text style={styles.name} numberOfLines={1}>
              {lawyer.name}
            </Text>

            {/* Rating, Experience & Availability Inline */}
            <View style={styles.metaRow}>
              <View style={styles.ratingRow}>
                <SymbolView
                  name={{ ios: 'star.fill', android: 'star', web: 'star' }}
                  size={13}
                  tintColor={Colors.primary}
                />
                <Text style={styles.ratingText}>{lawyer.rating_avg.toFixed(1)}</Text>
                <Text style={styles.reviewCount}>({lawyer.review_count})</Text>
              </View>

              <Text style={styles.dotSeparator}>•</Text>

              <Text style={styles.experience}>{lawyer.experience_years} yrs exp</Text>

              {lawyer.is_available_now && (
                <>
                  <Text style={styles.dotSeparator}>•</Text>
                  <View style={styles.availableBadgeInline}>
                    <View style={styles.availableDot} />
                    <Text style={styles.availableText}>Available</Text>
                  </View>
                </>
              )}
            </View>
          </View>
        </View>

        {/* Practice Area Subtle Tags (Max 2) */}
        {topPracticeAreas.length > 0 && (
          <View style={styles.tagsRow}>
            {topPracticeAreas.map((area) => (
              <View key={area} style={styles.subtleTag}>
                <Text style={styles.subtleTagText}>{area}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Languages Plain Text Line (Max 2) */}
        {topLanguages.length > 0 && (
          <Text style={styles.languagesText} numberOfLines={1}>
            Speaks: {topLanguages}
          </Text>
        )}
      </Pressable>

      {/* Divider */}
      <View style={styles.divider} />

      {/* ─── Footer Section: Price & View Profile Button ─── */}
      <View style={styles.footerRow}>
        <View style={styles.priceBox}>
          <Text style={styles.priceLabel}>Starting from</Text>
          <Text style={styles.priceValue}>₹{minFee}/min</Text>
        </View>

        <SecondaryButton
          label="View Profile"
          onPress={onPress}
          style={styles.viewProfileButton}
          testID={`view-profile-${lawyer.id}`}
        />
      </View>

      {/* ─── Top-Right Favourite Button (Sibling Pressable) ─── */}
      <Pressable
        onPress={onFavouritePress}
        accessibilityRole="button"
        accessibilityLabel={isFavourited ? 'Remove from favourites' : 'Add to favourites'}
        accessibilityState={{ selected: isFavourited }}
        style={({ pressed }) => [styles.favouriteButton, pressed && styles.pressed]}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <SymbolView
          name={
            isFavourited
              ? { ios: 'heart.fill', android: 'favorite', web: 'favorite' }
              : { ios: 'heart', android: 'favorite_border', web: 'favorite_border' }
          }
          size={20}
          tintColor={isFavourited ? Colors.danger : Colors.textSecondary}
        />
      </Pressable>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    position: 'relative',
    backgroundColor: Colors.surfaceAlt,
    borderRadius: Radii.card,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.card,
  },
  cardBody: {
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  pressed: {
    opacity: 0.88,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  headerInfo: {
    flex: 1,
    gap: 3,
    paddingRight: Spacing.xl,
  },
  name: {
    ...Typography.h2,
    fontSize: FontSize.h2,
    fontWeight: FontWeight.semibold,
    color: Colors.ink,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingText: {
    fontSize: FontSize.label,
    fontWeight: FontWeight.semibold,
    color: Colors.ink,
  },
  reviewCount: {
    fontSize: FontSize.bodySmall,
    color: Colors.textSecondary,
  },
  dotSeparator: {
    fontSize: FontSize.bodySmall,
    color: Colors.textSecondary,
  },
  experience: {
    fontSize: FontSize.bodySmall,
    color: Colors.textSecondary,
  },
  availableBadgeInline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  availableDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.success,
  },
  availableText: {
    fontSize: FontSize.bodySmall,
    color: Colors.success,
    fontWeight: FontWeight.medium,
  },
  favouriteButton: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginTop: 2,
  },
  subtleTag: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radii.sm,
    paddingHorizontal: Spacing.xs + 2,
    paddingVertical: 3,
  },
  subtleTagText: {
    fontSize: FontSize.bodySmall,
    fontWeight: FontWeight.medium,
    color: Colors.ink,
  },
  languagesText: {
    fontSize: FontSize.bodySmall,
    color: Colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
  },
  priceBox: {
    gap: 1,
  },
  priceLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  priceValue: {
    ...Typography.price,
    fontSize: FontSize.body,
    color: Colors.primary,
  },
  viewProfileButton: {
    minWidth: 110,
    height: 36,
  },
});
