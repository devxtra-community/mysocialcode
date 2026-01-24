import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';
import { getAccessToken } from '@/services/token/token.storage';
import { toastConfig } from '@/utils/toastConfig';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View, ActivityIndicator } from 'react-native';

export default function RootLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    async function loadState() {
      const token = await getAccessToken();
      setIsAuthenticated(!!token);
    }

    loadState();
  }, []);

  // Loading screen while checking token
  if (isAuthenticated === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="(tabs)" />
        ) : (
          <Stack.Screen name="(auth)" />
        )}
      </Stack>

      <Toast config={toastConfig} />
    </GestureHandlerRootView>
  );
}
