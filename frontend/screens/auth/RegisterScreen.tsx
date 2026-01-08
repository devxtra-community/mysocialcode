import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
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
  const { otpId } = useLocalSearchParams<{ otpId: string }>();

  const [step, setStep] = useState<1 | 2>(1);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other' | ''>('');

  const [interests, setInterests] = useState<string[]>([]);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const toggleInterest = (interest: string) => {
    setInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest],
    );
  };

  const handleNext = () => {
    if (!name || !gender) {
      Alert.alert('Missing info', 'Name and gender are required');
      return;
    }
    setStep(2);
  };

  const handleFinish = async () => {
    if (!otpId) {
      Alert.alert('Error', 'OTP session expired');
      return;
    }

    if (!password || !confirmPassword) {
      Alert.alert('Password required', 'Please enter password');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    if (!gender) {
      Alert.alert('Error', 'Please select gender');
      return;
    }

    try {
      const res = await registerUser({
        otpId: otpId.toString(),
        name,
        email,
        age: age ? Number(age) : undefined,
        gender,
        interests,
        password,
        confirmPassword,
      });

      if (res?.success) {
        router.replace('/(tabs)/home');
      } else {
        Alert.alert('Registration failed', res?.message || 'Try again');
      }
    } catch (err) {
      Alert.alert('Error', 'Something went wrong');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {step === 1 && (
          <>
            <Text style={styles.title}>Complete your profile</Text>

            <TextInput
              style={styles.input}
              placeholder="Full name"
              value={name}
              onChangeText={setName}
            />

            <TextInput
              style={styles.input}
              placeholder="Email"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />

            <TextInput
              style={styles.input}
              placeholder="Age (optional)"
              keyboardType="number-pad"
              value={age}
              onChangeText={setAge}
            />

            <Text style={styles.label}>Select gender</Text>

            {['male', 'female', 'other'].map((g) => (
              <TouchableOpacity
                key={g}
                style={[styles.option, gender === g && styles.optionActive]}
                onPress={() => setGender(g as any)}
              >
                <Text
                  style={[
                    styles.optionText,
                    gender === g && styles.optionTextActive,
                  ]}
                >
                  {g}
                </Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity style={styles.primaryBtn} onPress={handleNext}>
              <Text style={styles.primaryText}>Next</Text>
            </TouchableOpacity>
          </>
        )}

        {step === 2 && (
          <>
            <Text style={styles.title}>Finish setup</Text>

            <Text style={styles.label}>Select interests</Text>
            <View style={styles.grid}>
              {INTERESTS.map((interest) => (
                <TouchableOpacity
                  key={interest}
                  style={[
                    styles.chip,
                    interests.includes(interest) && styles.chipActive,
                  ]}
                  onPress={() => toggleInterest(interest)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      interests.includes(interest) && styles.chipTextActive,
                    ]}
                  >
                    {interest}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <TextInput
              style={styles.input}
              placeholder="Confirm password"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />

            <TouchableOpacity style={styles.primaryBtn} onPress={handleFinish}>
              <Text style={styles.primaryText}>Create Account</Text>
            </TouchableOpacity>
          </>
        )}
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
    padding: 20,
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 20,
  },
  label: {
    marginTop: 10,
    marginBottom: 6,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  option: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 8,
  },
  optionActive: {
    borderColor: '#000',
    backgroundColor: '#f2f2f2',
  },
  optionText: {
    textTransform: 'capitalize',
  },
  optionTextActive: {
    fontWeight: '600',
  },
  primaryBtn: {
    backgroundColor: '#000',
    padding: 14,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  primaryText: {
    color: '#fff',
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  chip: {
    borderWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  chipActive: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  chipText: {
    fontSize: 14,
  },
  chipTextActive: {
    color: '#fff',
  },
});
