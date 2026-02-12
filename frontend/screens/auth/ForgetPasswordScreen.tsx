import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert
} from "react-native";

import api from "@/lib/api";

export default function ForgotPasswordScreen() {

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async () => {

    if (!email) {
      Alert.alert("Error", "Please enter your email");
      return;
    }

    try {

      setLoading(true);

      const res = await api.post(`/auth/forget-password`, { email });

      Alert.alert("Success", res.data.message);

    } catch (err: any) {

      Alert.alert(
        "Error",
        err.response?.data?.message ||
        "Something went wrong"
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <View style={styles.container}>

      <Text style={styles.title}>
        Forgot Password
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleForgotPassword}
        disabled={loading}
      >

        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>
            Send Reset Link
          </Text>
        )}

      </TouchableOpacity>

    </View>

  );

}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center"
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 6,
    marginBottom: 20
  },

  button: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 6,
    alignItems: "center"
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold"
  }

});
