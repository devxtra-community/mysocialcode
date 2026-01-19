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
import { showError } from '@/utils/toast';
export default function CreateEventScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
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
            {/* X Button */}
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

            {/* Image */}
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
    </SafeAreaView>
  );
}
