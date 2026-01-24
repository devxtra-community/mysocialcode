// frontend/hooks/useMyEvents.ts
import { useEffect, useState } from 'react';
import api from '@/lib/api';

export function useMyEvents() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyEvents();
  }, []);

  async function fetchMyEvents() {
    try {
      const res = await api.get('/event/my-events');
      if (res.data?.success) {
        setEvents(res.data.events);
      }
    } catch (err) {
      console.log('Failed to fetch my events', err);
    } finally {
      setLoading(false);
    }
  }

  return { events, loading };
}
