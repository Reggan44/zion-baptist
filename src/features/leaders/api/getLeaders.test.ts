import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getLeaders } from './getLeaders';
import { collection, getDocs, query, limit, orderBy } from 'firebase/firestore';
import { db } from '../../../lib/firebase';

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  getDocs: vi.fn(),
  query: vi.fn(),
  limit: vi.fn(),
  orderBy: vi.fn(),
  doc: vi.fn(),
  getDoc: vi.fn(),
  addDoc: vi.fn(),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
}));

vi.mock('../../../lib/firebase', () => ({
  db: {},
}));

describe('getLeaders', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch and return leaders correctly on success path', async () => {
    const mockLeaders = [
      { id: '1', name: 'John Doe', role: 'Pastor', order: 1 },
      { id: '2', name: 'Jane Doe', role: 'Elder', order: 2 },
    ];

    const mockSnapshot = {
      empty: false,
      docs: mockLeaders.map(leader => ({
        id: leader.id,
        data: () => ({ name: leader.name, role: leader.role, order: leader.order }),
      })),
    };

    (getDocs as any).mockResolvedValueOnce(mockSnapshot);

    const result = await getLeaders();

    expect(result).toEqual(mockLeaders);
    expect(query).toHaveBeenCalled();
    expect(getDocs).toHaveBeenCalledTimes(1);
  });

  it('should call fallback query when first query returns empty snapshot', async () => {
    const emptySnapshot = { empty: true, docs: [] };

    const fallbackLeaders = [
      { id: '3', name: 'Fallback User', role: 'Deacon' }
    ];
    const fallbackSnapshot = {
      empty: false,
      docs: fallbackLeaders.map(leader => ({
        id: leader.id,
        data: () => ({ name: leader.name, role: leader.role }),
      })),
    };

    (getDocs as any)
      .mockResolvedValueOnce(emptySnapshot)
      .mockResolvedValueOnce(fallbackSnapshot);

    const result = await getLeaders();

    expect(result).toEqual(fallbackLeaders);
    expect(getDocs).toHaveBeenCalledTimes(2);
    // The second call is to collection(db, 'leaders') directly without query
    expect(collection).toHaveBeenCalledWith(db, 'leaders');
  });

  it('should fallback and warn on exception in initial query', async () => {
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const fallbackLeaders = [
      { id: '4', name: 'Exception Fallback', role: 'Leader' }
    ];
    const fallbackSnapshot = {
      empty: false,
      docs: fallbackLeaders.map(leader => ({
        id: leader.id,
        data: () => ({ name: leader.name, role: leader.role }),
      })),
    };

    const error = new Error('Firestore failure');
    (getDocs as any)
      .mockRejectedValueOnce(error)
      .mockResolvedValueOnce(fallbackSnapshot);

    const result = await getLeaders();

    expect(result).toEqual(fallbackLeaders);
    expect(getDocs).toHaveBeenCalledTimes(2);
    expect(consoleWarnSpy).toHaveBeenCalledWith('Leaders fetch error, descending to generic fetch:', error);

    consoleWarnSpy.mockRestore();
  });
});
