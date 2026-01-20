import api from '@/lib/api';
import { useState } from 'react';
import {
  View,
  Pressable,
  TextInput,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Switch } from '@/components/ui/switch';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { showError } from '@/utils/toast';
import { router } from 'expo-router';
export default function CreateEventScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isFree, setIsFree] = useState(true);
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [capacity, setCapacity] = useState('');
  const [category, setCategory] = useState('');
  const [rules, setRules] = useState('');
  const [loading, setLoading] = useState(false);

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
      setLoading(true);
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
      form.append('isFree', String(isFree));
      form.append('price', isFree ? '0' : price);
      form.append('location', location);
      form.append('capacity', capacity);
      form.append('category', category);
      form.append('rules', rules);

      const res = await api.post('event/create-event', form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log(res.data);
      if (res.data.success) {
        setTitle('');
        setDescription('');
        setImages([]);
        setStartDate(null);
        setEndDate(null);
        setLocation('');
        setCategory('');
        setRules('');
        setPrice('');

        router.replace('/(tabs)/events');
      }
    } catch (err) {
      console.log('upload failed:', err);
    } finally {
      setLoading(false);
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
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inner}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.header}>Create New Event</Text>

          {/* Text Inputs */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Event Title</Text>
            <TextInput
              placeholder="Give your event a name"
              value={title}
              onChangeText={setTitle}
              style={styles.input}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              placeholder="What's happening?"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              style={[styles.input, styles.textArea]}
            />
          </View>

          {/* Date Pickers */}
          <View style={styles.row}>
            <Pressable
              style={styles.dateBox}
              onPress={() => openPicker('start')}
            >
              <Text style={styles.dateLabel}>Starts</Text>
              <Text style={styles.dateText}>
                {startDate
                  ? startDate.toLocaleString([], {
                      dateStyle: 'short',
                      timeStyle: 'short',
                    })
                  : 'Select start'}
              </Text>
            </Pressable>

            <Pressable style={styles.dateBox} onPress={() => openPicker('end')}>
              <Text style={styles.dateLabel}>Ends</Text>
              <Text style={styles.dateText}>
                {endDate
                  ? endDate.toLocaleString([], {
                      dateStyle: 'short',
                      timeStyle: 'short',
                    })
                  : 'Select end'}
              </Text>
            </Pressable>
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Is this a free event?</Text>

            <View style={styles.switchRow}>
              <Text style={{ color: '#374151' }}>
                {isFree ? 'Free Event' : 'Paid Event'}
              </Text>

              <Switch value={isFree} onValueChange={setIsFree} />
            </View>
          </View>
          {!isFree && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Ticket Price</Text>
              <TextInput
                placeholder="Enter ticket price"
                keyboardType="numeric"
                value={price}
                onChangeText={setPrice}
                style={styles.input}
              />
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Location</Text>
            <TextInput
              placeholder="Venue or full address"
              value={location}
              onChangeText={setLocation}
              style={styles.input}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Capacity</Text>
            <TextInput
              placeholder="Number of seats"
              keyboardType="numeric"
              value={capacity}
              onChangeText={setCapacity}
              style={styles.input}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Category</Text>
            <TextInput
              placeholder="Tech, Music, Business..."
              value={category}
              onChangeText={setCategory}
              style={styles.input}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Rules (optional)</Text>
            <TextInput
              placeholder="Event rules or guidelines"
              value={rules}
              onChangeText={setRules}
              multiline
              style={[styles.input, styles.textArea]}
            />
          </View>

          {/* Image Selection */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.label}>Photos</Text>
              <Pressable onPress={pickImages}>
                <Text style={styles.linkText}>+ Add Photos</Text>
              </Pressable>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.imageScroll}
            >
              {images.map((uri, ind) => (
                <View key={ind} style={styles.imageWrapper}>
                  <Pressable
                    onPress={() => removeImage(ind)}
                    style={styles.removeBadge}
                  >
                    <Text style={styles.removeText}>×</Text>
                  </Pressable>
                  <Image source={{ uri }} style={styles.thumbnail} />
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Submit Button */}
          <Pressable
            style={[styles.submitButton, loading && { opacity: 0.7 }]}
            onPress={handleEvent}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Create Event</Text>
            )}
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  inner: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginVertical: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 12,
  },
  dateBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  dateLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 14,
    fontWeight: '500',
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  linkText: {
    color: '#2563EB',
    fontWeight: '600',
  },
  imageScroll: {
    flexDirection: 'row',
  },
  imageWrapper: {
    position: 'relative',
    marginRight: 12,
    marginTop: 5,
  },
  thumbnail: {
    width: 90,
    height: 90,
    borderRadius: 12,
  },
  removeBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#EF4444',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  removeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 18,
  },
  submitButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 40,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
