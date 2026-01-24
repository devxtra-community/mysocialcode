import { useEffect, useState } from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { FlatList } from 'react-native-gesture-handler';

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

      <View style={{ flexDirection: 'row', marginTop: 12, gap: 10 }}>
        <Skeleton height={32} width={80} />
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
      console.log(res.data);
      

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
            uri:item.image?.[0]?.imageUrl
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
    <SafeAreaView style={{ flex: 1 }}>
      {/* Create Event */}
      <Pressable
        onPress={() => router.push('/(tabs)/events/create')}
        style={{
          margin: 12,
          padding: 12,
          backgroundColor: '#444',
          borderRadius: 8,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: '#fff', fontWeight: '600' }}>➕ Create Event</Text>
      </Pressable>

      {/* My Tickets */}
      <Pressable
        onPress={() =>router.push('/(tabs)/tickets/ticket')}
        style={{
          marginHorizontal: 12,
          marginBottom: 8,
          padding: 12,
          backgroundColor: '#000',
          borderRadius: 8,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: '#fff', fontWeight: '600' }}>🎫 My Tickets</Text>
      </Pressable>

      {/* Events List */}
      {loading ? (
        <View>
          {[1, 2, 3].map((i) => (
            <EventSkeleton key={i} />
          ))}
        </View>
      ) : (
        <FlatList
          data={events}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </SafeAreaView>
  );
}
