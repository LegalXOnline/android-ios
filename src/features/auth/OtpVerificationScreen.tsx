import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import {
  AppHeader,
  AppTextInput,
  PrimaryButton,
  SafeScreenWrapper,
} from '@shared/components';
import { Colors, FontSize, FontWeight, Layout, Spacing, Typography } from '@theme';

export function OtpVerificationScreen() {
  const router = useRouter();
  const [otpCode, setOtpCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [resendTimer, setResendTimer] = useState(30);

  const handleVerify = () => {
    if (otpCode.length < 4) {
      setErrorMsg('Please enter the valid 6-digit verification code.');
      return;
    }
    setErrorMsg('');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    router.replace('/(tabs)' as any);
  };

  const handleResend = () => {
    setResendTimer(30);
    setErrorMsg('');
  };

  return (
    <SafeScreenWrapper edges={['top', 'left', 'right']}>
      <AppHeader title="OTP Verification" showBack onBackPress={() => router.back()} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerBlock}>
          <Text style={styles.title}>Enter Verification Code</Text>
          <Text style={styles.subtitle}>
            We have sent a 6-digit OTP to your registered phone number / email address.
          </Text>
        </View>

        <View style={styles.formBlock}>
          <AppTextInput
            label="6-Digit OTP Code"
            value={otpCode}
            onChangeText={setOtpCode}
            placeholder="• • • • • •"
            keyboardType="number-pad"
            maxLength={6}
            testID="otp-input"
          />

          {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

          <View style={styles.resendRow}>
            <Text style={styles.resendInfo}>Did not receive code?</Text>
            <Pressable onPress={handleResend} style={styles.resendBtn}>
              <Text style={styles.resendText}>
                {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
              </Text>
            </Pressable>
          </View>

          <PrimaryButton
            label="Verify & Continue"
            onPress={handleVerify}
            testID="otp-verify-button"
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
    paddingVertical: Spacing.lg,
    gap: Spacing.xl,
  },
  headerBlock: {
    gap: Spacing.xs,
  },
  title: {
    ...Typography.h1,
    fontSize: 24,
    color: Colors.ink,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  formBlock: {
    gap: Spacing.md,
  },
  errorText: {
    fontSize: FontSize.bodySmall,
    color: Colors.danger,
    fontWeight: FontWeight.medium,
  },
  resendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  resendInfo: {
    fontSize: FontSize.bodySmall,
    color: Colors.textSecondary,
  },
  resendBtn: {
    paddingVertical: Spacing.xs,
  },
  resendText: {
    fontSize: FontSize.bodySmall,
    color: Colors.primary,
    fontWeight: FontWeight.semibold,
  },
});
