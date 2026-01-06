import { View, Text, TextInput, Button } from 'react-native';
import { sendOtp } from '@/services/auth/otp.service';
import { useState } from 'react';
import { useRouter } from 'expo-router';

export default function PhoneScreen() {
  const [phone, setPhone] = useState('');
  const router = useRouter();

  const handleContinue = async () => {
    const res = await sendOtp(phone);
    console.log(res);

    if (res.success) {
      router.push({
        pathname: '/(auth)/otp',
        params: {
          phoneNumber: phone,
        },
      });
    }
  };

  return (
    <View>
      <Text>Enter your phone number</Text>

      <TextInput
        placeholder="Phone number"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />

      <Button title="Continue" onPress={handleContinue} />
    </View>
  );
}
