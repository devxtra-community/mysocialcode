import { Tabs } from 'expo-router';
import { Home, Search, Ticket, User } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 60,
          paddingTop: 6,
          paddingBottom: 6,
        },
        tabBarActiveTintColor: '#22c55e',
        tabBarInactiveTintColor: '#9ca3af',
      }}
    >
      <Tabs.Screen
        name="home/index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Home color={color} size={size} strokeWidth={1} />
          ),
        }}
      />
      <Tabs.Screen
        name="search/index"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, size }) => (
            <Search color={color} size={size} strokeWidth={1} />
          ),
        }}
      />
      <Tabs.Screen
        name="events/index"
        options={{
          title: 'Events',
          tabBarIcon: ({ color, size }) => (
            <Ticket color={color} size={size} strokeWidth={1} />
          ),
        }}
      />
      <Tabs.Screen name="events/[id]" options={{ href: null }} />
      <Tabs.Screen
        name="profile/index"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <User color={color} size={size} strokeWidth={1} />
          ),
        }}
      />
      <Tabs.Screen name='events/create' options={{href:null}}/>
    </Tabs>
    
  );
}
