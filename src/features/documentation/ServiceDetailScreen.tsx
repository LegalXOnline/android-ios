import { useLocalSearchParams, useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import {
  AppHeader,
  Badge,
  ErrorState,
  FaqAccordion,
  PrimaryButton,
  SafeScreenWrapper,
} from '@shared/components';
import { Colors, FontSize, FontWeight, Layout, Radii, Shadows, Spacing, Typography } from '@theme';

import { StickyBottomCTA } from '../billing/components/StickyBottomCTA';
import { getBillingOrder, setBillingOrder } from '../billing/billing.store';
import {
  DOCUMENT_SERVICES,
  type ChecklistItem,
  type ServiceDetailPayload,
} from './documentation.placeholder';

export function ServiceDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);

  const service: ServiceDetailPayload | undefined = DOCUMENT_SERVICES.find(
    (s) => s.id === id
  );

  if (!service) {
    return (
      <SafeScreenWrapper edges={['top', 'left', 'right']}>
        <AppHeader title="Service Detail" showBack onBackPress={() => router.back()} />
        <ErrorState
          title="Service Not Found"
          description="The requested document service could not be found."
          onRetry={() => router.back()}
        />
      </SafeScreenWrapper>
    );
  }

  const handleBuyNow = () => {
    const existing = getBillingOrder();
    const price = service.priceNumeric;
    setBillingOrder({
      order_type: 'document',
      item_id: service.id,
      item_title: service.title,
      price,
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

  const requiredList: ChecklistItem[] = Array.isArray(service.checklistRequired)
    ? service.checklistRequired
    : Object.values(service.checklistRequired).flat();

  return (
    <SafeScreenWrapper edges={['top', 'left', 'right']}>
      <AppHeader
        title={service.title}
        showBack
        onBackPress={() => router.back()}
      />

      <View style={styles.container}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.heroCard}>
            <View style={styles.iconCircle}>
              <SymbolView
                name={{ ios: 'doc.text.fill', android: 'description', web: 'description' }}
                size={32}
                tintColor={Colors.primary}
              />
            </View>
            <Text style={styles.breadcrumb}>{service.breadcrumb}</Text>
            <Text style={styles.title}>{service.title}</Text>
            <Text style={styles.shortDescription}>{service.description}</Text>
            <View style={styles.badgeRow}>
              <Badge label={service.tag.toUpperCase()} variant="default" />
              <Badge label="★ 4.9" variant="success" />
              <Badge label="24-48 Hours Delivery" variant="default" />
            </View>
          </View>

          <View style={styles.pricingCard}>
            <Text style={styles.pricingLabel}>Package Price</Text>
            <View style={styles.priceRow}>
              <Text style={styles.priceText}>{service.priceLine}</Text>
            </View>
            <Text style={styles.priceSubtext}>
              Includes GST, official government portal filing & 1-on-1 advocate review
            </Text>
            <PrimaryButton
              label="Buy Now"
              onPress={handleBuyNow}
              style={styles.buyBtn}
              testID="buy-now-button"
            />
          </View>

          <View style={styles.sectionBlock}>
            <Text style={styles.sectionTitle}>Overview Video</Text>
            <View style={styles.videoCard}>
              <View style={styles.videoPlayCircle}>
                <SymbolView
                  name={{ ios: 'play.fill', android: 'play_arrow', web: 'play_arrow' }}
                  size={28}
                  tintColor={Colors.primary}
                />
              </View>
              <Text style={styles.videoTitle}>Watch 2-Min Overview Guide</Text>
              <Text style={styles.videoSub}>
                {isPlayingVideo
                  ? 'Playing explanation video...'
                  : 'Learn requirements, eligibility, and process timeline'}
              </Text>
              <Pressable
                onPress={() => setIsPlayingVideo(!isPlayingVideo)}
                style={styles.videoBtn}
              >
                <Text style={styles.videoBtnText}>
                  {isPlayingVideo ? 'Pause Guide' : 'Play Explanation Video'}
                </Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.sectionBlock}>
            <Text style={styles.sectionTitle}>Key Details & Highlights</Text>
            {service.keyDetails.map((detail: string, idx: number) => (
              <View key={idx} style={styles.featureItem}>
                <SymbolView
                  name={{ ios: 'checkmark.circle.fill', android: 'check_circle', web: 'check_circle' }}
                  size={18}
                  tintColor={Colors.primary}
                />
                <Text style={styles.featureText}>{detail}</Text>
              </View>
            ))}
          </View>

          <View style={styles.sectionBlock}>
            <Text style={styles.sectionTitle}>What is this Service?</Text>
            <View style={styles.infoCard}>
              <Text style={styles.infoBody}>{service.whatIsBody}</Text>
              <Text style={styles.infoCitation}>Statutory Source: {service.whatIsCitation}</Text>
            </View>
          </View>

          <View style={styles.sectionBlock}>
            <Text style={styles.sectionTitle}>Service Benefits</Text>
            {service.benefits.map((benefit: string, idx: number) => (
              <View key={idx} style={styles.docItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.docText}>{benefit}</Text>
              </View>
            ))}
          </View>

          <View style={styles.sectionBlock}>
            <Text style={styles.sectionTitle}>Required Documents</Text>
            <View style={styles.checklistCard}>
              <Text style={styles.checklistHeading}>Mandatory Documents Checklist</Text>
              {requiredList.map((item, idx) => (
                <View key={idx} style={styles.checkRow}>
                  <SymbolView
                    name={{ ios: 'doc.fill', android: 'insert_drive_file', web: 'insert_drive_file' }}
                    size={16}
                    tintColor={Colors.primary}
                  />
                  <View style={styles.checkTextWrap}>
                    <Text style={styles.checkName}>{item.name}</Text>
                    <Text style={styles.checkMeta}>
                      Formats: {item.formats} • Max Size: {item.maxSize}
                    </Text>
                  </View>
                </View>
              ))}

              {service.checklistAdditional && service.checklistAdditional.length > 0 && (
                <>
                  <Text style={[styles.checklistHeading, { marginTop: Spacing.sm }]}>
                    Additional / Optional Documents
                  </Text>
                  {service.checklistAdditional.map((item, idx) => (
                    <View key={idx} style={styles.checkRow}>
                      <SymbolView
                        name={{ ios: 'doc', android: 'description', web: 'description' }}
                        size={16}
                        tintColor={Colors.textSecondary}
                      />
                      <View style={styles.checkTextWrap}>
                        <Text style={styles.checkName}>{item.name}</Text>
                        <Text style={styles.checkMeta}>{item.formats}</Text>
                      </View>
                    </View>
                  ))}
                </>
              )}
            </View>
          </View>

          <View style={styles.sectionBlock}>
            <Text style={styles.sectionTitle}>{"What's Included in Package"}</Text>
            <View style={styles.infoCard}>
              {service.whatsIncluded.map((inc: string, idx: number) => (
                <View key={idx} style={styles.featureItem}>
                  <SymbolView
                    name={{ ios: 'checkmark.seal.fill', android: 'verified', web: 'verified' }}
                    size={18}
                    tintColor={Colors.primary}
                  />
                  <Text style={styles.featureText}>{inc}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.sectionBlock}>
            <Text style={styles.sectionTitle}>How It Works</Text>
            <View style={styles.stepsCard}>
              {service.howItWorksSteps.map((step, idx) => (
                <View key={idx} style={styles.stepRow}>
                  <View style={styles.stepNumberBadge}>
                    <Text style={styles.stepNumberText}>{idx + 1}</Text>
                  </View>
                  <View style={styles.stepTextWrap}>
                    <Text style={styles.stepTitle}>{step.title}</Text>
                    <Text style={styles.stepDesc}>{step.description}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.sectionBlock}>
            <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
            <FaqAccordion items={service.faq} />
          </View>
        </ScrollView>

        <StickyBottomCTA
          label={`Proceed to Buy — ${service.priceLine}`}
          onPress={handleBuyNow}
          testID="sticky-buy-now-button"
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
  heroCard: {
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radii.card,
    alignItems: 'center',
    gap: Spacing.xs,
    padding: Spacing.lg,
    ...Shadows.card,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  breadcrumb: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: FontWeight.medium,
  },
  title: {
    ...Typography.h1,
    fontSize: 22,
    color: Colors.ink,
    textAlign: 'center',
  },
  shortDescription: {
    ...Typography.body,
    fontSize: FontSize.bodySmall,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginHorizontal: Spacing.sm,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  pricingCard: {
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: Radii.card,
    padding: Spacing.lg,
    gap: Spacing.xs,
    ...Shadows.card,
  },
  pricingLabel: {
    fontSize: FontSize.bodySmall,
    color: Colors.textSecondary,
    fontWeight: FontWeight.medium,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Spacing.xs,
  },
  priceText: {
    ...Typography.price,
    fontSize: 28,
    color: Colors.ink,
  },
  priceSubtext: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  buyBtn: {
    marginTop: Spacing.xs,
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
  videoCard: {
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radii.card,
    padding: Spacing.lg,
    alignItems: 'center',
    gap: Spacing.xs,
    ...Shadows.card,
  },
  videoPlayCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoTitle: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.semibold,
    color: Colors.ink,
  },
  videoSub: {
    fontSize: FontSize.bodySmall,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  videoBtn: {
    marginTop: Spacing.xs,
  },
  videoBtnText: {
    fontSize: FontSize.bodySmall,
    fontWeight: FontWeight.semibold,
    color: Colors.primary,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.xs / 2,
  },
  featureText: {
    ...Typography.body,
    fontSize: FontSize.body,
    color: Colors.ink,
    flex: 1,
  },
  infoCard: {
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radii.card,
    padding: Spacing.md,
    gap: Spacing.xs,
    ...Shadows.card,
  },
  infoBody: {
    ...Typography.body,
    fontSize: FontSize.bodySmall,
    color: Colors.ink,
    lineHeight: 20,
  },
  infoCitation: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    marginTop: 4,
  },
  docItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.xs,
    paddingVertical: Spacing.xs / 2,
  },
  bullet: {
    fontSize: FontSize.body,
    color: Colors.primary,
    fontWeight: FontWeight.semibold,
  },
  docText: {
    ...Typography.body,
    fontSize: FontSize.bodySmall,
    color: Colors.ink,
    flex: 1,
  },
  checklistCard: {
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radii.card,
    padding: Spacing.md,
    gap: Spacing.sm,
    ...Shadows.card,
  },
  checklistHeading: {
    fontSize: FontSize.bodySmall,
    fontWeight: FontWeight.semibold,
    color: Colors.primary,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  checkTextWrap: {
    flex: 1,
    gap: 2,
  },
  checkName: {
    fontSize: FontSize.bodySmall,
    fontWeight: FontWeight.medium,
    color: Colors.ink,
  },
  checkMeta: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  stepsCard: {
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radii.card,
    padding: Spacing.md,
    gap: Spacing.md,
    ...Shadows.card,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  stepNumberBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    fontSize: FontSize.bodySmall,
    fontWeight: FontWeight.semibold,
    color: Colors.surfaceAlt,
  },
  stepTextWrap: {
    flex: 1,
    gap: 2,
  },
  stepTitle: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.semibold,
    color: Colors.ink,
  },
  stepDesc: {
    fontSize: FontSize.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
});
