import api from '@/lib/api';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import { getRefreshToken, clearTokens } from '@/services/token/token.storage';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';

export interface UserProfileType {
  id: string;
  name: string;
  email: string | null;
  phoneNumber: string | null;
  age: number | null;
  gender: string | null;
  interests: string[] | null;
  profileImageUrl: string | null;
  isPhoneVerified: boolean;
  createdAt: string;
}

export default function ProfileScreen() {
  const [user, setUser] = useState<UserProfileType | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const defaultAvatar = require('@/assets/images/OIP.jpeg');

  async function fetchProfile() {
    try {
      setLoading(true);

      const res = await api.get('/user/me');
      console.log(res.data);
      console.log('Avatar URL:', res.data.user.profileImageUrl);

      setUser(res.data.user);
    } catch (err) {
      console.error('Failed to fetch profile', err);
    } finally {
      setLoading(false);
    }
  }

  const handleLogout = () => {
    Alert.alert('Log out', 'Are you sure bro?', [
      {
        text: 'Cancel',
        style: 'destructive',
      },
      {
        text: 'Log out',
        style: 'destructive',
        onPress: async () => {
          const refreshToken = await getRefreshToken();
          const res = await api.post('/auth/logout', { refreshToken });
          console.log('inside logout fn');
          console.log(res.data);
          if (res.data.success) {
            await clearTokens();
            router.push('/(auth)');
          }
        },
      },
    ]);
  };

  async function handleLogoutTest() {
    const refreshToken = await getRefreshToken();
    const res = await api.post('/auth/logout', { refreshToken });
    console.log('inside logout fn');
    console.log(res.data);
    if (res.data.success) {
      await clearTokens();
      router.push('/(auth)/login');
    }
  }

  const handleSettings = () => {
    router.push('/profile/setting');
  };

  const handleProfile = async () => {
    router.push('/profile/edit');
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }

  if (!user) {
    return <Text>Failed to load profile</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      <View style={styles.userCard}>
        <Image
          key={user.profileImageUrl}
          source={
            user.profileImageUrl ? { uri: user.profileImageUrl } : defaultAvatar
          }
          style={styles.avatar}
        />

        <View>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.subText}>
            {user.phoneNumber || 'Phone not added'}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Pressable style={styles.row} onPress={handleProfile}>
          <Text style={styles.rowText}>Edit Profile</Text>
        </Pressable>

        <Pressable style={styles.row} onPress={handleSettings}>
          <Text style={styles.rowText}>Settings</Text>
        </Pressable>

        <Pressable style={styles.row}>
          <Text style={styles.rowText}>Help & Support</Text>
        </Pressable>

        <Pressable style={styles.row} onPress={handleLogout}>
          <Text style={styles.LogOut}>Log Out</Text>
        </Pressable>
        <Pressable style={styles.row} onPress={handleLogoutTest}>
          <Text style={styles.LogOut}>Log out for web</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    gap: 16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#e5e7eb',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  subText: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  section: {
    borderTopWidth: 0.5,
    borderTopColor: '#e5e7eb',
  },
  row: {
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#e5e7eb',
  },
  rowText: {
    fontSize: 15,
  },
  LogOut: {
    fontSize: 15,
    color: 'red',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
