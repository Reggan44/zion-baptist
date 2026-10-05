import { collection, addDoc, getDocs, orderBy, query, limit } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import type { BroadcastNotification } from '../../../types';

const NOTIFICATIONS_COLLECTION = 'notifications';

export const getBroadcastHistory = async (maxResults = 20): Promise<BroadcastNotification[]> => {
  const q = query(
    collection(db, NOTIFICATIONS_COLLECTION),
    orderBy('sentAt', 'desc'),
    limit(maxResults)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(d => ({ id: d.id, ...d.data() } as BroadcastNotification));
};

export const broadcastNotification = async (notification: Omit<BroadcastNotification, 'id'>) => {
  // This writes to a collection that an FCM-trigger (like a Cloud Function) would listen to.
  // Or it can be used for in-app alerts.
  return await addDoc(collection(db, NOTIFICATIONS_COLLECTION), notification);
};
