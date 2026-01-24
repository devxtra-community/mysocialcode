import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import EventDetailSkeleton from '@/components/comps/skeletonEvent';
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
}

export default function EventDetailScreen() {
  const [event, setEvent] = useState<EventType | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const { id } = useLocalSearchParams();

  useEffect(() => {
    fetchEvent();
  }, [id]);

  async function fetchEvent() {
    const res = await api.get(`/event/getEvent/${id}`);
    setEvent(res.data.event);
  }

  async function handleJoin() {
    console.log('Join event:', event?.id);
    const joinRes = await api.post(`/event/join-event/${id}`);
    console.log(joinRes);
  }

  if (!event) {
    return <EventDetailSkeleton />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{event.title}</Text>

      <Text style={styles.location}> {event.location}</Text>

      <Text style={styles.description}>{event.description}</Text>

      <View style={styles.infoRow}>
        <Text>Category: {event.category}</Text>
        <Text>Status: {event.status}</Text>
      </View>
      <Pressable style={styles.joinButton} onPress={() => setShowConfirm(true)}>
        <Text style={styles.joinText}>Join Event</Text>
      </Pressable>
      {showConfirm && (
        <View style={styles.overlay}>
          <View style={styles.confirmBox}>
            <Text style={styles.confirmTitle}>Join Event?</Text>
            <Text style={styles.confirmText}>
              Are you sure you want to join this event?
            </Text>
            <Text>thsese are the rules</Text>
            <Text>{event.rules}</Text>

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
});
