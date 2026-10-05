import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { EventItem } from '../types';

interface UseEventsReturn {
  events: EventItem[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useEvents = (maxResults = 20): UseEventsReturn => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const q = query(
          collection(db, 'events'),
          orderBy('date', 'asc'),
          limit(maxResults)
        );
        const snap = await getDocs(q);
        if (!cancelled) {
          setEvents(snap.docs.map(d => ({ id: d.id, ...d.data() } as EventItem)));
        }
      } catch {
        if (!cancelled) setError('Failed to load events. Please try again later.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetch();
    return () => { cancelled = true; };
  }, [maxResults, tick]);

  return { events, loading, error, refetch: () => setTick(t => t + 1) };
};
