import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, limit, getDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import type { Sermon } from '../../../types';

const SERMONS_COLLECTION = 'sermons';

const sermonsCache = new Map<string, Sermon>();
let recentSermonsCache: Sermon[] | null = null;

export const getSermons = async (maxResults = 50): Promise<Sermon[]> => {
  // If we have a recent sermons cache and it has enough items, return a slice of it
  if (recentSermonsCache && recentSermonsCache.length >= maxResults) {
    return recentSermonsCache.slice(0, maxResults);
  }

  const q = query(collection(db, SERMONS_COLLECTION), orderBy('date', 'desc'), limit(maxResults));
  const querySnapshot = await getDocs(q);
  const sermons = querySnapshot.docs.map(d => ({ id: d.id, ...d.data() } as Sermon));

  // Update cache with fetched sermons
  sermons.forEach(s => {
    if (s.id) sermonsCache.set(s.id, s);
  });

  // Cache the result for future `getSermons` calls
  // (We only update the cache if it's the largest fetch we've done so far)
  if (!recentSermonsCache || sermons.length >= recentSermonsCache.length) {
    recentSermonsCache = sermons;
  }

  return sermons;
};

export const getSermonById = async (id: string): Promise<Sermon | null> => {
  if (sermonsCache.has(id)) {
    return sermonsCache.get(id) || null;
  }

  const docRef = doc(db, SERMONS_COLLECTION, id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const sermon = { id: docSnap.id, ...docSnap.data() } as Sermon;
    sermonsCache.set(id, sermon);
    return sermon;
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
