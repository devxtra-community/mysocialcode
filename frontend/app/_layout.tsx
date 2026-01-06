import { Stack } from 'expo-router';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RootLayout() {
  const [hasSeenInro, setHasSeenIntro] = useState<boolean | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    async function loadIntro() {
      const value = await AsyncStorage.getItem('hasSeenInto');
      setHasSeenIntro(value === 'true');
    }
    loadIntro();
  }, []);

  if (hasSeenInro === null) {
    return null;
  }
  if (!hasSeenInro) {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)/intro" />
      </Stack>
    );
  }
  if (!isAuthenticated) {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
      </Stack>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
