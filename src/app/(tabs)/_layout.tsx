/**
 * 4-Tab bottom navigator layout.
 *
 * Tab order (fixed — 02_Information_Architecture.md §1):
 *   1. Home
 *   2. Documentation
 *   3. Knowledge Centre
 *   4. Talk to Lawyer
 *
 * Rules:
 * - Exactly 4 tabs. Never a 5th tab. (24_AI_BUILD_GUIDE.md §11)
 * - Profile is NOT a tab — it is a stack pushed from the Home avatar icon.
 * - Icons always paired with text labels. (04_Design_System.md §7)
 * - Tab bar uses LegalX design tokens (single theme, no color-scheme detection).
 */
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';

import { Colors } from '@theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarStyle: {
          backgroundColor: Colors.surfaceAlt,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          // Extra bottom padding on Android for gesture bar
          paddingBottom: Platform.OS === 'android' ? 8 : 0,
          height: Platform.OS === 'android' ? 64 : 49,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
      }}
    >
      {/* Tab 1 — Home */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarAccessibilityLabel: 'Home tab',
        }}
      />

      {/* Tab 2 — Documentation */}
      <Tabs.Screen
        name="documentation"
        options={{
          title: 'Documentation',
          tabBarAccessibilityLabel: 'Documentation tab',
        }}
      />

      {/* Tab 3 — Knowledge Centre */}
      <Tabs.Screen
        name="knowledge-centre"
        options={{
          title: 'Knowledge',
          tabBarAccessibilityLabel: 'Knowledge Centre tab',
        }}
      />

      {/* Tab 4 — Talk to Lawyer */}
      <Tabs.Screen
        name="talk-to-lawyer"
        options={{
          title: 'Talk to Lawyer',
          tabBarAccessibilityLabel: 'Talk to Lawyer tab',
        }}
      />
    </Tabs>
  );
}
