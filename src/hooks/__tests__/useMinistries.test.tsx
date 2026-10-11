import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useMinistries } from '../useMinistries';
import { getDocs } from 'firebase/firestore';

// Mock the Firebase modules
vi.mock('firebase/firestore', () => {
  return {
    collection: vi.fn(),
    query: vi.fn(),
    limit: vi.fn(),
    getDocs: vi.fn(),
  };
});

vi.mock('../../lib/firebase', () => {
  return {
    db: {},
  };
});

const mockMinistries = [
  { id: '1', name: 'Youth Ministry', description: 'For the youth', image: 'url', gallery: [], iconName: 'Users', color: 'red', textColor: 'white', order: 1 },
  { id: '2', name: 'Children Ministry', description: 'For the kids', image: 'url', gallery: [], iconName: 'Users', color: 'blue', textColor: 'white', order: 2 },
];

describe('useMinistries', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch and return ministries successfully', async () => {
    // Setup the mock to return success
    (getDocs as any).mockResolvedValue({
      docs: mockMinistries.map(m => ({
        id: m.id,
        data: () => {
          const { id, ...rest } = m;
          return rest;
        }
      }))
    });

    const { result } = renderHook(() => useMinistries());

    // Initially loading
    expect(result.current.loading).toBe(true);
    expect(result.current.ministries).toEqual([]);
    expect(result.current.error).toBe(null);

    // Wait for the hook to finish fetching
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.ministries).toEqual(mockMinistries);
    expect(result.current.error).toBe(null);
  });

  it('should handle returning an empty list of ministries', async () => {
    (getDocs as any).mockResolvedValue({ docs: [] });

    const { result } = renderHook(() => useMinistries());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.ministries).toEqual([]);
    expect(result.current.error).toBe(null);
  });

  it('should handle errors when fetching fails', async () => {
    (getDocs as any).mockRejectedValue(new Error('Firebase error'));

    const { result } = renderHook(() => useMinistries());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.ministries).toEqual([]);
    expect(result.current.error).toBe('Failed to load ministries. Please try again later.');
  });

  it('should refetch when refetch is called', async () => {
    (getDocs as any).mockResolvedValue({ docs: [] });

    const { result } = renderHook(() => useMinistries());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Change the mock to return data on the second call
    (getDocs as any).mockResolvedValue({
      docs: mockMinistries.map(m => ({
        id: m.id,
        data: () => {
          const { id, ...rest } = m;
          return rest;
        }
      }))
    });

    // Call refetch
    act(() => {
      result.current.refetch();
    });

    // Verify it goes back to loading state and then gets data
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.ministries).toEqual(mockMinistries);
    });
  });
});
