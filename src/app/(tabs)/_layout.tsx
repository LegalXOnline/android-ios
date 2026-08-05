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
          paddingBottom: Platform.OS === 'android' ? 8 : 0,
          height: Platform.OS === 'android' ? 64 : 49,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarAccessibilityLabel: 'Home tab',
        }}
      />

      <Tabs.Screen
        name="documentation"
        options={{
          title: 'Documentation',
          tabBarAccessibilityLabel: 'Documentation tab',
        }}
        listeners={({ navigation }) => ({
          tabPress: () => {
            navigation.navigate('documentation', { screen: 'index' });
          },
        })}
      />

      <Tabs.Screen
        name="knowledge-centre"
        options={{
          title: 'Knowledge',
          tabBarAccessibilityLabel: 'Knowledge Centre tab',
        }}
      />

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
