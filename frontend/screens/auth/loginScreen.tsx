import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { loginUser } from '@/services/auth/otp.service';

export default function LoginScreen() {
  const router = useRouter();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');

  async function handleLogin() {
    const res = await loginUser({ phoneNumber, password });

    if (res?.success) {
      router.replace('/(tabs)/home');
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>

        <TextInput
          style={styles.input}
          placeholder="Phone number"
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.primaryBtn} onPress={handleLogin}>
          <Text style={styles.primaryText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.link}
          onPress={() => router.push('/(auth)/phone')}
        >
          <Text style={styles.linkText}>Create new account</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 14,
  },
  primaryBtn: {
    backgroundColor: '#000',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  primaryText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  link: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    color: '#555',
  },
});
