import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, limit, getDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import type { EventItem } from '../../../types';

const EVENTS_COLLECTION = 'events';

export const getEvents = async (maxResults = 50): Promise<EventItem[]> => {
  const q = query(collection(db, EVENTS_COLLECTION), orderBy('date', 'asc'), limit(maxResults));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(d => ({ id: d.id, ...d.data() } as EventItem));
};

export const getEventById = async (id: string): Promise<EventItem | null> => {
  const docRef = doc(db, EVENTS_COLLECTION, id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as EventItem;
  }
  return null;
};

export const addEvent = async (event: Omit<EventItem, 'id'>) => {
  return await addDoc(collection(db, EVENTS_COLLECTION), event);
};

export const updateEvent = async (id: string, event: Partial<EventItem>) => {
  const eventRef = doc(db, EVENTS_COLLECTION, id);
  return await updateDoc(eventRef, event);
};

export const deleteEvent = async (id: string) => {
  const eventRef = doc(db, EVENTS_COLLECTION, id);
  return await deleteDoc(eventRef);
};
