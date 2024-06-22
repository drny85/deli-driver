import { couriersCollection } from '@/firebase';
import { StoreCourierData } from '@/typing';
import { onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';

export const useCourierWaitingList = () => {
  const [list, setList] = useState<StoreCourierData[]>([]);
  const [loadingList, setLoadingList] = useState(false);
  useEffect(() => {
    setLoadingList(true);
    return onSnapshot(couriersCollection, (snap) => {
      setList(snap.docs.map((doc) => ({ ...doc.data() })));
      setLoadingList(false);
    });
  }, []);

  return { list, loadingList };
};
