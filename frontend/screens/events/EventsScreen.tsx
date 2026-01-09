import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function EventsScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Events</Text>

        <Pressable onPress={() => router.push('/(tabs)/events/create')}>
          <Text style={styles.createText}>Create</Text>
        </Pressable>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>My Events</Text>
        <Text style={styles.placeholder}>
          You haven’t created any events yet.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Joined Events</Text>
        <Text style={styles.placeholder}>
          Events you join will appear here.
        </Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
  },
  createText: {
    fontSize: 16,
    color: '#22c55e',
    fontWeight: '500',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  placeholder: {
    fontSize: 14,
    color: '#6b7280',
  },
});
