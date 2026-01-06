import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export default function IntroScreen() {
  const handleGetStarted = async () => {
    await AsyncStorage.setItem("hasSeenIntro", "true");
    router.push("/(auth)/phone");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
     
          <Text style={styles.title}>
            Join the <Text style={styles.highlight}>Awesome</Text>{" "}
            World Events
          </Text>

          <Text style={styles.description}>
            Discover and join events around you using a simple and
            secure mobile experience.
          </Text>

      
          <Pressable style={styles.button} onPress={handleGetStarted}>
            <Text style={styles.buttonText}>Let’s Start</Text>
          </Pressable>
       
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#c2dcc6ff",
  },

  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },


  title: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 10,
    color: "#111",
  },

  highlight: {
    color: "#4CAF50",
  },

  description: {
    fontSize: 14,
    textAlign: "center",
    color: "#555",
    marginBottom: 24,
    lineHeight: 20,
  },

  button: {
    width: "100%",
    backgroundColor: "#000",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },

  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

