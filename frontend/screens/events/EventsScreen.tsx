import { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import api from '@/lib/api';

function EventSkeleton() {
  return (
    <Card style={{ marginHorizontal: 12, marginBottom: 14, padding: 12 }}>
      <Skeleton height={160} style={{ borderRadius: 12 }} />

      <View style={{ marginTop: 10 }}>
        <Skeleton height={18} width="70%" />
        <Skeleton height={14} width="90%" style={{ marginTop: 6 }} />
        <Skeleton height={12} width="60%" style={{ marginTop: 6 }} />
      </View>
    </Card>
  );
}

export default function EventsScreen() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    try {
      const res = await api.get('/event/all-events');
      if (res.data.success) {
        setEvents(res.data.events);
      }
    } catch (err) {
      console.log('Failed to load events', err);
    } finally {
      setLoading(false);
    }
  }

  const renderItem = ({ item }: { item: any }) => {
    return (
      <Card style={{ marginHorizontal: 12, marginBottom: 14, padding: 10 }}>
        {/* Event Image */}
        <Image
          source={{
            uri: item.image?.[0]?.imageUrl,
          }}
          style={{
            width: '100%',
            height: 160,
            borderRadius: 10,
            marginBottom: 10,
          }}
          resizeMode="cover"
        />

        {/* Title */}
        <Text style={{ fontSize: 16, fontWeight: '600' }}>{item.title}</Text>

        {/* Date */}
        <Text style={{ color: '#666', marginTop: 4 }}>
          {new Date(item.startDate).toDateString()}
        </Text>

        {/* Footer */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 10,
            alignItems: 'center',
          }}
        >
          <Pressable
            onPress={() => router.push(`/(tabs)/events/${item.id}`)}
            style={{
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 6,
              backgroundColor: '#000',
            }}
          >
            <Text style={{ color: '#fff' }}>View</Text>
          </Pressable>

          <Text style={{ color: '#888' }}>{item.location}</Text>
        </View>
      </Card>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ padding: 16 }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12,
          }}
        >
          <Text style={{ fontSize: 24, fontWeight: '700' }}>Events</Text>

          <Pressable onPress={() => router.push('/(tabs)/events/create')}>
            <Text style={{ fontSize: 16, fontWeight: '600' }}>Create</Text>
          </Pressable>
        </View>

        <View
          style={{
            backgroundColor: '#f3f4f6',
            borderRadius: 12,
            paddingHorizontal: 12,
            height: 44,
            justifyContent: 'center',
          }}
        >
          <TextInput
            placeholder="Search events..."
            placeholderTextColor="#6b7280"
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 16 }}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: '600',
            marginBottom: 12,
          }}
        >
          My Events
        </Text>

        {loading &&
          Array.from({ length: 3 }).map((_, i) => <EventSkeleton key={i} />)}

        {!loading && events.length === 0 && (
          <Text style={{ color: '#6b7280' }}>No events found</Text>
        )}

        {!loading &&
          events.map((event) => (
            <Pressable
              key={event.id}
              onPress={() => router.push(`/(tabs)/events/${event.id}`)}
            >
              <Card style={{ marginBottom: 14, padding: 12 }}>
                <Image
                  source={{ uri: event.image?.[0]?.imageUrl }}
                  style={{
                    height: 160,
                    borderRadius: 12,
                    backgroundColor: '#e5e7eb',
                  }}
                />

                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '600',
                    marginTop: 8,
                  }}
                >
                  {event.title}
                </Text>

                <Text
                  style={{
                    color: '#6b7280',
                    marginTop: 4,
                  }}
                >
                  {event.location}
                </Text>

                <Text
                  style={{
                    color: '#9ca3af',
                    marginTop: 2,
                    fontSize: 12,
                  }}
                >
                  {event.startDate}
                </Text>
              </Card>
            </Pressable>
          ))}
      </ScrollView>
    </SafeAreaView>
  );
}
