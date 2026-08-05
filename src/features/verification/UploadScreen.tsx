import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import {
  AppHeader,
  Chip,
  SafeScreenWrapper,
  SecondaryButton,
} from '@shared/components';
import { Colors, FontSize, FontWeight, Layout, Radii, Spacing, Typography } from '@theme';

import { StickyBottomCTA } from '../billing/components/StickyBottomCTA';
import { getBillingOrder, setBillingOrder } from '../billing/billing.store';
import {
  useVerificationStore,
  VERIFICATION_PLANS,
} from './verification.store';

const DOCUMENT_TYPES = [
  'Property Agreement',
  'Employment Contract',
  'NDA / Confidentiality',
  'Business Agreement',
  'Personal / Other',
];

export function UploadScreen() {
  const router = useRouter();
  const [storeState, setStoreState] = useVerificationStore();

  const [selectedType, setSelectedType] = useState(
    storeState.documentType || DOCUMENT_TYPES[0]
  );
  const [selectedLanguage, setSelectedLanguage] = useState(
    storeState.language || 'English'
  );
  const [fileAttached, setFileAttached] = useState(true);

  const isReviewConsultation = storeState.selectedPlan === 'review_consultation';
  const activePlan = isReviewConsultation
    ? VERIFICATION_PLANS.REVIEW_CONSULTATION
    : VERIFICATION_PLANS.REVIEW_ONLY;

  const handleFileSelect = () => {
    setFileAttached(true);
    setStoreState({
      documentType: selectedType,
      language: selectedLanguage,
    });
  };

  const handleRemoveFile = () => {
    setFileAttached(false);
  };

  const handleNext = () => {
    setStoreState({
      documentType: selectedType,
      language: selectedLanguage,
    });

    if (isReviewConsultation) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      router.push('/verification/consultation' as any);
    } else {
      const existing = getBillingOrder();
      const price = activePlan.priceNumeric;
      setBillingOrder({
        order_type: 'verification',
        item_id: activePlan.id,
        item_title: `Verification (${activePlan.title})`,
        package_name: activePlan.title,
        price,
        uploaded_file_name: 'Property_Sale_Deed_Draft.pdf',
        discount_amount: 0,
        tax_amount: Math.round(price * 0.18),
        total_amount: Math.round(price * 1.18),
        user_name: existing.user_name || 'Prince Kumar',
        user_email: existing.user_email || 'prince.kumar@example.com',
        user_phone: existing.user_phone || '+91 98765 43210',
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      router.push('/billing' as any);
    }
  };

  return (
    <SafeScreenWrapper edges={['top', 'left', 'right']}>
      <AppHeader
        title="Upload Document"
        showBack
        onBackPress={() => router.back()}
      />

      <View style={styles.container}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerBlock}>
            <Text style={styles.heading}>Document Details</Text>
            <Text style={styles.subtitle}>
              Attach your document file and select document classification details.
            </Text>
          </View>

          <View style={styles.sectionBlock}>
            <Text style={styles.sectionTitle}>Upload Area</Text>
            <View style={styles.dropZone}>
              <View style={styles.cloudIconCircle}>
                <SymbolView
                  name={{ ios: 'square.and.arrow.up', android: 'cloud_upload', web: 'cloud_upload' }}
                  size={36}
                  tintColor={Colors.primary}
                />
              </View>

              <Text style={styles.dropTitle}>Select a PDF or DOCX file to upload</Text>
              <Text style={styles.dropSub}>Supported formats: PDF, DOCX, TXT (Max size: 25MB)</Text>

              {fileAttached ? (
                <View style={styles.fileCard}>
                  <SymbolView
                    name={{ ios: 'doc.fill', android: 'insert_drive_file', web: 'insert_drive_file' }}
                    size={24}
                    tintColor={Colors.primary}
                  />
                  <View style={styles.fileMeta}>
                    <Text style={styles.fileName}>Property_Sale_Deed_Draft.pdf</Text>
                    <Text style={styles.fileSize}>2.4 MB</Text>
                  </View>
                  <Pressable onPress={handleRemoveFile} style={styles.removeBtn}>
                    <SymbolView
                      name={{ ios: 'trash.fill', android: 'delete', web: 'delete' }}
                      size={18}
                      tintColor={Colors.danger}
                    />
                  </Pressable>
                </View>
              ) : (
                <SecondaryButton
                  label="Browse Files"
                  onPress={handleFileSelect}
                  style={styles.browseBtn}
                  testID="browse-files-button"
                />
              )}
            </View>
          </View>

          <View style={styles.sectionBlock}>
            <Text style={styles.sectionTitle}>Document Category</Text>
            <View style={styles.chipGrid}>
              {DOCUMENT_TYPES.map((type) => (
                <Chip
                  key={type}
                  label={type}
                  selected={selectedType === type}
                  onPress={() => setSelectedType(type)}
                />
              ))}
            </View>
          </View>

          <View style={styles.sectionBlock}>
            <Text style={styles.sectionTitle}>Document Language</Text>
            <View style={styles.chipRow}>
              {['English', 'Hindi', 'Regional'].map((lang) => (
                <Chip
                  key={lang}
                  label={lang}
                  selected={selectedLanguage === lang}
                  onPress={() => setSelectedLanguage(lang)}
                />
              ))}
            </View>
          </View>
        </ScrollView>

        <StickyBottomCTA
          label={
            isReviewConsultation
              ? 'Proceed to Consultation Setup'
              : `Proceed to Billing — ₹${activePlan.priceNumeric}`
          }
          onPress={handleNext}
          testID="upload-proceed-button"
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
  headerBlock: {
    gap: Spacing.xs,
  },
  heading: {
    ...Typography.h1,
    fontSize: 22,
    color: Colors.ink,
  },
  subtitle: {
    ...Typography.body,
    fontSize: FontSize.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  sectionBlock: {
    gap: Spacing.xs,
  },
  sectionTitle: {
    ...Typography.h2,
    fontSize: 16,
    color: Colors.ink,
    marginBottom: 2,
  },
  dropZone: {
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
    borderRadius: Radii.card,
    padding: Spacing.lg,
    alignItems: 'center',
    gap: Spacing.xs,
  },
  cloudIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  dropTitle: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.semibold,
    color: Colors.ink,
    textAlign: 'center',
  },
  dropSub: {
    fontSize: 11,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  browseBtn: {
    marginTop: Spacing.xs,
    minWidth: 140,
  },
  fileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radii.card,
    padding: Spacing.sm,
    gap: Spacing.sm,
    width: '100%',
    marginTop: Spacing.xs,
  },
  fileMeta: {
    flex: 1,
    gap: 2,
  },
  fileName: {
    fontSize: FontSize.bodySmall,
    fontWeight: FontWeight.semibold,
    color: Colors.ink,
  },
  fileSize: {
    fontSize: 10,
    color: Colors.textSecondary,
  },
  removeBtn: {
    padding: Spacing.xs,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  chipRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
});
