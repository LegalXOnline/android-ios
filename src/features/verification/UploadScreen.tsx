import * as DocumentPicker from 'expo-document-picker';
import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import {
  AppHeader,
  Badge,
  Chip,
  SafeScreenWrapper,
  SecondaryButton,
} from '@shared/components';
import { Colors, FontSize, FontWeight, Layout, Radii, Shadows, Spacing, Typography } from '@theme';
import { useGoBack } from '@shared/hooks/useGoBack';
import { useAuth } from '@providers/AuthProvider';

import { StickyBottomCTA } from '../billing/components/StickyBottomCTA';
import { getBillingOrder, setBillingOrder } from '../billing/billing.store';
import {
  useVerificationStore,
  VERIFICATION_PLANS,
} from './verification.store';

interface SelectedFile {
  name: string;
  size: string;
  ext: string;
  uri: string;
}

const DOCUMENT_TYPES = [
  'Property Agreement',
  'Employment Contract',
  'NDA / Confidentiality',
  'Business Agreement',
  'Personal / Other',
];

export function UploadScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const goBack = useGoBack();
  const [storeState, setStoreState] = useVerificationStore();

  const [selectedType, setSelectedType] = useState(
    storeState.documentType || DOCUMENT_TYPES[0]
  );
  const [selectedLanguage, setSelectedLanguage] = useState(
    storeState.language || 'English'
  );

  const [file, setFile] = useState<SelectedFile | null>(null);

  const [errorMsg, setErrorMsg] = useState('');

  const isReviewConsultation = storeState.selectedPlan === 'review_consultation';
  const activePlan = isReviewConsultation
    ? VERIFICATION_PLANS.REVIEW_CONSULTATION
    : VERIFICATION_PLANS.REVIEW_ONLY;

  const handlePickFile = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'image/jpeg',
          'image/png',
        ],
        copyToCacheDirectory: true,
      });

      if (!res.canceled && res.assets && res.assets.length > 0) {
        const asset = res.assets[0];
        const ext = asset.name.split('.').pop()?.toUpperCase() || 'FILE';
        const sizeMb = asset.size ? (asset.size / (1024 * 1024)).toFixed(1) + ' MB' : '1.2 MB';

        setFile({
          name: asset.name,
          size: sizeMb,
          ext,
          uri: asset.uri,
        });
        setErrorMsg('');
      }
    } catch {
      setErrorMsg('Failed to open device file picker.');
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
  };

  const handleNext = () => {
    if (!file) {
      setErrorMsg('Please select a document file before proceeding.');
      return;
    }

    setErrorMsg('');
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
        uploaded_file_name: file.name,
        discount_amount: 0,
        tax_amount: Math.round(price * 0.18),
        total_amount: Math.round(price * 1.18),
        user_name: user ? `${user.firstName} ${user.lastName}`.trim() : existing.user_name,
        user_email: user?.email ?? existing.user_email,
        user_phone: existing.user_phone ?? '',
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
        onBackPress={goBack}
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
            <Text style={styles.sectionTitle}>Upload Document File</Text>

            {file ? (
              <View style={styles.previewCard}>
                <View style={styles.previewHeaderRow}>
                  <View style={styles.iconBox}>
                    <SymbolView
                      name={
                        file.ext === 'PNG' || file.ext === 'JPG' || file.ext === 'JPEG'
                          ? { ios: 'photo.fill', android: 'image', web: 'image' }
                          : { ios: 'doc.fill', android: 'insert_drive_file', web: 'insert_drive_file' }
                      }
                      size={24}
                      tintColor={Colors.primary}
                    />
                  </View>

                  <View style={styles.fileMeta}>
                    <Text style={styles.fileName}>{file.name}</Text>
                    <Text style={styles.fileSizeText}>
                      Size: {file.size} • Format: {file.ext}
                    </Text>
                  </View>

                  <Badge label="Ready" variant="success" />
                </View>

                <View style={styles.previewActionsRow}>
                  <SecondaryButton
                    label="Replace File"
                    onPress={handlePickFile}
                    style={styles.actionBtn}
                    testID="replace-file-button"
                  />
                  <Pressable onPress={handleRemoveFile} style={styles.removeBtn}>
                    <SymbolView
                      name={{ ios: 'trash.fill', android: 'delete', web: 'delete' }}
                      size={18}
                      tintColor={Colors.danger}
                    />
                  </Pressable>
                </View>
              </View>
            ) : (
              <View style={styles.dropZone}>
                <View style={styles.cloudIconCircle}>
                  <SymbolView
                    name={{ ios: 'square.and.arrow.up', android: 'cloud_upload', web: 'cloud_upload' }}
                    size={36}
                    tintColor={Colors.primary}
                  />
                </View>

                <Text style={styles.dropTitle}>Select a PDF, DOCX, or Image file to upload</Text>
                <Text style={styles.dropSub}>Supported formats: PDF, DOC, DOCX, JPG, PNG (Max: 25MB)</Text>

                <SecondaryButton
                  label="Browse Files"
                  onPress={handlePickFile}
                  style={styles.browseBtn}
                  testID="browse-files-button"
                />
              </View>
            )}

            {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}
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
  previewCard: {
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderRadius: Radii.card,
    padding: Spacing.md,
    gap: Spacing.md,
    ...Shadows.card,
  },
  previewHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
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
  fileSizeText: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  previewActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  actionBtn: {
    flex: 1,
    marginRight: Spacing.md,
  },
  removeBtn: {
    padding: Spacing.xs,
  },
  errorText: {
    fontSize: FontSize.bodySmall,
    color: Colors.danger,
    fontWeight: FontWeight.medium,
    marginTop: 4,
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
