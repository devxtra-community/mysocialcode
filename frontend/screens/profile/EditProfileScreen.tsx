import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { router } from 'expo-router';

export default function EditProfileScreen() {
  const [form, setForm] = useState({
    name: '',
    age: '',
    gender: '',
    email: '',
    interest: '',
  });

  const [avatar, setAvatar] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const defaultAvatar = require('@/assets/images/OIP.jpeg');

  async function loadProfile() {
    const res = await api.get('/user/me');
    const u = res.data.user;

    setForm({
      name: u.name || '',
      age: u.age?.toString() || '',
      gender: u.gender || '',
      email: u.email || '',
      interest: u.interests || '',
    });

    setAvatar(u.profileImageUrl || null);
  }

  async function pickImage() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Permission required', 'Please allow photo access');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  }

  async function uploadAvatar() {
    if (!avatar || avatar.startsWith('http')) return;

    const imageResponse = await fetch(avatar);
    const blob = await imageResponse.blob();

    const formData = new FormData();
    formData.append('avatar', blob, 'avatar.jpg');

    await api.post('/user/me/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  async function handleSave() {
    try {
      setUploading(true);
      await uploadAvatar();
      await api.put('/user/me/edit', {
        name: form.name,
        age: Number(form.age),
        gender: form.gender,
        email: form.email,
      });

      Alert.alert('Success', 'Profile updated successfully');
      router.back();
    } catch (err) {
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setUploading(false);
    }
  }
  //comment
  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <Image
          source={avatar ? { uri: avatar } : defaultAvatar}
          style={styles.avatar}
        />

        <Pressable style={styles.editAvatar} onPress={pickImage}>
          <Text style={styles.editAvatarText}>Edit</Text>
        </Pressable>
      </View>

      <TextInput
        placeholder="Name"
        value={form.name}
        onChangeText={(v) => setForm({ ...form, name: v })}
        style={styles.input}
      />

      <TextInput
        placeholder="Age"
        keyboardType="numeric"
        value={form.age}
        onChangeText={(v) => setForm({ ...form, age: v })}
        style={styles.input}
      />

      <TextInput
        placeholder="Gender"
        value={form.gender}
        onChangeText={(v) => setForm({ ...form, gender: v })}
        style={styles.input}
      />

      <TextInput
        placeholder="Email"
        value={form.email}
        onChangeText={(v) => setForm({ ...form, email: v })}
        style={styles.input}
      />

      <Pressable
        style={[styles.button, uploading && { opacity: 0.6 }]}
        onPress={handleSave}
        disabled={uploading}
      >
        <Text style={styles.btnText}>
          {uploading ? 'Saving...' : 'Save Changes'}
        </Text>
      </Pressable>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#4f46e5',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontWeight: '600',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editAvatar: {
    marginTop: 8,
  },
  editAvatarText: {
    color: '#4f46e5',
    fontWeight: '600',
  },
});
