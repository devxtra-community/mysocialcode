import { View, Text, TextInput, Button, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { registerUser } from '@/services/auth/otp.service';

const INTERESTS = [
  'Technology',
  'Music',
  'Sports',
  'Travel',
  'Fitness',
  'Photography',
];

export default function RegisterScreen() {
  const router = useRouter();
  const { otpId } = useLocalSearchParams();

  // step control
  const [step, setStep] = useState<1 | 2>(1);

  // profile data
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other' | ''>('');

  const [interests, setInterests] = useState<string[]>([]);

  const toggleInterest = (interest: string) => {
    setInterests((prev) => {
      if (prev.includes(interest)) {
        return prev.filter((i) => i !== interest);
      } else {
        return [...prev, interest];
      }
    });
  };

  const handleNext = () => {
    if (!name || !gender) return;
    setStep(2);
  };

  const handleFinish = async () => {
    if (!otpId) return;
    if (!gender) return;

    const res = await registerUser({
      otpId: otpId.toString(),
      name,
      email,
      age: age ? Number(age) : undefined,
      gender,
      interests,
    });
    console.log(res);

    if (!res?.success) return;

    router.replace('/(tabs)/home');
  };

  return (
    <View>
      {step === 1 && (
        <>
          <Text>Complete your profile</Text>

          <TextInput
            placeholder="Full name"
            value={name}
            onChangeText={setName}
          />

          <TextInput
            placeholder="Email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            placeholder="Age"
            keyboardType="number-pad"
            value={age}
            onChangeText={setAge}
          />

          <Text>Select gender</Text>

          {['male', 'female', 'other'].map((g) => (
            <TouchableOpacity key={g} onPress={() => setGender(g as any)}>
              <Text>
                {gender === g ? '🔘 ' : '⚪ '}
                {g}
              </Text>
            </TouchableOpacity>
          ))}

          <Button title="Next" onPress={handleNext} />
        </>
      )}

      {step === 2 && (
        <>
          <Text>Select your interests</Text>

          {INTERESTS.map((interest) => (
            <TouchableOpacity
              key={interest}
              onPress={() => toggleInterest(interest)}
            >
              <Text>
                {interests.includes(interest) ? '✅ ' : '⬜ '}
                {interest}
              </Text>
            </TouchableOpacity>
          ))}

          <Button title="Finish" onPress={handleFinish} />
        </>
      )}
    </View>
  );
}
