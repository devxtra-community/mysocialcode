import { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import api from '@/lib/api';

/* ---------- Skeleton ---------- */

function EventSkeleton() {
  return (
    <Card style={styles.skeletonCard}>
      <Skeleton height={160} style={styles.skeletonImage} />

      <View style={styles.skeletonTextWrapper}>
        <Skeleton height={18} width="70%" />
        <Skeleton height={14} width="90%" style={styles.skeletonSpacing} />
        <Skeleton height={12} width="60%" style={styles.skeletonSpacing} />
        <Skeleton height={12} width="60%" style={styles.skeletonSpacing} />
      </View>
    </Card>
  );
}

/* ---------- Helpers ---------- */

function isPastEvent(endDate: string) {
  return new Date(endDate).getTime() < Date.now();
}

/* ---------- Screen ---------- */

export default function EventsScreen() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    try {
      const res = await api.get('/event/my-events');
      if (res.data?.success) {
        setEvents(res.data.events);
      }
    } catch (err) {
      console.log('Failed to load events', err);
    } finally {
      setLoading(false);
    }
  }

  async function cancelEvent(eventId: string) {
    try {
      const res = await api.post(`/event/cancel/${eventId}`);
      if (res.data?.success) {
        fetchEvents();
      }
    } catch (err: any) {
      console.log('Failed to cancel event:', err.response?.data || err.message);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* ---------- Header ---------- */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Events</Text>

          <Pressable onPress={() => router.push('/(tabs)/events/create')}>
            <Text style={styles.createText}>Create</Text>
          </Pressable>
        </View>

        <View style={styles.searchBox}>
          <TextInput
            placeholder="Search events..."
            placeholderTextColor="#6b7280"
          />
        </View>
      </View>

      {/* ---------- Content ---------- */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>My Events</Text>

        {loading &&
          Array.from({ length: 3 }).map((_, i) => <EventSkeleton key={i} />)}

        {!loading && events.length === 0 && (
          <Text style={styles.emptyText}>No events found</Text>
        )}

        {!loading &&
          events.map((event) => {
            const past = isPastEvent(event.endDate);

            return (
              <Pressable
                key={event.id}
                disabled={past}
                style={past && { opacity: 0.6 }}
                onPress={() => router.push(`/(tabs)/events/${event.id}`)}
              >
                <Card style={styles.eventCard}>
                  <ImageBackground
                    source={{ uri: event.image?.[0]?.imageUrl }}
                    style={styles.eventImage}
                    imageStyle={styles.eventImageRadius}
                  >
                    <View style={styles.overlay}>
                      {/* PAST BADGE */}
                      {past && (
                        <View style={styles.pastBadge}>
                          <Text style={styles.pastBadgeText}>PAST</Text>
                        </View>
                      )}

                      <Text style={styles.eventTitle}>{event.title}</Text>
                      <Text style={styles.eventLocation}>{event.location}</Text>
                      <Text style={styles.eventDate}>{event.startDate}</Text>

                      <View style={{ flexDirection: 'row', gap: 8 }}>
                        {!past && (
                          <Pressable
                            onPress={(e) => {
                              e.stopPropagation();
                              router.push(`/(tabs)/events/update/${event.id}`);
                            }}
                          >
                            <Text style={styles.eventUpdate}>Update</Text>
                          </Pressable>
                        )}

                        {!past && event.status !== 'canceled' && (
                          <Pressable
                            onPress={(e) => {
                              e.stopPropagation();
                              cancelEvent(event.id);
                            }}
                          >
                            <Text style={styles.eventCancel}>Cancel</Text>
                          </Pressable>
                        )}

                        {event.status === 'canceled' && (
                          <Text style={styles.canceledText}>Canceled</Text>
                        )}
                      </View>
                    </View>
                  </ImageBackground>
                </Card>
              </Pressable>
            );
          })}
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------- Styles ---------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  header: {
    padding: 16,
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
  },

  createText: {
    fontSize: 16,
    fontWeight: '600',
  },

  searchBox: {
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    justifyContent: 'center',
  },

  scrollContent: {
    paddingHorizontal: 16,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },

  emptyText: {
    color: '#6b7280',
  },

  eventCard: {
    marginBottom: 14,
    padding: 0,
    overflow: 'hidden',
  },

  eventImage: {
    height: 180,
    justifyContent: 'flex-end',
  },

  eventImageRadius: {
    borderRadius: 12,
  },

  overlay: {
    backgroundColor: 'rgba(0,0,0,0.45)',
    padding: 12,
  },

  eventTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },

  eventLocation: {
    color: '#e5e7eb',
    marginTop: 4,
  },

  eventDate: {
    color: '#d1d5db',
    marginTop: 2,
    fontSize: 12,
  },

  eventUpdate: {
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#3b82f6',
    borderRadius: 6,
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },

  eventCancel: {
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#ef4444',
    borderRadius: 6,
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },

  canceledText: {
    color: '#fca5a5',
    marginTop: 10,
    fontWeight: '600',
  },

  pastBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#dc2626',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 6,
  },

  pastBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },

  skeletonCard: {
    marginBottom: 14,
    padding: 12,
  },

  skeletonImage: {
    borderRadius: 12,
  },

  skeletonTextWrapper: {
    marginTop: 10,
  },

  skeletonSpacing: {
    marginTop: 6,
  },
});
