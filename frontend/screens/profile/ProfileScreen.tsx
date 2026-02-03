import api from '@/lib/api';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { getRefreshToken, clearTokens } from '@/services/token/token.storage';
import { router } from 'expo-router';

export default function ProfileScreen() {
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      <View style={styles.userCard}>
        <View style={styles.avatar} />
        <View>
          <Text style={styles.name}>Your Name</Text>
          <Text style={styles.subText}>+91 XXXXX XXXXX</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Pressable style={styles.row}>
          <Text style={styles.rowText}>Edit Profile</Text>
        </Pressable>

        <Pressable style={styles.row}>
          <Text style={styles.rowText}>Settings</Text>
        </Pressable>

        <Pressable style={styles.row}>
          <Text style={styles.rowText}>Help & Support</Text>
        </Pressable>

        <Pressable style={styles.row} onPress={handleLogout}>
          <Text style={styles.LogOut}>Log Out</Text>
        </Pressable>
        <Pressable style={styles.row} onPress={handleLogoutTest}>
          <Text style={styles.LogOut}>Logt out for web</Text>
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
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#e5e7eb',
    marginRight: 16,
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
});
