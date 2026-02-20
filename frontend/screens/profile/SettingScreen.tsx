import { Pressable, Text, View, StyleSheet } from "react-native";
import { router } from "expo-router";

export default function SettingScreen() {

    const handleChangePassword = () => {
        router.push("/profile/change-password");
    }

    const handleVerifyEmail = () => {
        router.push("/profile/verify-email");   
    }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.section}>

        <Pressable
          style={({ pressed }) => [
            styles.row,
            pressed && styles.pressed,
          ]}
          onPress={handleVerifyEmail}
        >
          <Text style={styles.rowText}>Verify Email</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.row,
            pressed && styles.pressed,
          ]}
          onPress={handleChangePassword}
        >
          <Text style={styles.rowText}>Change Password</Text>
        </Pressable>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },

  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 24,
  },

  section: {
    borderTopWidth: 0.5,
    borderTopColor: "#e5e7eb",
  },

  row: {
    paddingVertical: 18,
    borderBottomWidth: 0.5,
    borderBottomColor: "#e5e7eb",
  },

  rowText: {
    fontSize: 16,
    fontWeight: "500",
  },

  pressed: {
    backgroundColor: "#f3f4f6",
  },
});