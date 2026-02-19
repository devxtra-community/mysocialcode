import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import { useEffect } from "react";

export default function PaymentSuccess() {
    const router = useRouter();
    useEffect(() => {
  setTimeout(() => {
    router.replace("/");
  }, 3000);
}, []);
  return (
    <View style={{
      flex: 1,
      justifyContent: "center",
      alignItems: "center"
    }}>
      <Text style={{ fontSize: 24 }}> Payment Successful</Text>
      <Text>Your boost is now active</Text>
    </View>
  );
}
