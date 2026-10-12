import { useState, useEffect } from 'react';
import type { Sermon } from '../types';
import { getSermons } from '../features/sermons/api/getSermons';

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
        const data = await getSermons(maxResults);
        if (!cancelled) {
          setSermons(data);
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
