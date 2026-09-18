import { useLocalSearchParams, useRouter } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import { SymbolView } from 'expo-symbols';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppHeader, SafeScreenWrapper } from '@shared/components';
import { useGoBack } from '@shared/hooks/useGoBack';
import { useHideTabBar } from '@shared/components/navigation/FloatingTabBar';
import {
  getServiceBySlug,
  uploadServiceDoc,
  type ServiceDetail,
  type ServiceRequiredDoc,
} from '@services/services.service';
import { LX, LXShape, LXType } from '@theme';

import { StickyBottomCTA } from '../billing/components/StickyBottomCTA';
import { getBillingOrder, setBillingOrder } from '../billing/billing.store';

interface Slot {
  status: 'empty' | 'uploading' | 'done' | 'error';
  name?: string;
  path?: string;
  error?: string;
}

/**
 * The checklist the service actually asks for, one upload each.
 *
 * The list is the service's own requiredDocs from the API — the same set the
 * website collects — rather than a generic "attach a file".
 */
export function DocumentUploadScreen() {
  const router = useRouter();
  const goBack = useGoBack('/(tabs)/documentation');
  useHideTabBar();

  const { slug } = useLocalSearchParams<{ slug: string }>();
  const [service, setService] = useState<ServiceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [slots, setSlots] = useState<Record<string, Slot>>({});

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    (async () => {
      const found = await getServiceBySlug(slug);
      if (!cancelled) {
        setService(found);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const pick = async (doc: ServiceRequiredDoc) => {
    const res = await DocumentPicker.getDocumentAsync({
      type: ['image/jpeg', 'image/png', 'application/pdf'],
      copyToCacheDirectory: true,
    });
    if (res.canceled || !res.assets?.[0]) return;

    const asset = res.assets[0];
    setSlots((s) => ({ ...s, [doc.id]: { status: 'uploading' } }));
    try {
      const up = await uploadServiceDoc(
        { uri: asset.uri, name: asset.name || 'document', type: asset.mimeType || 'application/pdf' },
        { docType: doc.id, serviceTitle: service?.title },
      );
      setSlots((s) => ({ ...s, [doc.id]: { status: 'done', name: up.name, path: up.path } }));
    } catch (err) {
      setSlots((s) => ({ ...s, [doc.id]: { status: 'error', error: (err as Error).message } }));
    }
  };

  const required = service?.requiredDocs.filter((d) => d.required) ?? [];
  const missing = required.filter((d) => slots[d.id]?.status !== 'done');

  const proceed = () => {
    const attached = Object.entries(slots)
      .filter(([, v]) => v.status === 'done')
      .map(([docType, v]) => ({ docType, path: v.path!, name: v.name! }));

    setBillingOrder({ ...getBillingOrder(), documents: attached });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    router.push('/billing' as any);
  };

  if (loading) {
    return (
      <SafeScreenWrapper edges={['top', 'left', 'right']}>
        <AppHeader title="Required Documents" showBack onBackPress={goBack} />
        <View style={styles.centre}>
          <ActivityIndicator color={LX.gold} size="large" />
        </View>
      </SafeScreenWrapper>
    );
  }

  return (
    <SafeScreenWrapper edges={['top', 'left', 'right']}>
      <AppHeader title="Required Documents" showBack onBackPress={goBack} />

      <View style={styles.flex}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.intro}>
            {service?.title}. {required.length} required
            {(service?.requiredDocs.length ?? 0) - required.length > 0
              ? `, ${(service?.requiredDocs.length ?? 0) - required.length} optional`
              : ''}
            . JPG, PNG or PDF up to 5 MB each.
          </Text>

          {service?.requiredDocs.map((doc) => {
            const slot = slots[doc.id] ?? { status: 'empty' as const };
            const done = slot.status === 'done';
            const failed = slot.status === 'error';

            return (
              <Pressable
                key={doc.id}
                onPress={() => slot.status !== 'uploading' && pick(doc)}
                accessibilityRole="button"
                accessibilityLabel={`Upload ${doc.name}`}
                style={[
                  styles.slot,
                  done && styles.slotDone,
                  failed && styles.slotError,
                ]}
              >
                <View style={[styles.icon, done && styles.iconDone]}>
                  {slot.status === 'uploading' ? (
                    <ActivityIndicator color={LX.goldText} size="small" />
                  ) : (
                    <SymbolView
                      name={
                        done
                          ? { ios: 'checkmark', android: 'check', web: 'check' }
                          : { ios: 'arrow.up.doc', android: 'upload_file', web: 'upload_file' }
                      }
                      size={18}
                      tintColor={done ? LX.onGold : LX.goldText}
                    />
                  )}
                </View>

                <View style={styles.slotText}>
                  <Text style={styles.slotName}>
                    {doc.name}
                    {!doc.required && <Text style={styles.optional}>  optional</Text>}
                  </Text>
                  <Text style={styles.slotDesc} numberOfLines={2}>
                    {failed ? slot.error : done ? slot.name : doc.desc}
                  </Text>
                  {!done && !failed && <Text style={styles.formats}>{doc.acceptedFormats}</Text>}
                </View>

                <Text style={styles.action}>{done ? 'Replace' : failed ? 'Retry' : 'Upload'}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <StickyBottomCTA
          label={missing.length > 0 ? `${missing.length} document${missing.length > 1 ? 's' : ''} still needed` : 'Continue'}
          onPress={proceed}
          disabled={missing.length > 0}
          testID="documents-continue"
        />
      </View>
    </SafeScreenWrapper>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  centre: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { padding: 18, paddingBottom: 24, gap: 11 },
  intro: { ...LXType.bodySmall, color: LX.inkMuted, marginBottom: 4 },

  slot: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 14,
    borderRadius: LXShape.md,
    borderWidth: 1,
    borderColor: LX.border,
    backgroundColor: LX.surface,
  },
  slotDone: { borderColor: LX.success, backgroundColor: LX.successSoft },
  slotError: { borderColor: LX.danger, backgroundColor: LX.dangerSoft },

  icon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: LX.goldSoft,
  },
  iconDone: { backgroundColor: LX.gold },

  slotText: { flex: 1, gap: 2 },
  slotName: { ...LXType.titleSmall, fontSize: 15, color: LX.ink },
  optional: { ...LXType.bodySmall, fontSize: 12, color: LX.inkFaint },
  slotDesc: { ...LXType.bodySmall, color: LX.inkMuted },
  formats: { ...LXType.bodySmall, fontSize: 11.5, color: LX.inkFaint },
  action: { ...LXType.label, fontSize: 13, color: LX.goldText, paddingTop: 2 },
});
