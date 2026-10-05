import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, limit, getDoc, orderBy } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import type { Ministry } from '../../../types';

const MINISTRIES_COLLECTION = 'ministries';

export const getMinistries = async (maxResults = 50): Promise<Ministry[]> => {
  try {
    const q = query(
      collection(db, MINISTRIES_COLLECTION), 
      orderBy('order', 'asc'),
      limit(maxResults)
    );
    const querySnapshot = await getDocs(q);
    
    // Fallback: If no results with ordering (e.g. 'order' field is missing), fetch all
    if (querySnapshot.empty) {
      console.warn('Ministries ordered query was empty. Falling back to unordered fetch.');
      const fallbackSnapshot = await getDocs(collection(db, MINISTRIES_COLLECTION));
      return fallbackSnapshot.docs.map(d => ({ id: d.id, ...d.data() } as Ministry));
    }

    return querySnapshot.docs.map(d => ({ id: d.id, ...d.data() } as Ministry));
  } catch (error) {
    console.warn('Ministries fetch error, attempting fallback:', error);
    const querySnapshot = await getDocs(collection(db, MINISTRIES_COLLECTION));
    return querySnapshot.docs.map(d => ({ id: d.id, ...d.data() } as Ministry));
  }
};

export const getMinistryById = async (id: string): Promise<Ministry | null> => {
  const docRef = doc(db, MINISTRIES_COLLECTION, id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Ministry;
  }
  return null;
};

export const addMinistry = async (ministry: Omit<Ministry, 'id'>) => {
  return await addDoc(collection(db, MINISTRIES_COLLECTION), ministry);
};

export const updateMinistry = async (id: string, ministry: Partial<Ministry>) => {
  const ref = doc(db, MINISTRIES_COLLECTION, id);
  return await updateDoc(ref, ministry);
};

export const deleteMinistry = async (id: string) => {
  const ref = doc(db, MINISTRIES_COLLECTION, id);
  return await deleteDoc(ref);
};
