import { db } from '@/firebase'
import { setLocation } from '@/providers/locationStore'
import { Coords } from '@/typing'
import { doc, setDoc, onSnapshot } from 'firebase/firestore'

export const updateDriverLocationInFirestore = async (courierId: string, location: Coords) => {
   const driverRef = doc(db, 'drivers', courierId)
   try {
      await setDoc(driverRef, { location }, { merge: true })
   } catch (error) {
      console.log('Error updating locations', error)
   }
}

export const listenToDriverLocation = (
   courierId: string,
   onLocationUpdate: (location: Coords) => void
) => {
   const driverRef = doc(db, 'drivers', courierId)

   const unsubscribe = onSnapshot(driverRef, (doc) => {
      if (doc.exists()) {
         const data = doc.data()
         if (data.location) {
            onLocationUpdate(data.location)
            setLocation(data.location)
         }
      }
   })

   return unsubscribe
}
