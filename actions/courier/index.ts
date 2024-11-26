import { db } from '@/firebase'
import { useLocatioStore } from '@/providers/locationStore'
import { Coords } from '@/typing'
import { doc, onSnapshot } from 'firebase/firestore'

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
            useLocatioStore.getState().setLocation(data.location)
         }
      }
   })

   return unsubscribe
}
