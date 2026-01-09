import { View, Text, StyleSheet, Pressable } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Home</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>New Events</Text>
        <Text style={styles.placeholder}>New events will appear here.</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Popular Events</Text>
        <Text style={styles.placeholder}>Popular events will appear here.</Text>
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
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
  },
  searchBox: {
    height: 44,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    paddingHorizontal: 12,
    marginBottom: 24,
  },
  searchText: {
    color: '#6b7280',
    fontSize: 14,
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
