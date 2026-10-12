import { vi, describe, it, expect, beforeEach, afterEach, Mock } from 'vitest';
import { getLeaders } from './getLeaders';
import { collection, getDocs, query, limit, orderBy } from 'firebase/firestore';
import type { Leader } from '../../../types';

vi.mock('firebase/firestore', () => {
  return {
    collection: vi.fn(),
    getDocs: vi.fn(),
    addDoc: vi.fn(),
    updateDoc: vi.fn(),
    deleteDoc: vi.fn(),
    doc: vi.fn(),
    query: vi.fn(),
    limit: vi.fn(),
    getDoc: vi.fn(),
    orderBy: vi.fn()
  };
});

vi.mock('../../../lib/firebase', () => {
  return {
    db: {}
  };
});

describe('getLeaders', () => {
  const mockWarn = vi.spyOn(console, 'warn').mockImplementation(() => {});

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    mockWarn.mockClear();
  });

  const mockLeaderData = { name: 'John Doe', role: 'Pastor', order: 1 };
  const mockLeader: Leader = { id: 'leader-1', ...mockLeaderData } as Leader;

  it('should fetch leaders successfully on the primary query', async () => {
    const mockQuerySnapshot = {
      empty: false,
      docs: [
        {
          id: 'leader-1',
          data: () => mockLeaderData,
        },
      ],
    };

    (getDocs as Mock).mockResolvedValueOnce(mockQuerySnapshot);

    const leaders = await getLeaders();

    expect(leaders).toEqual([mockLeader]);
    expect(query).toHaveBeenCalled();
    expect(collection).toHaveBeenCalled();
    expect(orderBy).toHaveBeenCalledWith('order', 'asc');
    expect(limit).toHaveBeenCalledWith(20);
    expect(getDocs).toHaveBeenCalledTimes(1);
    expect(mockWarn).not.toHaveBeenCalled();
  });

  it('should fallback to generic fetch if primary query returns empty', async () => {
    const mockEmptySnapshot = {
      empty: true,
      docs: [],
    };

    const mockFallbackSnapshot = {
      empty: false,
      docs: [
        {
          id: 'leader-2',
          data: () => ({ ...mockLeaderData, name: 'Jane Doe' }),
        },
      ],
    };

    (getDocs as Mock)
      .mockResolvedValueOnce(mockEmptySnapshot)
      .mockResolvedValueOnce(mockFallbackSnapshot);

    const leaders = await getLeaders();

    expect(leaders).toEqual([{ id: 'leader-2', ...mockLeaderData, name: 'Jane Doe' }]);
    expect(getDocs).toHaveBeenCalledTimes(2);
    expect(mockWarn).not.toHaveBeenCalled();
  });

  it('should catch error and fallback to generic fetch if primary query throws error', async () => {
    const mockError = new Error('Firestore error');

    const mockFallbackSnapshot = {
      empty: false,
      docs: [
        {
          id: 'leader-3',
          data: () => ({ ...mockLeaderData, name: 'Error Fallback Leader' }),
        },
      ],
    };

    (getDocs as Mock)
      .mockRejectedValueOnce(mockError)
      .mockResolvedValueOnce(mockFallbackSnapshot);

    const leaders = await getLeaders();

    expect(leaders).toEqual([{ id: 'leader-3', ...mockLeaderData, name: 'Error Fallback Leader' }]);
    expect(getDocs).toHaveBeenCalledTimes(2);
    expect(mockWarn).toHaveBeenCalledWith('Leaders fetch error, descending to generic fetch:', mockError);
  });
});
