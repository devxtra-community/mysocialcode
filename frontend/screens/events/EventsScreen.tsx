import { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import api from '@/lib/api';

function EventSkeleton() {
return (
  <Card style={{ marginBottom: 14, padding: 12 }}>
    <Skeleton height={160} style={{ borderRadius: 12 }} />

    <View style={{ marginTop: 10 }}>
      <Skeleton height={18} width="70%" />
      <Skeleton height={14} width="90%" style={{ marginTop: 6 }} />
      <Skeleton height={12} width="60%" style={{ marginTop: 6 }} />
    </View>

    <View style={{ flexDirection: 'row', marginTop: 12, gap: 10 }}>
      <Skeleton height={32} width={80} />
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


  


  return (
  <>
  </>
  );
}
