import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams();

  return (
    <View>
      <Text>Event ID: {id}</Text>
    </View>
  );
}
