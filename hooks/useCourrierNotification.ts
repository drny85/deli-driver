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
   console.log(segments[2])

   useEffect(() => {
      if (!user) return
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
         console.log(JSON.stringify(data, null, 2))
         doc.docChanges().forEach((change) => {
            console.log(change.oldIndex, change.newIndex)
            const canPlay = dayjsFormat(data[0].orderDate).diff(dayjsFormat(), 'seconds')
            if (Math.abs(canPlay) > 5) return
            if (change.type === 'added') {
               console.log('New')
               showModal({
                  title: 'New Order',
                  data: data[0].orderId
               })
            }
         })
      })
   }, [user])
}
