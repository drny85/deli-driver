import { businessCollection } from '@/firebase'
import { Business } from '@/typing'
import { doc, onSnapshot } from 'firebase/firestore'
import { useEffect, useState } from 'react'

export const useBusiness = (id: string) => {
   const [business, setBusiness] = useState<Business | null>(null)
   const [loading, setLoading] = useState(true)
   useEffect(() => {
      if (!id) {
         setLoading(false)
         return
      }
      const busRef = doc(businessCollection, id)

      return onSnapshot(busRef, (snap) => {
         setBusiness(snap.data() as Business)
         setLoading(false)
      })
   }, [id])

   return { business, loading }
}
