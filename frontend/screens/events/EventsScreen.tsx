import { useState } from 'react';
import { View, Text, Image, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

// BNA UI components (adjust import path if needed)
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface EventItem {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  image: string;
  type: 'my' | 'joined';
}

const DUMMY_EVENTS: EventItem[] = [
  {
    id: '1',
    title: 'Music Night Festival',
    description: 'Live DJ night with food & drinks.',
    startDate: '2026-01-20T18:00:00Z',
    endDate: '2026-01-20T22:00:00Z',
    image: 'https://images.unsplash.com/photo-1504805572947-34fad45aed93',
    type: 'my',
  },
  {
    id: '2',
    title: 'Startup Meetup',
    description: 'Networking with founders and developers.',
    startDate: '2026-01-25T10:00:00Z',
    endDate: '2026-01-25T13:00:00Z',
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d',
    type: 'my',
  },
  {
    id: '3',
    title: 'Photography Walk',
    description: 'Street photography event in the city.',
    startDate: '2026-02-01T07:00:00Z',
    endDate: '2026-02-01T10:00:00Z',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee',
    type: 'joined',
  },
];

export default function EventsScreen() {
  const router = useRouter();
  const [events] = useState<EventItem[]>(DUMMY_EVENTS);

  const myEvents = events.filter((e) => e.type === 'my');
  const joinedEvents = events.filter((e) => e.type === 'joined');

  const renderEventCard = (event: EventItem) => (
    <Card key={event.id} style={{ marginBottom: 14, padding: 12 }}>
      <Image
        source={{ uri: event.image }}
        style={{
          width: '100%',
          height: 160,
          borderRadius: 12,
          marginBottom: 10,
        }}
      />

      <Text style={{ fontSize: 17, fontWeight: '600', marginBottom: 4 }}>
        {event.title}
      </Text>

      <Text style={{ fontSize: 13, color: '#6b7280', marginBottom: 6 }}>
        {event.description}
      </Text>

      <Text style={{ fontSize: 12, color: '#9ca3af', marginBottom: 10 }}>
        {new Date(event.startDate).toLocaleString()} →{' '}
        {new Date(event.endDate).toLocaleString()}
      </Text>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Button size="sm" variant="outline">
          View
        </Button>
        <Button size="sm">Join</Button>
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <View style={{ flex: 1, padding: 16 }}>
        {/* Header */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
          }}
        >
          <Text style={{ fontSize: 22, fontWeight: '700' }}>Events</Text>

          <Pressable onPress={() => router.push('/(tabs)/events/create')}>
            <Text style={{ fontSize: 16, color: '#22c55e', fontWeight: '600' }}>
              Create
            </Text>
          </Pressable>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* My Events */}
          <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 10 }}>
            My Events
          </Text>

          {myEvents.length === 0 ? (
            <Text style={{ color: '#6b7280', marginBottom: 20 }}>
              You haven’t created any events yet.
            </Text>
          ) : (
            myEvents.map(renderEventCard)
          )}

          {/* Joined Events */}
          <Text
            style={{
              fontSize: 16,
              fontWeight: '600',
              marginTop: 10,
              marginBottom: 10,
            }}
          >
            Joined Events
          </Text>

          {joinedEvents.length === 0 ? (
            <Text style={{ color: '#6b7280' }}>
              Events you join will appear here.
            </Text>
          ) : (
            joinedEvents.map(renderEventCard)
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
