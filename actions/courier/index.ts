import { db } from '@/firebase'
import { useLocatioStore } from '@/providers/locationStore'
import { Coords } from '@/typing'
import { doc, onSnapshot } from 'firebase/firestore'
import * as Location from 'expo-location'

export const listenToDriverLocation = (
   courierId: string,
   onLocationUpdate: (location: Coords) => void
) => {
   const driverRef = doc(db, 'drivers', courierId)

   const unsubscribe = onSnapshot(driverRef, async (doc) => {
      if (doc.exists()) {
         const data = doc.data()
         console.log('Driver location updated', data.location)
         if (data.location) {
            onLocationUpdate(data.location)
            useLocatioStore.getState().setLocation(data.location)
         }
      } else {
         try {
            await Location.getCurrentPositionAsync({
               accuracy: Location.Accuracy.BestForNavigation,
               timeInterval: 1000,
               distanceInterval: 1
            }).then((location) => {
               onLocationUpdate({
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude
               })
               useLocatioStore.getState().setLocation({
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude
               })
            })
         } catch (error) {}
      }
   })

   return unsubscribe
}
