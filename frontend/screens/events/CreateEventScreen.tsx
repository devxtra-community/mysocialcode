import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function CreateEventScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.backText}>Back</Text>
        </Pressable>

        <Text style={styles.title}>Create Event</Text>

        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.placeholder}>
          Event creation form will go here.
        </Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: 56,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 0.5,
    borderBottomColor: '#e5e7eb',
  },
  backText: {
    color: '#22c55e',
    fontSize: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  placeholder: {
    color: '#6b7280',
    fontSize: 14,
  },
});
