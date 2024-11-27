import { db } from '@/firebase'
import { useAuth } from '@/providers/authProvider'
import { useModal } from '@/providers/ModalProvider'
import { dayjsFormat } from '@/utils/dayjs'
import { useSegments } from 'expo-router'
import { collection, limit, onSnapshot, orderBy, query, where } from 'firebase/firestore'
import { useEffect } from 'react'

export const useCourierNotification = () => {
   const { user } = useAuth()
   const { showModal } = useModal()
   const segments = useSegments()
   const inMapsScreen = segments[2] === 'maps'

   useEffect(() => {
      if (!user || inMapsScreen) return
      const ref = query(
         collection(db, `deliveries`),
         where('courierId', '==', user?.id),
         orderBy('orderDate', 'desc'),
         limit(1)
      )
      return onSnapshot(ref, (doc) => {
         const data = doc.docs.map(
            (d) => ({ ...d.data() }) as { orderDate: string; corrierId: string; orderId: string }
         )

         doc.docChanges().forEach((change) => {
            const canPlay = dayjsFormat(data[0].orderDate).diff(dayjsFormat(), 'seconds')
            if (Math.abs(canPlay) > 5) return
            if (change.type === 'added') {
               showModal({
                  data: data[0].orderId
               })
            }
         })
      })
   }, [user, inMapsScreen])
}
