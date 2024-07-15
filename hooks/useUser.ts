import { auth, usersCollection } from '@/firebase'
import { useAuth } from '@/providers/authProvider'
import { doc, onSnapshot } from 'firebase/firestore'
import { useEffect, useState } from 'react'

export const useUser = () => {
   const { setUser, user } = useAuth()
   const [loading, setLoading] = useState(false)
   useEffect(() => {
      if (!auth.currentUser) return
      setLoading(true)
      auth.currentUser?.reload()
      const userRef = doc(usersCollection, auth.currentUser.uid)
      return onSnapshot(userRef, (snap) => {
         if (!snap.exists()) {
            setLoading(false)
            return
         }

         setUser({
            ...snap.data(),
            id: auth.currentUser?.uid,
            emailVerified: auth.currentUser?.emailVerified!
         })
         setLoading(false)
      })
   }, [auth.currentUser])

   return { loading, user }
}
