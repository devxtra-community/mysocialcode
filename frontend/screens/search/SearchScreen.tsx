import { View, Text, StyleSheet, TextInput } from 'react-native';

export default function SearchScreen() {
  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.title}>Search</Text>
      </View>

      <View style={styles.searchBox}>
        <TextInput
          placeholder="Search events, people, places…"
          placeholderTextColor="#6b7280"
          style={styles.input}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Searches</Text>
        <Text style={styles.placeholder}>No recent searches</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Results</Text>
        <Text style={styles.placeholder}>
          Start typing to see results.
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
  input: {
    fontSize: 14,
    color: '#111827',
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
