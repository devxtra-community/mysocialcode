import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="home/index" options={{ title: 'Home' }} />
      <Tabs.Screen name="search/index" options={{ title: 'Search' }} />
      <Tabs.Screen name="events/index" options={{ title: 'Events' }} />
      <Tabs.Screen name="events/[id]" options={{ href: null }} />
      <Tabs.Screen name="profile/index" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
