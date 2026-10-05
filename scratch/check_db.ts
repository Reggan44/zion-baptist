
import { db } from './src/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

async function checkMinistries() {
  try {
    const querySnapshot = await getDocs(collection(db, 'ministries'));
    console.log(`Total ministries found: ${querySnapshot.size}`);
    querySnapshot.forEach((doc) => {
      console.log(`${doc.id} =>`, doc.data());
    });
  } catch (e) {
    console.error('Error checking ministries:', e);
  }
}

checkMinistries();
