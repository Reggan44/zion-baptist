import { collection, getDocs, query, orderBy, deleteDoc, doc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';

const COLLECTION = 'contact_messages';

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  read: boolean;
  createdAt: Timestamp | any;
}

export const getContactMessages = async (): Promise<ContactMessage[]> => {
  const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as ContactMessage));
};

export const deleteContactMessage = async (id: string) => {
  await deleteDoc(doc(db, COLLECTION, id));
};

export const markMessageAsRead = async (id: string) => {
  await updateDoc(doc(db, COLLECTION, id), { read: true });
};
