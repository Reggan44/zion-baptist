import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, limit, getDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import type { BlogPost } from '../../../types';

const BLOG_COLLECTION = 'blog';

export const getBlogPosts = async (maxResults = 50): Promise<BlogPost[]> => {
  const q = query(
    collection(db, BLOG_COLLECTION),
    orderBy('date', 'desc'),
    limit(maxResults)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(d => ({ id: d.id, ...d.data() } as BlogPost));
};

export const getBlogPostById = async (id: string): Promise<BlogPost | null> => {
  const docRef = doc(db, BLOG_COLLECTION, id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as BlogPost;
  }
  return null;
};

export const addBlogPost = async (post: Omit<BlogPost, 'id'>) => {
  return await addDoc(collection(db, BLOG_COLLECTION), post);
};

export const updateBlogPost = async (id: string, post: Partial<BlogPost>) => {
  const ref = doc(db, BLOG_COLLECTION, id);
  return await updateDoc(ref, post);
};

export const deleteBlogPost = async (id: string) => {
  const ref = doc(db, BLOG_COLLECTION, id);
  return await deleteDoc(ref);
};
