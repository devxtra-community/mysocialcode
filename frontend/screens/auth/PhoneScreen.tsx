import { View, Text, TextInput, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { router } from 'expo-router';
import { sendOtp } from '@/services/auth/otp.service';

export default function PhoneScreen() {
  const [phone, setPhone] = useState('');

  const handleContinue = async () => {
    if (!phone) return;
      const fullPhoneNumber = `+91${phone}`;
    const res = await sendOtp(fullPhoneNumber);

    if (res.success) {
      router.push({
        pathname: '/(auth)/otp',
        params: { phone:fullPhoneNumber },
      });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Enter your phone number</Text>

          <Text style={styles.description}>
            We’ll send you a one-time password to verify your number.
          </Text>

          <View style={styles.inputWrapper}>
            <Text style={styles.countryCode}>+91</Text>
            <TextInput
              style={styles.input}
              placeholder="Phone number"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
              maxLength={10}
            />
          </View>

          <Pressable
            style={[styles.button, !phone && styles.buttonDisabled]}
            onPress={handleContinue}
            disabled={!phone}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#EAF5EC',
  },

  container: {
    flex: 1,
    paddingHorizontal: 24,
  },

  content: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111',
    marginBottom: 8,
  },

  description: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    marginBottom: 24,
  },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 52,
    marginBottom: 24,
  },

  countryCode: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },

  input: {
    flex: 1,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#000',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },

  buttonDisabled: {
    opacity: 0.5,
  },

  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
