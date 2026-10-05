import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import type { GalleryItem } from '../../../types';

const GALLERY_COLLECTION = 'gallery';

export const getGalleryItems = async (maxResults = 50): Promise<GalleryItem[]> => {
  const q = query(
    collection(db, GALLERY_COLLECTION),
    orderBy('date', 'desc'),
    limit(maxResults)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(d => ({ id: d.id, ...d.data() } as GalleryItem));
};

export const addGalleryItem = async (item: Omit<GalleryItem, 'id'>) => {
  return await addDoc(collection(db, GALLERY_COLLECTION), item);
};

export const updateGalleryItem = async (id: string, item: Partial<GalleryItem>) => {
  const ref = doc(db, GALLERY_COLLECTION, id);
  return await updateDoc(ref, item);
};

export const deleteGalleryItem = async (id: string) => {
  const ref = doc(db, GALLERY_COLLECTION, id);
  return await deleteDoc(ref);
};
