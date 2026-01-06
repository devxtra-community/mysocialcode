import { View, Text, TextInput, Button } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { verifyOtp } from '@/services/auth/otp.service';
import { useLocalSearchParams, useSearchParams } from 'expo-router/build/hooks';

export default function OtpScreen() {
  const [otp, setOtp] = useState('');
  const router = useRouter();
  const { phoneNumber } = useLocalSearchParams();

  const handleVerify = async () => {
    const res = await verifyOtp(phoneNumber.toString(), otp);
    console.log(res);
    if (!res?.success) return;
    if (res.success) {
      if (res.userExists) {
        router.replace('/(tabs)/home');
      } else {
        router.replace({
          pathname: '/(auth)/register',
          params: {
            otpId: res.otpId,
            phoneNumber: phoneNumber.toString(),
          },
        });
      }
    }
  };

  return (
    <View>
      <Text>Enter OTP</Text>

      <TextInput
        placeholder="OTP"
        keyboardType="number-pad"
        value={otp}
        onChangeText={setOtp}
      />

      <Button title="Verify OTP" onPress={handleVerify} />
    </View>
  );
}
