import { Tabs } from 'expo-router';

import {
  FloatingTabBar,
  TabBarVisibilityProvider,
} from '@shared/components/navigation/FloatingTabBar';

export default function TabsLayout() {
  return (
    <TabBarVisibilityProvider>
      <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <FloatingTabBar {...props} />}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen
        name="documentation"
        options={{ title: 'Docs' }}
        listeners={({ navigation }) => ({
          tabPress: () => navigation.navigate('documentation', { screen: 'index' }),
        })}
      />
      <Tabs.Screen name="knowledge-centre" options={{ title: 'Learn' }} />
      <Tabs.Screen name="talk-to-lawyer" options={{ title: 'Lawyers' }} />
      </Tabs>
    </TabBarVisibilityProvider>
  );
}
