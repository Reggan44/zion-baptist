import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, limit, getDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import type { Sermon } from '../../../types';

const SERMONS_COLLECTION = 'sermons';

export const getSermons = async (maxResults = 50): Promise<Sermon[]> => {
  const q = query(collection(db, SERMONS_COLLECTION), orderBy('date', 'desc'), limit(maxResults));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(d => ({ id: d.id, ...d.data() } as Sermon));
};

export const getSermonById = async (id: string): Promise<Sermon | null> => {
  const docRef = doc(db, SERMONS_COLLECTION, id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Sermon;
  }
  return null;
};

export const addSermon = async (sermon: Omit<Sermon, 'id'>) => {
  return await addDoc(collection(db, SERMONS_COLLECTION), sermon);
};

export const updateSermon = async (id: string, sermon: Partial<Sermon>) => {
  const sermonRef = doc(db, SERMONS_COLLECTION, id);
  return await updateDoc(sermonRef, sermon);
};

export const deleteSermon = async (id: string) => {
  const sermonRef = doc(db, SERMONS_COLLECTION, id);
  return await deleteDoc(sermonRef);
};
