import { db } from '@/firebase'
import { Coords } from '@/typing'
import { doc, setDoc } from 'firebase/firestore'

export const updateDriverLocationInFirestore = async (courierId: string, location: Coords) => {
   const driverRef = doc(db, 'drivers', courierId)
   try {
      await setDoc(driverRef, { location }, { merge: true })
   } catch (error) {
      console.log('Error updating locations', error)
   }
}
