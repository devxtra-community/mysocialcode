import api from '@/lib/api';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
export default function EventBoostScrees() {
  const [duration, setDuration] = useState('');
  const { id } = useLocalSearchParams();
  async function handleBoost() {
    console.log(id);

    const res = await api.post('/boost/purchase', {
      eventId: id,
      duration: Number(duration),
    });
    console.log(res.data);
  }
  return (
    <SafeAreaView>
      <View>
        <TextInput
          onChangeText={setDuration}
          value={duration}
          placeholder="enter duration"
        />
      </View>
      <Pressable
        onPress={() => {
          handleBoost();
        }}
      >
        <Text>boost</Text>
      </Pressable>
    </SafeAreaView>
  );
}
