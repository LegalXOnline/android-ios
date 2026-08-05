import { Tabs } from 'expo-router';
import { SymbolView } from 'expo-symbols';
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
          tabBarIcon: ({ color, size }) => (
            <SymbolView
              name={{ ios: 'house.fill', android: 'home', web: 'home' }}
              size={size || 24}
              tintColor={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="documentation"
        options={{
          title: 'Documentation',
          tabBarAccessibilityLabel: 'Documentation tab',
          tabBarIcon: ({ color, size }) => (
            <SymbolView
              name={{ ios: 'doc.text.fill', android: 'description', web: 'description' }}
              size={size || 24}
              tintColor={color}
            />
          ),
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
          tabBarIcon: ({ color, size }) => (
            <SymbolView
              name={{ ios: 'book.fill', android: 'menu_book', web: 'menu_book' }}
              size={size || 24}
              tintColor={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="talk-to-lawyer"
        options={{
          title: 'Talk to Lawyer',
          tabBarAccessibilityLabel: 'Talk to Lawyer tab',
          tabBarIcon: ({ color, size }) => (
            <SymbolView
              name={{ ios: 'person.fill', android: 'support_agent', web: 'support_agent' }}
              size={size || 24}
              tintColor={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
