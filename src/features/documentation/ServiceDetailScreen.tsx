/**
 * ServiceDetailScreen — SCR-04 (1 Template × 8 Data Payloads)
 *
 * Spec: 07_Module_Documentation.md §3
 * Sections in exact merged order:
 *   1. Hero (tag badge, title, short description, price line)
 *   2. Video placeholder (VideoCard)
 *   3. Key Details (numbered factual points)
 *   4. What is [Service]? (definition + statutory citation blockquote)
 *   5. Why Choose This Service (benefits list)
 *   6. Required Document Checklist (DocumentChecklist with optional subtype selector)
 *   7. What's Included (deliverables list)
 *   8. How It Works (HowItWorksStepper 4-step process)
 *   9. FAQ (FaqAccordion)
 *   10. Buy Now (PrimaryButton CTA navigating to Billing placeholder)
 */
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, ScrollView, Text, View } from 'react-native';

import {
  AppHeader,
  Badge,
  Divider,
  ErrorState,
  FaqAccordion,
  PrimaryButton,
  SafeScreenWrapper,
  VideoCard,
} from '@shared/components';
import { Colors, FontSize, FontWeight, Layout, Radii, Spacing, Typography } from '@theme';

import { getServiceById } from './documentation.placeholder';
import { DocumentChecklist } from './components/DocumentChecklist';
import { HowItWorksStepper } from './components/HowItWorksStepper';

export function ServiceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const service = id ? getServiceById(id) : undefined;

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
    // Navigates to Billing placeholder as per IA spec
    // In Phase 4: alert or stub navigation to billing
    router.push({
      pathname: '/(tabs)/documentation', // Fallback route until Billing module (Phase 9)
    } as any);
  };

  return (
    <SafeScreenWrapper edges={['top', 'left', 'right']}>
      <AppHeader
        title={service.title}
        showBack
        onBackPress={() => router.back()}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. Hero Section */}
        <View style={styles.heroBlock}>
          <Badge label={service.tag} variant="default" />
          <Text style={styles.heroTitle}>{service.title}</Text>
          <Text style={styles.heroDesc}>{service.description}</Text>
          <Text style={styles.heroPrice}>{service.priceLine}</Text>
        </View>

        <Divider />

        {/* 2. Video Placeholder */}
        <VideoCard
          videoUrl={service.videoUrl}
          caption={`30–60 sec video overview of ${service.title}`}
        />

        {/* 3. Key Details */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionTitle}>Key Details</Text>
          <View style={styles.cardBox}>
            {service.keyDetails.map((detail, idx) => (
              <View key={`key-${idx}`} style={styles.bulletRow}>
                <Text style={styles.bulletIndex}>{idx + 1}.</Text>
                <Text style={styles.bulletText}>{detail}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 4. What is [Service]? */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionTitle}>What is {service.title}?</Text>
          <Text style={styles.bodyText}>{service.whatIsBody}</Text>
          {/* Statutory Citation Blockquote */}
          <View style={styles.citationBox}>
            <Text style={styles.citationText}>“{service.whatIsCitation}”</Text>
          </View>
        </View>

        {/* 5. Why Choose This Service */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionTitle}>Why Choose This Service</Text>
          <View style={styles.cardBox}>
            {service.benefits.map((benefit, idx) => (
              <View key={`benefit-${idx}`} style={styles.bulletRow}>
                <Text style={styles.bulletPoint}>•</Text>
                <Text style={styles.bulletText}>{benefit}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 6. Required Document Checklist */}
        <DocumentChecklist
          subtypes={service.subtypes}
          checklistRequired={service.checklistRequired}
          checklistAdditional={service.checklistAdditional}
        />

        {/* 7. What's Included */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionTitle}>What's Included</Text>
          <View style={styles.cardBox}>
            {service.whatsIncluded.map((item, idx) => (
              <View key={`included-${idx}`} style={styles.bulletRow}>
                <Text style={styles.bulletIndex}>{idx + 1}.</Text>
                <Text style={styles.bulletText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 8. How It Works */}
        <HowItWorksStepper steps={service.howItWorksSteps} />

        {/* 9. FAQ */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          <FaqAccordion items={service.faq} />
        </View>

        {/* 10. Buy Now CTA */}
        <View style={styles.ctaContainer}>
          <PrimaryButton
            label={`Buy Now — ${service.priceLine}`}
            onPress={handleBuyNow}
            testID="buy-now-button"
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
  heroBlock: {
    gap: Spacing.xs,
  },
  heroTitle: {
    ...Typography.display,
    color: Colors.ink,
    fontSize: FontSize.h1,
  },
  heroDesc: {
    ...Typography.body,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  heroPrice: {
    ...Typography.price,
    color: Colors.primary,
    marginTop: Spacing.xs,
  },
  sectionBlock: {
    gap: Spacing.md,
  },
  sectionTitle: {
    ...Typography.h2,
    color: Colors.ink,
  },
  bodyText: {
    ...Typography.body,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  citationBox: {
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
    backgroundColor: Colors.surfaceAlt,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radii.sm,
  },
  citationText: {
    ...Typography.bodySmall,
    fontStyle: 'italic',
    color: Colors.ink,
  },
  cardBox: {
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radii.card,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  bulletIndex: {
    fontSize: FontSize.bodySmall,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
    minWidth: 18,
  },
  bulletPoint: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
  },
  bulletText: {
    ...Typography.body,
    color: Colors.ink,
    flex: 1,
    lineHeight: 20,
  },
  ctaContainer: {
    paddingVertical: Spacing.md,
    marginTop: Spacing.md,
  },
});
