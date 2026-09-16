import { useLocalSearchParams, useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import {
  AppHeader,
  Badge,
  ErrorState,
  FaqAccordion,
  LoadingIndicator,
  PrimaryButton,
  SafeScreenWrapper,
} from '@shared/components';
import { useHideTabBar } from '@shared/components/navigation/FloatingTabBar';
import { useAuth } from '@providers/AuthProvider';
import { getServiceBySlug, type ServiceDetail } from '@services/services.service';
import { Colors, FontSize, FontWeight, Layout, Radii, Shadows, Spacing, Typography } from '@theme';
import { LX, LXShape, LXType } from '@theme';
import { useGoBack } from '@shared/hooks/useGoBack';

import { StickyBottomCTA } from '../billing/components/StickyBottomCTA';
import { getBillingOrder, setBillingOrder } from '../billing/billing.store';


export function ServiceDetailScreen() {
  useHideTabBar();
  const router = useRouter();
  const goBack = useGoBack();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();

  const [service, setService] = useState<ServiceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      const found = await getServiceBySlug(id);
      if (!cancelled) {
        setService(found);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, attempt]);

  if (loading) {
    return (
      <SafeScreenWrapper edges={['top', 'left', 'right']}>
        <AppHeader title="Service Detail" showBack onBackPress={goBack} />
        <LoadingIndicator />
      </SafeScreenWrapper>
    );
  }

  if (!service) {
    return (
      <SafeScreenWrapper edges={['top', 'left', 'right']}>
        <AppHeader title="Service Detail" showBack onBackPress={goBack} />
        <ErrorState
          title="Service Not Found"
          description="We could not load this service. Check your connection and try again."
          onRetry={() => {
            setLoading(true);
            setAttempt((n) => n + 1);
          }}
        />
      </SafeScreenWrapper>
    );
  }

  const handleBuyNow = () => {
    const existing = getBillingOrder();
    const price = service.priceNumeric;
    setBillingOrder({
      order_type: 'document',
      item_id: service.slug,
      item_title: service.title,
      price,
      discount_amount: 0,
      tax_amount: Math.round(price * 0.18),
      total_amount: Math.round(price * 1.18),
      // From the session. A blank field is honest; a made-up name is not.
      user_name: user ? `${user.firstName} ${user.lastName}`.trim() : '',
      user_email: user?.email ?? '',
      user_phone: existing.user_phone ?? '',
    });
    if (service.requiredDocs.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      router.push(`/documents/${service.slug}` as any);
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    router.push('/billing' as any);
  };

  const requiredList = service.requiredDocs.filter((d) => d.required);
  const optionalList = service.requiredDocs.filter((d) => !d.required);

  return (
    <SafeScreenWrapper edges={['top', 'left', 'right']}>
      <AppHeader
        title={service.title}
        showBack
        onBackPress={goBack}
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
            <Text style={styles.sectionTitle}>Key Details & Highlights</Text>
            {service.keyPoints.map((detail: string, idx: number) => (
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
              <Text style={styles.infoBody}>{service.definition}</Text>
              <View style={styles.citationBlock}>
                <Text style={styles.infoCitation}>{service.definitionQuote}</Text>
              </View>
            </View>
          </View>

          <View style={styles.sectionBlock}>
            <Text style={styles.sectionTitle}>Service Benefits</Text>
            {service.benefits.map((benefit: string, idx: number) => (
              <View key={idx} style={styles.featureItem}>
                <SymbolView
                  name={{ ios: 'star.fill', android: 'star', web: 'star' }}
                  size={16}
                  tintColor={Colors.primary}
                />
                <Text style={styles.featureText}>{benefit}</Text>
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
                      {item.acceptedFormats}
                    </Text>
                  </View>
                </View>
              ))}

              {optionalList.length > 0 && (
                <>
                  <Text style={[styles.checklistHeading, { marginTop: Spacing.sm }]}>
                    Additional / Optional Documents
                  </Text>
                  {optionalList.map((item, idx) => (
                    <View key={idx} style={styles.checkRow}>
                      <SymbolView
                        name={{ ios: 'doc', android: 'description', web: 'description' }}
                        size={16}
                        tintColor={Colors.textSecondary}
                      />
                      <View style={styles.checkTextWrap}>
                        <Text style={styles.checkName}>{item.name}</Text>
                        <Text style={styles.checkMeta}>{item.acceptedFormats}</Text>
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
              {service.features.map((inc: string, idx: number) => (
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
              {service.howItWorks.map((step, idx) => (
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
            <FaqAccordion items={service.faqs.map((f, i) => ({ id: String(i), question: f.q, answer: f.a }))} />
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
    backgroundColor: LX.bg,
  },
  scrollContent: {
    paddingHorizontal: Layout.screenPaddingHWide,
    paddingVertical: Spacing.md,
    paddingBottom: 110,
    gap: Spacing.lg,
  },
  heroCard: {
    backgroundColor: LX.surface,
    borderWidth: 1,
    borderColor: LX.border,
    borderRadius: LXShape.lg,
    alignItems: 'center',
    gap: Spacing.xs,
    padding: Spacing.lg,
    ...Shadows.card,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: LX.surface,
    borderWidth: 1,
    borderColor: LX.border,
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
    backgroundColor: LX.surface,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: LXShape.lg,
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
    backgroundColor: LX.surface,
    borderWidth: 1,
    borderColor: LX.border,
    borderRadius: LXShape.lg,
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
  },
  citationBlock: {
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
    paddingLeft: Spacing.sm,
    marginTop: Spacing.xs,
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
    backgroundColor: LX.surface,
    borderWidth: 1,
    borderColor: LX.border,
    borderRadius: LXShape.lg,
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
    backgroundColor: LX.surface,
    borderWidth: 1,
    borderColor: LX.border,
    borderRadius: LXShape.lg,
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
