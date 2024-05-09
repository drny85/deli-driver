import { couriersCollection } from '@/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

type DataResponde = {
  success: boolean;
  message: string | null;
};

export const addCourierToWaitingList = async (
  storeId: string,
  courierId: string
): Promise<DataResponde> => {
  try {
    const cDoc = doc(couriersCollection, storeId);
    const exists = await getDoc(cDoc);
    if (exists.exists()) return { success: false, message: 'already exists' };
    await setDoc(cDoc, { id: courierId, status: 'pending' });
    return { success: true, message: 'added' };
  } catch (error) {
    console.log('Error adding courier to list', error);
    return { success: false, message: null };
  }
};
