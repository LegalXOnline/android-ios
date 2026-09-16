import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import {
  AppHeader,
  Chip,
  Divider,
  SafeScreenWrapper,
} from '@shared/components';
import { Colors, FontSize, FontWeight, Layout, Radii, Shadows, Spacing, Typography } from '@theme';
import { useGoBack } from '@shared/hooks/useGoBack';

export function SettingsScreen() {
  const goBack = useGoBack();
  const [selectedTheme, setSelectedTheme] = useState<'Light' | 'Dark' | 'System'>('Light');
  const [selectedLanguage, setSelectedLanguage] = useState<'English' | 'Hindi' | 'Telugu'>('English');
  const [activeNotice, setActiveNotice] = useState('');

  const handleLegalLink = (title: string) => {
    setActiveNotice(`${title} page (UI placeholder)`);
    setTimeout(() => setActiveNotice(''), 2500);
  };

  return (
    <SafeScreenWrapper edges={['top', 'left', 'right']}>
      <AppHeader title="Settings" showBack onBackPress={goBack} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {activeNotice ? (
          <View style={styles.toast}>
            <Text style={styles.toastText}>{activeNotice}</Text>
          </View>
        ) : null}

        <View style={styles.sectionBlock}>
          <Text style={styles.sectionTitle}>App Appearance (Theme)</Text>
          <View style={styles.chipRow}>
            {(['Light', 'Dark', 'System'] as const).map((t) => (
              <Chip
                key={t}
                label={t}
                selected={selectedTheme === t}
                onPress={() => setSelectedTheme(t)}
              />
            ))}
          </View>
        </View>

        <View style={styles.sectionBlock}>
          <Text style={styles.sectionTitle}>Preferred Language</Text>
          <View style={styles.chipRow}>
            {(['English', 'Hindi', 'Telugu'] as const).map((l) => (
              <Chip
                key={l}
                label={l}
                selected={selectedLanguage === l}
                onPress={() => setSelectedLanguage(l)}
              />
            ))}
          </View>
        </View>

        <Divider />

        <View style={styles.sectionBlock}>
          <Text style={styles.sectionTitle}>Legal & Privacy</Text>

          <View style={styles.cardList}>
            <Pressable
              onPress={() => handleLegalLink('Privacy Policy')}
              style={({ pressed }) => [styles.linkRow, pressed && styles.pressed]}
            >
              <Text style={styles.linkTitle}>Privacy Policy</Text>
              <SymbolView
                name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
                size={18}
                tintColor={Colors.textSecondary}
              />
            </Pressable>

            <Divider style={styles.rowDivider} />

            <Pressable
              onPress={() => handleLegalLink('Terms of Service')}
              style={({ pressed }) => [styles.linkRow, pressed && styles.pressed]}
            >
              <Text style={styles.linkTitle}>Terms of Service</Text>
              <SymbolView
                name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
                size={18}
                tintColor={Colors.textSecondary}
              />
            </Pressable>

            <Divider style={styles.rowDivider} />

            <Pressable
              onPress={() => handleLegalLink('About LegalX')}
              style={({ pressed }) => [styles.linkRow, pressed && styles.pressed]}
            >
              <Text style={styles.linkTitle}>About LegalX Platform</Text>
              <SymbolView
                name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
                size={18}
                tintColor={Colors.textSecondary}
              />
            </Pressable>
          </View>
        </View>

        <View style={styles.versionBlock}>
          <Text style={styles.versionTitle}>LegalX Mobile Edition</Text>
          <Text style={styles.versionSub}>Version 1.0.0 (Build 2026.08)</Text>
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
    paddingBottom: Spacing.xxl + 20,
    gap: Spacing.xl,
  },
  toast: {
    backgroundColor: Colors.ink,
    padding: Spacing.sm,
    borderRadius: Radii.button,
    alignItems: 'center',
  },
  toastText: {
    fontSize: FontSize.bodySmall,
    color: Colors.surfaceAlt,
    fontWeight: FontWeight.medium,
  },
  sectionBlock: {
    gap: Spacing.sm,
  },
  sectionTitle: {
    ...Typography.h2,
    fontSize: 18,
    color: Colors.ink,
  },
  chipRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  cardList: {
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radii.card,
    overflow: 'hidden',
    ...Shadows.card,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
  },
  linkTitle: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.medium,
    color: Colors.ink,
  },
  pressed: {
    opacity: 0.85,
  },
  rowDivider: {
    marginVertical: 0,
  },
  versionBlock: {
    alignItems: 'center',
    gap: 2,
    marginTop: Spacing.md,
  },
  versionTitle: {
    fontSize: FontSize.bodySmall,
    fontWeight: FontWeight.semibold,
    color: Colors.ink,
  },
  versionSub: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
});
