/**
 * UploadScreen — Premium Google Drive / Dropbox Style Upload UI
 *
 * Fields:
 *   - Upload Area (Google Drive / Dropbox style dropzone)
 *   - Uploaded File Card (mock file preview item)
 *   - Document Type selector (Property Agreement, Rent Agreement, Employment Agreement, Business Contract, Legal Notice, Other)
 *   - Language selector (English, Hindi, Bengali, Marathi, Tamil, Telugu, Kannada)
 *   - Continue & Cancel Buttons at bottom
 */
import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppHeader, Chip, PrimaryButton, SecondaryButton, SafeScreenWrapper } from '@shared/components';
import { Colors, FontSize, FontWeight, Layout, Radii, Shadows, Spacing, Typography } from '@theme';

import { useVerificationStore } from './verification.store';

const DOCUMENT_TYPES = [
  'Property Agreement',
  'Rent Agreement',
  'Employment Agreement',
  'Business Contract',
  'Legal Notice',
  'Other',
];

const LANGUAGES = [
  'English',
  'Hindi',
  'Bengali',
  'Marathi',
  'Tamil',
  'Telugu',
  'Kannada',
];

export function UploadScreen() {
  const router = useRouter();
  const [storeState, setStoreState] = useVerificationStore();

  const [isFileAttached, setIsFileAttached] = useState(true);

  const selectedDocType = storeState.documentType;
  const selectedLang = storeState.language;

  const handleSelectDocType = (docType: string) => {
    setStoreState({ documentType: docType });
  };

  const handleSelectLanguage = (lang: string) => {
    setStoreState({ language: lang });
  };

  const handleContinue = () => {
    if (storeState.selectedPlan === 'review_consultation') {
      // Plan 2: Review + Consultation -> Go to Consultation Details Screen
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      router.push('/verification/consultation' as any);
    } else {
      // Plan 1: Review Only -> Go to Billing Placeholder
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      router.push('/(tabs)/documentation' as any);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <SafeScreenWrapper edges={['top', 'left', 'right']}>
      <AppHeader
        title="Upload Document"
        showBack
        onBackPress={() => router.back()}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Title & Subtitle */}
        <View style={styles.headerBlock}>
          <Text style={styles.heading}>Document Details</Text>
          <Text style={styles.subtitle}>
            Attach your document file and select document classification details.
          </Text>
        </View>

        {/* Upload Area — Google Drive / Dropbox Style UI */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionTitle}>Upload Area</Text>
          <View style={styles.dropZone}>
            <View style={styles.cloudIconCircle}>
              <SymbolView
                name={{ ios: 'square.and.arrow.up', android: 'cloud_upload', web: 'cloud_upload' }}
                size={32}
                tintColor={Colors.primary}
              />
            </View>

            <Text style={styles.dropTitle}>Drag & drop file here or</Text>

            {/* "Browse Files" button pill */}
            <View style={styles.browseButton}>
              <Text style={styles.browseText}>Browse Files</Text>
            </View>

            <Text style={styles.dropSub}>Supports PDF, DOCX, JPG, PNG up to 15 MB (UI Only)</Text>
          </View>
        </View>

        {/* Uploaded File Card Mock */}
        {isFileAttached ? (
          <View style={styles.fileCard}>
            <View style={styles.fileIconBox}>
              <SymbolView
                name={{ ios: 'doc.text.fill', android: 'description', web: 'description' }}
                size={24}
                tintColor={Colors.ink}
              />
            </View>
            <View style={styles.fileTextInfo}>
              <Text style={styles.fileName}>agreement_document_v1.pdf</Text>
              <Text style={styles.fileSize}>2.4 MB • Attached & ready for audit</Text>
            </View>
            <Pressable
              onPress={() => setIsFileAttached(false)}
              accessibilityRole="button"
              accessibilityLabel="Remove attached file"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              style={({ pressed }) => pressed && styles.pressed}
            >
              <SymbolView
                name={{ ios: 'xmark.circle.fill', android: 'cancel', web: 'cancel' }}
                size={20}
                tintColor={Colors.textSecondary}
              />
            </Pressable>
          </View>
        ) : (
          <Pressable
            onPress={() => setIsFileAttached(true)}
            style={({ pressed }) => [styles.reattachButton, pressed && styles.pressed]}
          >
            <Text style={styles.reattachText}>+ Re-attach sample document file</Text>
          </Pressable>
        )}

        {/* Document Type Selector */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionTitle}>Document Type</Text>
          <View style={styles.chipGrid}>
            {DOCUMENT_TYPES.map((type) => (
              <Chip
                key={type}
                label={type}
                selected={selectedDocType === type}
                onPress={() => handleSelectDocType(type)}
              />
            ))}
          </View>
        </View>

        {/* Language Selector */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionTitle}>Language</Text>
          <View style={styles.chipGrid}>
            {LANGUAGES.map((lang) => (
              <Chip
                key={lang}
                label={lang}
                selected={selectedLang === lang}
                onPress={() => handleSelectLanguage(lang)}
              />
            ))}
          </View>
        </View>

        {/* Actions: Continue & Cancel Buttons at Bottom */}
        <View style={styles.actionBlock}>
          <PrimaryButton
            label={storeState.selectedPlan === 'review_consultation' ? 'Continue to Consultation' : 'Continue to Billing'}
            onPress={handleContinue}
            testID="upload-continue-button"
          />
          <SecondaryButton
            label="Cancel"
            onPress={handleCancel}
            testID="upload-cancel-button"
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
  headerBlock: {
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
  sectionBlock: {
    gap: Spacing.sm,
  },
  sectionTitle: {
    ...Typography.h2,
    color: Colors.ink,
  },
  dropZone: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: Colors.primary,
    backgroundColor: '#FEFCF5', // soft warm accent fill
    borderRadius: Radii.card,
    padding: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  cloudIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  dropTitle: {
    ...Typography.body,
    fontWeight: FontWeight.medium,
    color: Colors.ink,
    textAlign: 'center',
  },
  browseButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xs + 2,
    borderRadius: Radii.pill,
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  browseText: {
    fontSize: FontSize.label,
    fontWeight: FontWeight.semibold,
    color: Colors.ink,
  },
  dropSub: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.xs,
  },
  fileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radii.card,
    padding: Spacing.md,
    gap: Spacing.md,
    ...Shadows.card,
  },
  fileIconBox: {
    width: 40,
    height: 40,
    borderRadius: Radii.sm,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fileTextInfo: {
    flex: 1,
    gap: 2,
  },
  fileName: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.semibold,
    color: Colors.ink,
  },
  fileSize: {
    fontSize: FontSize.bodySmall,
    color: Colors.success,
  },
  reattachButton: {
    padding: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radii.button,
  },
  reattachText: {
    ...Typography.body,
    color: Colors.primary,
    fontWeight: FontWeight.semibold,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  actionBlock: {
    gap: Spacing.md,
    marginTop: Spacing.sm,
    paddingBottom: Spacing.xxl,
  },
  pressed: {
    opacity: 0.7,
  },
});
