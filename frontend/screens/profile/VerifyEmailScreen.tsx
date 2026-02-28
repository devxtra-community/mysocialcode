import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function VerifyEmailScreen() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');

  const [otpSent, setOtpSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await api.get('/user/me');
        console.log('ME RESPONSE:', res.data.email, res.data);
        setEmail(res.data.user.email);
        setVerified(res.data.user.isEmailVerified);
      } catch (error) {
        Alert.alert('Error', 'Failed to load user info');
      }
    }

    fetchUser();
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setTimeout(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [cooldown]);

  async function handleSendOtp() {
    if (cooldown > 0) return;

    setSendingOtp(true);

    try {
      await api.post('/auth/send-otp-email');
      setOtpSent(true);
      setCooldown(30);
      Alert.alert('Success', 'OTP sent to your email');
    } catch (error: any) {
      Alert.alert(
        'Error',
        error?.response?.data?.message || 'Failed to send OTP',
      );
    } finally {
      setSendingOtp(false);
    }
  }

  async function handleVerifyOtp() {
    if (!otp) {
      Alert.alert('Error', 'Enter OTP');
      return;
    }

    setVerifyingOtp(true);

    try {
      await api.post('/auth/verify-otp-email', { otp });
      setVerified(true);
      setOtp('');
      Alert.alert('Success', 'Email verified successfully');
    } catch (error: any) {
      Alert.alert(
        'Error',
        error?.response?.data?.message || 'Verification failed',
      );
    } finally {
      setVerifyingOtp(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify Email</Text>

      <Text style={styles.label}>Registered Email</Text>
      <View style={styles.emailBox}>
        <Text style={styles.emailText}>{email || 'Loading...'}</Text>
      </View>

      {verified ? (
        <Text style={styles.verifiedText}>Email Verified</Text>
      ) : (
        <>
          {/* SEND / RESEND BUTTON */}
          <Pressable
            style={[
              styles.button,
              (cooldown > 0 || sendingOtp) && styles.disabledButton,
            ]}
            onPress={handleSendOtp}
            disabled={cooldown > 0 || sendingOtp}
          >
            {sendingOtp ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>
                {otpSent ? 'Resend OTP' : 'Send OTP'}
              </Text>
            )}
          </Pressable>

          {/* COOLDOWN TEXT */}
          {cooldown > 0 && (
            <Text style={styles.timerText}>
              You can resend OTP in {cooldown}s
            </Text>
          )}

          {/* OTP SECTION — ONLY AFTER SEND */}
          {otpSent && (
            <View style={{ marginTop: 30 }}>
              <Text style={styles.label}>Enter OTP</Text>

              <TextInput
                style={styles.input}
                placeholder="Enter OTP"
                keyboardType="numeric"
                value={otp}
                onChangeText={setOtp}
              />

              <Pressable
                style={[styles.button, verifyingOtp && styles.disabledButton]}
                onPress={handleVerifyOtp}
                disabled={verifyingOtp}
              >
                {verifyingOtp ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Confirm OTP</Text>
                )}
              </Pressable>
            </View>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 30,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
  },
  emailBox: {
    padding: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    marginBottom: 20,
  },
  emailText: {
    fontSize: 15,
  },
  verifiedText: {
    textAlign: 'center',
    color: 'green',
    fontWeight: '600',
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 14,
    marginTop: 20,
    marginBottom: 16,
    fontSize: 15,
  },
  button: {
    backgroundColor: '#4f46e5',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  timerText: {
    textAlign: 'center',
    marginTop: 10,
    color: '#6b7280',
  },
});
