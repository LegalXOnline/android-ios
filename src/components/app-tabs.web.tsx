/**
 * Web tab bar — updated for LegalX navigation structure.
 *
 * Note: LegalX V1 is Android-only (24_AI_BUILD_GUIDE.md §20).
 * This web component is kept only because expo-router may require it
 * for the UI tab fallback. It will not be user-facing in V1.
 */
import { TabList, TabSlot, TabTrigger, Tabs } from 'expo-router/ui';
import type { TabListProps, TabTriggerSlotProps } from 'expo-router/ui';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

// Use existing constants/theme spacing to avoid conflicts with old naming
import { Spacing } from '@/constants/theme';

export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot style={{ height: '100%' }} />
      <TabList asChild>
        <CustomTabList>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <TabTrigger name="home" href={'/(tabs)' as any} asChild>
            <TabButton>Home</TabButton>
          </TabTrigger>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <TabTrigger name="documentation" href={'/(tabs)/documentation' as any} asChild>
            <TabButton>Documentation</TabButton>
          </TabTrigger>
          <TabTrigger name="knowledge-centre" href="/(tabs)/knowledge-centre" asChild>
            <TabButton>Knowledge</TabButton>
          </TabTrigger>
          <TabTrigger name="talk-to-lawyer" href="/(tabs)/talk-to-lawyer" asChild>
            <TabButton>Talk to Lawyer</TabButton>
          </TabTrigger>
        </CustomTabList>
      </TabList>
    </Tabs>
  );
}

export function TabButton({ children, isFocused, ...props }: TabTriggerSlotProps) {
  return (
    <Pressable {...props} style={({ pressed }) => pressed && styles.pressed}>
      <ThemedView
        type={isFocused ? 'backgroundSelected' : 'backgroundElement'}
        style={styles.tabButtonView}
      >
        <ThemedText type="small" themeColor={isFocused ? 'text' : 'textSecondary'}>
          {children}
        </ThemedText>
      </ThemedView>
    </Pressable>
  );
}

export function CustomTabList(props: TabListProps) {
  return (
    <View {...props} style={styles.tabListContainer}>
      <ThemedView type="backgroundElement" style={styles.innerContainer}>
        {props.children}
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  tabListContainer: {
    position: 'absolute',
    width: '100%',
    padding: Spacing.three,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  innerContainer: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.four,
    borderRadius: Spacing.four,
    flexDirection: 'row',
    alignItems: 'center',
    flexGrow: 1,
    gap: Spacing.two,
  },
  pressed: {
    opacity: 0.7,
  },
  tabButtonView: {
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.three,
  },
});
