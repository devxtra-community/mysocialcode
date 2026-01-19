import api from '@/lib/api';
import { useState } from 'react';
import {
  View,
  Pressable,
  TextInput,
  Text,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { showError } from '@/utils/toast';
export default function CreateEventScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  async function pickImages() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      showError('permisson needed bro');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      selectionLimit: 4,
      mediaTypes: ['images'],
      quality: 0.8,
    });

    if (!result.canceled) {
      const selected = result.assets.map((assets) => assets.uri);
      setImages(selected);
    }
  }
  async function handleEvent() {
    try {
      const form = new FormData();

      form.append('title', title);
      form.append('description', description);
      images.forEach((uri, index) => {
        form.append('images', {
          uri,
          name: `image_${index}.jpg`,
          type: 'image/jpeg',
        } as any);
      });
      form.append('startDate', startDate?.toISOString() || '');
      form.append('endDate', endDate?.toISOString() || '');

      const res = await api.post('event/create-event', form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log(res.data);
    } catch (err) {
      console.log('upload failed:', err);
    }
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }
  const openPicker = (type: 'start' | 'end') => {
    const current =
      type === 'start' ? startDate || new Date() : endDate || new Date();

    DateTimePickerAndroid.open({
      value: current,
      mode: 'date',
      is24Hour: true,
      onChange: (event, selectedDate) => {
        if (event.type === 'dismissed' || !selectedDate) return;

        DateTimePickerAndroid.open({
          value: selectedDate,
          mode: 'time',
          is24Hour: true,
          onChange: (event2, selectedTime) => {
            if (event2.type === 'dismissed' || !selectedTime) return;

            const finalDate = new Date(selectedDate);
            finalDate.setHours(selectedTime.getHours());
            finalDate.setMinutes(selectedTime.getMinutes());

            if (type === 'start') {
              setStartDate(finalDate);
            } else {
              setEndDate(finalDate);
            }
          },
        });
      },
    });
  };

  return (
    <SafeAreaView>
      <TextInput placeholder="title" value={title} onChangeText={setTitle} />
      <TextInput
        placeholder="description"
        value={description}
        onChangeText={setDescription}
      />
      <Pressable onPress={handleEvent}>
        <Text>create</Text>
      </Pressable>
      <Pressable onPress={pickImages}>
        <Text>Select Photos</Text>
      </Pressable>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {images.map((uri, ind) => (
          <View
            key={ind}
            style={{
              position: 'relative',
              marginRight: 10,
            }}
          >
            <Pressable
              onPress={() => removeImage(ind)}
              style={{
                position: 'absolute',
                top: -6,
                right: -6,
                backgroundColor: '#000',
                width: 18,
                height: 18,
                borderRadius: 9,
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 10,
              }}
            >
              <Text style={{ color: '#fff', fontSize: 12, lineHeight: 12 }}>
                ×
              </Text>
            </Pressable>

            <Image
              source={{ uri }}
              style={{
                width: 80,
                height: 80,
                borderRadius: 6,
              }}
            />
          </View>
        ))}
      </ScrollView>
      <Pressable onPress={() => openPicker('start')}>
        <Text>
          {startDate ? startDate.toLocaleString() : 'Select start date & time'}
        </Text>
      </Pressable>

      <Pressable onPress={() => openPicker('end')}>
        <Text>
          {endDate ? endDate.toLocaleString() : 'Select end date & time'}
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}
