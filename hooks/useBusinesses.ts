import { onSnapshot, query, where } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { businessCollection } from '../firebase'

import { useAuth } from '@/providers/authProvider'
import { Business } from '@/typing'

export const useBusinessAvailable = (admin?: boolean) => {
   const [isLoading, setIsLoading] = useState(true)
   const [business, setBusinessAvailable] = useState<Business[]>([])
   //   const testing = useAppSelector((s) => s.settings.testing);
   const user = useAuth().user

   useEffect(() => {
      if (!user) {
         setIsLoading(false)
         return
      }

      let q = query(businessCollection, where('profileCompleted', '==', true))
      return onSnapshot(q, (snap) => {
         const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))

         setBusinessAvailable(data)
         setIsLoading(false)
      })
   }, [user])

   return { isLoading, business }
}
