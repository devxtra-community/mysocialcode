import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import EventDetailSkeleton from '@/components/comps/skeletonEvent';
import Carousel from 'react-native-reanimated-carousel';
import api from '@/lib/api';

interface EventType {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  startDate: string;
  endDate: string;
  price: string;
  status: string;
  rules: string;
  capacity: number;
  image: {
    id: string;
    imageUrl: string;
  }[];
}

export default function EventDetailScreen() {
  const [event, setEvent] = useState<EventType | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isHost, setIsHost] = useState(false);

  const { id } = useLocalSearchParams();
  const eventId = Array.isArray(id) ? id[0] : id;
  const { width } = Dimensions.get('window');

  useEffect(() => {
    if (!eventId) return;
    fetchEvent();
  }, [eventId]);

  async function fetchEvent() {
    const res = await api.get(`/event/getEvent/${eventId}`);
    console.log(res.data);

    setEvent(res.data.event);
    setIsHost(res.data.host);
  }

  async function handleJoin() {
    try {
      await api.post(`/event/join-event/${eventId}`);

      setEvent((prev) =>
        prev
          ? {
              ...prev,
              capacity: prev.capacity - 1,
              status: 'joined',
            }
          : prev,
      );

      setShowConfirm(false);

      alert('Successfully joined event');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to join event');
      console.log('Join error:', err.response?.data);
    }
  }

  if (!event) {
    return <EventDetailSkeleton />;
  }

  return (
    <View style={styles.container}>
      {event.image?.length > 0 && (
        <Carousel
          loop
          autoPlay
          autoPlayInterval={3000}
          width={width}
          height={220}
          data={event.image}
          scrollAnimationDuration={800}
          renderItem={({ item }) => (
            <Image
              source={{ uri: item.imageUrl }}
              style={{ width: '100%', height: '100%' }}
              resizeMode="cover"
            />
          )}
        />
      )}

      <Text style={styles.title}>{event.title}</Text>

      <Text style={styles.location}> {event.location}</Text>

      <Text style={styles.description}>{event.description}</Text>

      <Text style={styles.date}>{event.startDate}</Text>
      <Text style={styles.date}>{event.endDate}</Text>

      <View style={styles.infoRow}>
        <Text>Category: {event.category}</Text>
        <Text>Status: {event.status}</Text>
      </View>
      <Pressable
        style={[
          styles.joinButton,
          event.status !== 'published' && { opacity: 0.5 },
        ]}
        disabled={event.status !== 'published'}
        onPress={() => setShowConfirm(true)}
      >
        <Text style={styles.joinText}>
          {event.status === 'published'
            ? 'Join Event'
            : event.status === 'joined'
              ? 'Joined'
              : 'Not Available'}
        </Text>
      </Pressable>
      {isHost && (
        <Pressable
          style={styles.scanBtn}
          onPress={() => router.push(`/(tabs)/events/${id}/scan`)}
        >
          <Text style={styles.scanText}>scan for joinees</Text>
        </Pressable>
      )}
      {isHost && (
        <Pressable
          style={styles.boostBtn}
          onPress={() => router.push(`/(tabs)/events/${id}/boost`)}
        >
          <Text style={styles.boostText}>Boost Event </Text>
        </Pressable>
      )}

      {showConfirm && (
        <View style={styles.overlay}>
          <View style={styles.confirmBox}>
            <Text style={styles.confirmTitle}>Join Event?</Text>
            <Text style={styles.confirmText}>
              Are you sure you want to join this event?
            </Text>
            <Text style={styles.confirmText}>These are the rules</Text>

            <ScrollView style={{ maxHeight: 200 }}>
              <Text>{event.rules}</Text>
            </ScrollView>

            <View style={styles.confirmActions}>
              <Pressable
                style={styles.cancelBtn}
                onPress={() => setShowConfirm(false)}
              >
                <Text>Cancel</Text>
              </Pressable>

              <Pressable
                style={styles.confirmBtn}
                onPress={() => {
                  setShowConfirm(false);
                  handleJoin();
                }}
              >
                <Text style={{ color: '#fff' }}>Confirm</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 6,
  },
  location: {
    color: '#666',
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 16,
  },
  date: {
    fontSize: 14,
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  joinButton: {
    backgroundColor: '#000',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  joinText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  confirmBox: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
  },

  confirmTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },

  confirmText: {
    color: '#555',
    marginBottom: 16,
  },

  confirmActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },

  cancelBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  confirmBtn: {
    backgroundColor: '#000',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
  },
  scanBtn: {
    backgroundColor: '#00B894',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,

    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  scanText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  boostBtn: {
    backgroundColor: '#6C5CE7',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 12,

    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },

  boostText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
