import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, limit, getDoc, orderBy } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import type { Leader } from '../../../types';

const LEADERS_COLLECTION = 'leaders';

export const getLeaders = async (maxResults = 20): Promise<Leader[]> => {
  try {
    const q = query(
      collection(db, LEADERS_COLLECTION), 
      orderBy('order', 'asc'),
      limit(maxResults)
    );
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      const fallbackSnapshot = await getDocs(collection(db, LEADERS_COLLECTION));
      return fallbackSnapshot.docs.map(d => ({ id: d.id, ...d.data() } as Leader));
    }

    return querySnapshot.docs.map(d => ({ id: d.id, ...d.data() } as Leader));
  } catch (error) {
    console.warn('Leaders fetch error, descending to generic fetch:', error);
    const querySnapshot = await getDocs(collection(db, LEADERS_COLLECTION));
    return querySnapshot.docs.map(d => ({ id: d.id, ...d.data() } as Leader));
  }
};

export const getLeaderById = async (id: string): Promise<Leader | null> => {
  const docRef = doc(db, LEADERS_COLLECTION, id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Leader;
  }
  return null;
};

export const addLeader = async (leader: Omit<Leader, 'id'>) => {
  return await addDoc(collection(db, LEADERS_COLLECTION), leader);
};

export const updateLeader = async (id: string, leader: Partial<Leader>) => {
  const ref = doc(db, LEADERS_COLLECTION, id);
  return await updateDoc(ref, leader);
};

export const deleteLeader = async (id: string) => {
  const ref = doc(db, LEADERS_COLLECTION, id);
  return await deleteDoc(ref);
};
