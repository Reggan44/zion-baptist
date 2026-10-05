import { useState, useEffect } from 'react';
import { collection, getDocs, query, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Ministry } from '../types';

interface UseMinistriesReturn {
  ministries: Ministry[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useMinistries = (maxResults = 20): UseMinistriesReturn => {
  const [ministries, setMinistries] = useState<Ministry[]>([]);
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
          collection(db, 'ministries'),
          limit(maxResults)
        );
        const snap = await getDocs(q);
        if (!cancelled) {
          setMinistries(snap.docs.map(d => ({ id: d.id, ...d.data() } as Ministry)));
        }
      } catch {
        if (!cancelled) setError('Failed to load ministries. Please try again later.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetch();
    return () => { cancelled = true; };
  }, [maxResults, tick]);

  return { ministries, loading, error, refetch: () => setTick(t => t + 1) };
};
