import * as DocumentPicker from 'expo-document-picker';
import { Image } from 'expo-image';
import { SymbolView } from 'expo-symbols';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import {
  AppHeader,
  AppTextInput,
  LoadingIndicator,
  PrimaryButton,
  SafeScreenWrapper,
} from '@shared/components';
import { Colors, FontSize, FontWeight, Layout, Spacing, Typography } from '@theme';
import { useGoBack } from '@shared/hooks/useGoBack';

import { useAuth } from '@providers/AuthProvider';
import {
  getProfile,
  updateProfile,
  uploadProfilePhoto,
} from '@services/profile.service';

export function EditProfileScreen() {
  const goBack = useGoBack();
  const { user, refresh } = useAuth();

  const [firstName, setFirstName] = useState(user?.firstName ?? '');
  const [lastName, setLastName] = useState(user?.lastName ?? '');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState(user?.email ?? '');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    let cancelled = false;
    getProfile()
      .then((p) => {
        if (cancelled) return;
        setFirstName(p.firstName);
        setLastName(p.lastName);
        setPhone(p.phone);
        setEmail(p.email);
        setAvatarUrl(p.avatarUrl);
      })
      .catch((err) => {
        if (!cancelled) setError((err as Error).message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const pickPhoto = async () => {
    const res = await DocumentPicker.getDocumentAsync({
      type: ['image/jpeg', 'image/png', 'image/webp'],
      copyToCacheDirectory: true,
    });
    if (res.canceled || !res.assets?.[0]) return;

    const asset = res.assets[0];
    setError('');
    setUploading(true);
    try {
      const url = await uploadProfilePhoto({
        uri: asset.uri,
        name: asset.name || 'avatar.jpg',
        type: asset.mimeType || 'image/jpeg',
      });
      setAvatarUrl(url);
      setSuccessMsg('Photo updated');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      setError('First and last name are both required.');
      return;
    }

    const digits = phone.replace(/[\s-]/g, '').replace(/^\+91/, '');
    if (digits && !/^[6-9]\d{9}$/.test(digits)) {
      setError('Enter a 10-digit Indian mobile number.');
      return;
    }

    setError('');
    setSaving(true);
    try {
      await updateProfile({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        ...(digits ? { phone: digits } : {}),
      });
      await refresh();
      setSuccessMsg('Profile updated');
      setTimeout(goBack, 900);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const initials = `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase() || 'LX';

  return (
    <SafeScreenWrapper edges={['top', 'left', 'right']}>
      <AppHeader title="Edit Profile" showBack onBackPress={goBack} />

      {loading ? (
        <LoadingIndicator />
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Pressable
            onPress={pickPhoto}
            disabled={uploading}
            accessibilityRole="button"
            accessibilityLabel="Change profile photo"
            style={styles.avatarWrap}
          >
            {avatarUrl ? (
              <Image source={{ uri: avatarUrl }} style={styles.avatar} contentFit="cover" />
            ) : (
              <View style={[styles.avatar, styles.avatarFallback]}>
                <Text style={styles.avatarInitials}>{initials}</Text>
              </View>
            )}

            <View style={styles.avatarBadge}>
              <SymbolView
                name={{ ios: 'camera.fill', android: 'photo_camera', web: 'photo_camera' }}
                size={14}
                tintColor={Colors.surfaceAlt}
              />
            </View>
          </Pressable>

          <Text style={styles.avatarHint}>
            {uploading ? 'Uploading…' : 'Tap to change your photo · JPG or PNG, up to 3 MB'}
          </Text>

          <View style={styles.formBlock}>
            <Text style={styles.sectionTitle}>Personal Details</Text>

            <AppTextInput
              label="First Name"
              value={firstName}
              onChangeText={(t) => {
                setFirstName(t);
                setError('');
              }}
              autoCapitalize="words"
              testID="edit-first-name-input"
            />

            <AppTextInput
              label="Last Name"
              value={lastName}
              onChangeText={(t) => {
                setLastName(t);
                setError('');
              }}
              autoCapitalize="words"
              testID="edit-last-name-input"
            />

            <AppTextInput
              label="Mobile Number"
              value={phone}
              onChangeText={(t) => {
                setPhone(t);
                setError('');
              }}
              keyboardType="phone-pad"
              maxLength={13}
              supporting="Used to reach you about applications and consultations"
              testID="edit-phone-input"
            />

            <AppTextInput
              label="Email Address"
              value={email}
              onChangeText={() => undefined}
              editable={false}
              supporting="Your email identifies the account and cannot be changed here"
              testID="edit-email-input"
            />
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          {successMsg ? <Text style={styles.successText}>{successMsg}</Text> : null}

          <PrimaryButton
            label={saving ? 'Saving…' : 'Save Changes'}
            onPress={handleSave}
            disabled={saving || uploading}
            testID="save-profile-button"
          />
        </ScrollView>
      )}
    </SafeScreenWrapper>
  );
}

const styles = StyleSheet.create({
  avatarWrap: { alignSelf: 'center', marginTop: 4 },
  avatar: { width: 96, height: 96, borderRadius: 48 },
  avatarFallback: {
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: { fontSize: 30, fontWeight: '600', color: Colors.ink },
  avatarBadge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.surface,
  },
  avatarHint: {
    fontSize: FontSize.bodySmall,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: -8,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Layout.screenPaddingHWide,
    paddingVertical: Spacing.lg,
    paddingBottom: Spacing.xxl + 20,
    gap: Spacing.xl,
  },
  formBlock: {
    gap: Spacing.md,
  },
  sectionTitle: {
    ...Typography.h2,
    fontSize: 18,
    color: Colors.ink,
  },
  errorText: {
    fontSize: FontSize.bodySmall,
    color: Colors.danger,
    textAlign: 'center',
  },
  successText: {
    fontSize: FontSize.bodySmall,
    color: Colors.success,
    fontWeight: FontWeight.semibold,
    textAlign: 'center',
  },
});
