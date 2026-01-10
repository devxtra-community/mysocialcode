import { View, Text, TextInput, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { verifyOtp } from '@/services/auth/otp.service';
import { useLocalSearchParams } from 'expo-router/build/hooks';

export default function OtpScreen() {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { phone } = useLocalSearchParams();

  const handleVerify = async () => {
    if (!otp || otp.length < 4) return;

    setLoading(true);
    const res = await verifyOtp(phone.toString(), otp);
    setLoading(false);

    if (!res?.success) return;

    if (res.userExists) {
      router.replace('/(tabs)/home');
    } else {
      router.replace({
        pathname: '/(auth)/register',
        params: {
          otpId: res.otpId,
          phoneNumber: phone.toString(),
        },
      });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Enter OTP</Text>

          <Text style={styles.description}>
            We’ve sent a one-time password to{' '}
            <Text style={styles.phone}>{phone}</Text>
          </Text>

          <TextInput
            style={styles.otpInput}
            placeholder="••••"
            keyboardType="number-pad"
            value={otp}
            onChangeText={setOtp}
            maxLength={6}
            textAlign="center"
          />

          <Pressable
            style={[
              styles.button,
              (otp.length < 4 || loading) && styles.buttonDisabled,
            ]}
            onPress={handleVerify}
            disabled={otp.length < 4 || loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Verifying...' : 'Verify OTP'}
            </Text>
          </Pressable>

          <Text style={styles.resend}>
            Didn’t receive OTP? <Text style={styles.resendLink}>Resend</Text>
          </Text>
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
    marginBottom: 32,
  },

  phone: {
    fontWeight: '600',
    color: '#111',
  },

  otpInput: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    height: 56,
    fontSize: 20,
    letterSpacing: 12,
    marginBottom: 24,
  },

  button: {
    backgroundColor: '#000',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 16,
  },

  buttonDisabled: {
    opacity: 0.5,
  },

  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },

  resend: {
    textAlign: 'center',
    fontSize: 13,
    color: '#555',
  },

  resendLink: {
    fontWeight: '600',
    color: '#000',
  },
});
