import { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  TextInput,
  StyleSheet,
  ImageBackground,
  FlatList,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import api from '@/lib/api';

function HomeSkeleton() {
  return (
    <Card style={styles.skeletonCard}>
      <Skeleton height={160} style={styles.skeletonImage} />
      <View style={styles.skeletonTextWrapper}>
        <Skeleton height={18} width="70%" />
        <Skeleton height={14} width="90%" style={styles.skeletonSpacing} />
        <Skeleton height={12} width="60%" style={styles.skeletonSpacing} />
      </View>
    </Card>
  );
}

export default function HomeScreen() {
  const loadingRef = useRef(false);

  const [events, setEvents] = useState<any[]>([]);
  const [boostedEvents, setBoostedEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState<any>(null);

  useEffect(() => {
    fetchEvents();
    fetchBoosted();
  }, []);

  async function fetchBoosted() {
    try {
      const res = await api.get('/boost/active');
      setBoostedEvents(res.data.events || []);
    } catch (err) {
      console.log('Failed boosted fetch', err);
    }
  }

  async function fetchEvents() {
    if (loadingRef.current || !hasMore) return;

    loadingRef.current = true;
    setLoading(true);

    try {
      let url = '/event/all-events?limit=10';

      if (cursor) {
        url += `&cursor=${encodeURIComponent(
          new Date(cursor.startDate).toISOString(),
        )}&id=${cursor.id}`;
      }

      const res = await api.get(url);

      if (res.data.success) {
        // setEvents((prev) => [...prev, ...res.data.events]);
        setEvents((prev) => {
          const existingIds = new Set(prev.map((e) => e.id));

          const newEvents = res.data.events.filter(
            (e: any) => !existingIds.has(e.id),
          );

          return [...prev, ...newEvents];
        });

        setHasMore(res.data.hasMore);
        setCursor(res.data.nextCursor);
      }
    } catch (err) {
      console.log('Failed to load events', err);
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Events</Text>
        <View style={styles.searchBox}>
          <TextInput
            placeholder="Search events..."
            placeholderTextColor="#6b7280"
          />
        </View>
      </View>

      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.scrollContent}
        onEndReached={fetchEvents}
        onEndReachedThreshold={0.3}
        removeClippedSubviews={true}
        ListHeaderComponent={
          <>
            {boostedEvents.length > 0 && (
              <View style={{ marginBottom: 16 }}>
                <Text style={styles.sectionTitle}> sponsered</Text>

                <FlatList
                  horizontal
                  data={boostedEvents}
                  keyExtractor={(item) => item.id}
                  showsHorizontalScrollIndicator={false}
                  renderItem={({ item }) => (
                    <Pressable
                      onPress={() => router.push(`/(tabs)/events/${item.id}`)}
                      style={styles.boostedCard}
                    >
                      <ImageBackground
                        source={{ uri: item.image?.[0]?.imageUrl }}
                        style={styles.boostedImage}
                        imageStyle={{ borderRadius: 12 }}
                      >
                        <View style={styles.overlay}>
                          <Text style={styles.eventTitle}>{item.title}</Text>
                        </View>
                      </ImageBackground>
                    </Pressable>
                  )}
                />
              </View>
            )}

            <Text style={styles.sectionTitle}>All Events</Text>
          </>
        }
        ListFooterComponent={
          loading ? (
            <HomeSkeleton />
          ) : !hasMore ? (
            <Text style={styles.emptyText}>No more events</Text>
          ) : null
        }
        renderItem={({ item: event }) => (
          <Pressable onPress={() => router.push(`/(tabs)/events/${event.id}`)}>
            <Card style={styles.eventCard}>
              <ImageBackground
                source={{ uri: event.image?.[0]?.imageUrl }}
                style={styles.eventImage}
                imageStyle={styles.eventImageRadius}
              >
                <View style={styles.overlay}>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <Text style={styles.eventLocation}>{event.location}</Text>
                  <Text style={styles.eventDate}>{event.startDate}</Text>
                </View>
              </ImageBackground>
            </Card>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  header: { padding: 16 },

  title: { fontSize: 24, fontWeight: '700', marginBottom: 12 },

  searchBox: {
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    justifyContent: 'center',
  },

  scrollContent: { paddingHorizontal: 16 },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },

  emptyText: { color: '#6b7280', textAlign: 'center' },

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

  skeletonCard: { marginBottom: 14, padding: 12 },

  skeletonImage: { borderRadius: 12 },

  skeletonTextWrapper: { marginTop: 10 },

  skeletonSpacing: { marginTop: 6 },

  boostedCard: { width: 220, marginRight: 12 },

  boostedImage: {
    height: 140,
    justifyContent: 'flex-end',
  },
});
