import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import {
  AppHeader,
  AppTextInput,
  PrimaryButton,
  SafeScreenWrapper,
} from '@shared/components';
import { Colors, FontSize, FontWeight, Layout, Spacing, Typography } from '@theme';

import { PLACEHOLDER_USER_PROFILE } from './profile.placeholder';

export function EditProfileScreen() {
  const router = useRouter();
  const [name, setName] = useState(PLACEHOLDER_USER_PROFILE.name);
  const [email, setEmail] = useState(PLACEHOLDER_USER_PROFILE.email);
  const [phone, setPhone] = useState(PLACEHOLDER_USER_PROFILE.phone);
  const [address, setAddress] = useState(PLACEHOLDER_USER_PROFILE.address);
  const [city, setCity] = useState(PLACEHOLDER_USER_PROFILE.city);
  const [state, setState] = useState(PLACEHOLDER_USER_PROFILE.state);
  const [pincode, setPincode] = useState(PLACEHOLDER_USER_PROFILE.pincode);
  const [successMsg, setSuccessMsg] = useState('');

  const handleSave = () => {
    setSuccessMsg('Profile updated successfully!');
    setTimeout(() => {
      router.back();
    }, 1200);
  };

  return (
    <SafeScreenWrapper edges={['top', 'left', 'right']}>
      <AppHeader title="Edit Profile" showBack onBackPress={() => router.back()} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formBlock}>
          <Text style={styles.sectionTitle}>Personal Details</Text>

          <AppTextInput
            label="Full Name"
            value={name}
            onChangeText={setName}
            placeholder="Your name"
            testID="edit-name-input"
          />

          <AppTextInput
            label="Email Address"
            value={email}
            onChangeText={setEmail}
            placeholder="user@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            testID="edit-email-input"
          />

          <AppTextInput
            label="Mobile Phone Number"
            value={phone}
            onChangeText={setPhone}
            placeholder="+91 98765 43210"
            keyboardType="phone-pad"
            testID="edit-phone-input"
          />
        </View>

        <View style={styles.formBlock}>
          <Text style={styles.sectionTitle}>Address & Jurisdiction</Text>

          <AppTextInput
            label="Street Address / Building"
            value={address}
            onChangeText={setAddress}
            placeholder="Address line"
            testID="edit-address-input"
          />

          <View style={styles.rowTwo}>
            <View style={styles.flexOne}>
              <AppTextInput
                label="City"
                value={city}
                onChangeText={setCity}
                placeholder="City"
                testID="edit-city-input"
              />
            </View>
            <View style={styles.flexOne}>
              <AppTextInput
                label="State"
                value={state}
                onChangeText={setState}
                placeholder="State"
                testID="edit-state-input"
              />
            </View>
          </View>

          <AppTextInput
            label="Pincode"
            value={pincode}
            onChangeText={setPincode}
            placeholder="122002"
            keyboardType="number-pad"
            maxLength={6}
            testID="edit-pincode-input"
          />
        </View>

        {successMsg ? <Text style={styles.successText}>{successMsg}</Text> : null}

        <PrimaryButton
          label="Save Changes"
          onPress={handleSave}
          testID="save-profile-button"
        />
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
  rowTwo: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  flexOne: {
    flex: 1,
  },
  successText: {
    fontSize: FontSize.bodySmall,
    color: Colors.success,
    fontWeight: FontWeight.semibold,
    textAlign: 'center',
  },
});
