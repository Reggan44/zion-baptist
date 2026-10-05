import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Sermon } from '../types';

interface UseSermonsReturn {
  sermons: Sermon[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useSermons = (maxResults = 20): UseSermonsReturn => {
  const [sermons, setSermons] = useState<Sermon[]>([]);
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
          collection(db, 'sermons'),
          orderBy('date', 'desc'),
          limit(maxResults)
        );
        const snap = await getDocs(q);
        if (!cancelled) {
          setSermons(snap.docs.map(d => ({ id: d.id, ...d.data() } as Sermon)));
        }
      } catch {
        if (!cancelled) setError('Failed to load sermons. Please try again later.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetch();
    return () => { cancelled = true; };
  }, [maxResults, tick]);

  return { sermons, loading, error, refetch: () => setTick(t => t + 1) };
};
