import { db } from '@/firebase'
import { useAuth } from '@/providers/authProvider'
import { useModal } from '@/providers/ModalProvider'
import { dayjsFormat } from '@/utils/dayjs'
import { useSegments } from 'expo-router'
import { collection, limit, onSnapshot, orderBy, query, where } from 'firebase/firestore'
import { useEffect } from 'react'

export const useCourierNotification = () => {
   const { user } = useAuth()
   const { showModal, hideModal } = useModal()
   const segments = useSegments()
   const inMapsScreen = segments[2] === 'maps'

   useEffect(() => {
      if (!user || inMapsScreen) return

      const q = query(
         collection(db, `deliveries`),
         where('courierId', '==', user.id),
         orderBy('orderDate', 'desc'),
         limit(1)
      )
      // const ref = query(
      //   doc( collection(db, `deliveries`),)

      //    orderBy('orderDate', 'desc'),
      //    limit(1)
      // )

      return onSnapshot(q, (doc) => {
         if (doc.empty) {
            hideModal()
            return
         }
         const data = doc.docs.map(
            (d) => ({ ...d.data() }) as { orderDate: string; courierId: string; orderId: string }
         )

         doc.docChanges().forEach((change) => {
            if (data.length === 0) return

            const canPlay = dayjsFormat(data[0].orderDate).diff(dayjsFormat(), 'seconds')
            if (Math.abs(canPlay) > 5) {
               hideModal()
               return
            }
            if (change.type === 'added') {
               showModal({
                  data: data[0].orderId
               })
            }
         })
      })
   }, [user, inMapsScreen])
}
