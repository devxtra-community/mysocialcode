import { View, Text, StyleSheet, Pressable } from 'react-native';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      {/* User info */}
      <View style={styles.userCard}>
        <View style={styles.avatar} />
        <View>
          <Text style={styles.name}>Your Name</Text>
          <Text style={styles.subText}>+91 XXXXX XXXXX</Text>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.section}>
        <Pressable style={styles.row}>
          <Text style={styles.rowText}>Edit Profile</Text>
        </Pressable>

        <Pressable style={styles.row}>
          <Text style={styles.rowText}>Settings</Text>
        </Pressable>

        <Pressable style={styles.row}>
          <Text style={styles.rowText}>Help & Support</Text>
        </Pressable>
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
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#e5e7eb',
    marginRight: 16,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  subText: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  section: {
    borderTopWidth: 0.5,
    borderTopColor: '#e5e7eb',
  },
  row: {
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#e5e7eb',
  },
  rowText: {
    fontSize: 15,
  },
});

