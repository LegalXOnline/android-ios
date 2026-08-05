/**
 * LawyerCard — Talk to Lawyer listing card.
 *
 * Rules (04_Design_System.md §5.2):
 * - Photo (circular), name, rating (star + number), review count,
 *   experience badge, language tags, practice-area tags.
 * - Three mode buttons (Chat/Voice/Video) each showing per-minute price inline.
 * - Mode buttons are PRESENTATION ONLY — no onModePress (Phase 2 scope).
 * - Favourite icon (heart outline) top-right — calls onFavouritePress.
 * - Memoized for FlatList performance (24_AI_BUILD_GUIDE §15).
 */
import { SymbolView } from 'expo-symbols';
import { memo } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { Colors, FontSize, FontWeight, Layout, Radii, Shadows, Spacing, Typography } from '@theme';
import { Avatar } from '../primitives/Avatar';
import { Chip } from '../primitives/Chip';

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

  return (
    <View style={[styles.card, style]}>
      {/* ─── Main card body pressable ─── */}
      <Pressable
        onPress={onPress}
        testID={testID}
        accessibilityRole="button"
        accessibilityLabel={`${lawyer.name}. ${lawyer.experience_years} years experience. Rating ${lawyer.rating_avg}`}
        style={({ pressed }) => [
          styles.cardBody,
          pressed && styles.pressed,
        ]}
      >
        {/* ─── Header row ─── */}
        <View style={styles.headerRow}>
          <Avatar
            uri={lawyer.photo_url}
            initials={initials}
            size="lg"
            accessibilityLabel={`${lawyer.name} photo`}
          />

          <View style={styles.headerInfo}>
            {/* Name */}
            <Text style={styles.name} numberOfLines={1}>
              {lawyer.name}
            </Text>

            {/* Rating row */}
            <View style={styles.ratingRow}>
              <SymbolView
                name={{ ios: 'star.fill', android: 'star', web: 'star' }}
                size={13}
                tintColor={Colors.primary}
              />
              <Text style={styles.ratingText}>
                {lawyer.rating_avg.toFixed(1)}
              </Text>
              <Text style={styles.reviewCount}>
                ({lawyer.review_count} reviews)
              </Text>
            </View>

            {/* Experience */}
            <Text style={styles.experience}>
              {lawyer.experience_years} yrs experience
            </Text>
          </View>
        </View>

        {/* ─── Tags: Languages ─── */}
        {lawyer.languages.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.tagRow}
            contentContainerStyle={styles.tagContent}
          >
            {lawyer.languages.map((lang) => (
              <Chip key={lang} label={lang} />
            ))}
          </ScrollView>
        )}

        {/* ─── Tags: Practice areas ─── */}
        {lawyer.practice_areas.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.tagRow}
            contentContainerStyle={styles.tagContent}
          >
            {lawyer.practice_areas.map((area) => (
              <Chip key={area} label={area} />
            ))}
          </ScrollView>
        )}

        {/* ─── Mode buttons (presentation only) ─── */}
        <View style={styles.modeRow}>
          <ModeButton label="Chat" price={lawyer.fee_chat} />
          <ModeButton label="Voice" price={lawyer.fee_voice} />
          <ModeButton label="Video" price={lawyer.fee_video} />
        </View>

        {/* Availability indicator */}
        {lawyer.is_available_now && (
          <View style={styles.availableRow}>
            <View style={styles.availableDot} />
            <Text style={styles.availableText}>Available now</Text>
          </View>
        )}
      </Pressable>

      {/* ─── Favourite button (sibling Pressable, top-right absolute) ─── */}
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
          size={22}
          tintColor={isFavourited ? Colors.danger : Colors.textSecondary}
        />
      </Pressable>
    </View>
  );
});

// ─── ModeButton — presentation-only inner component ───────────────────────────
// Shows mode label + per-minute price. Not interactive at the card level.
// The booking flow (SCR-10) handles mode selection — 24_AI_BUILD_GUIDE §9.

interface ModeButtonProps {
  label: string;
  price: number;
}

function ModeButton({ label, price }: ModeButtonProps) {
  return (
    <View style={modeStyles.button}>
      <Text style={modeStyles.label}>{label}</Text>
      <Text style={modeStyles.price}>₹{price}/min</Text>
    </View>
  );
}

const modeStyles = StyleSheet.create({
  button: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderRadius: Radii.button,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    gap: 2,
  },
  label: {
    fontSize: FontSize.label,
    fontWeight: FontWeight.medium,
    color: Colors.ink,
  },
  price: {
    fontSize: FontSize.bodySmall,
    color: Colors.textSecondary,
  },
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
    padding: Layout.cardPadding,
    gap: Spacing.md,
  },
  pressed: {
    opacity: 0.85,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  headerInfo: {
    flex: 1,
    gap: Spacing.xs,
    paddingRight: Spacing.xl,
  },
  name: {
    ...Typography.h2,
    color: Colors.ink,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
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
  experience: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  favouriteButton: {
    position: 'absolute',
    top: Layout.cardPadding,
    right: Layout.cardPadding,
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagRow: {
    flexGrow: 0,
  },
  tagContent: {
    gap: Spacing.xs,
    flexDirection: 'row',
  },
  modeRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  availableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  availableDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.success,
  },
  availableText: {
    fontSize: FontSize.bodySmall,
    color: Colors.success,
    fontWeight: FontWeight.medium,
  },
});
