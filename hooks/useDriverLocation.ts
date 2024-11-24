import * as Location from 'expo-location'
import { useEffect } from 'react'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '@/firebase'
import { useAuth } from '@/providers/authProvider'

export const useDriverLocation = (
   courierId: string,
   updateLocation: (location: { lat: number; lng: number }) => void
) => {
   const { user } = useAuth()
   useEffect(() => {
      if (!user || !courierId) return
      let locationSubscription: Location.LocationSubscription

      const startTracking = async () => {
         const { status } = await Location.requestForegroundPermissionsAsync()
         if (status !== 'granted') {
            console.error('Permission to access location was denied')
            return
         }
         console.log('STATUS', status)
         locationSubscription = await Location.watchPositionAsync(
            {
               accuracy: Location.Accuracy.High,
               timeInterval: 5000, // Update every 5 seconds
               distanceInterval: 0 // Update if moved by 10 meters
            },
            (location) => {
               const { latitude, longitude } = location.coords
               updateLocation({ lat: latitude, lng: longitude })
            }
         )
      }

      startTracking()

      return () => {
         if (locationSubscription) {
            console.log('STOPPED', courierId)
            locationSubscription.remove()
         }
      }
   }, [courierId, updateLocation, user, courierId])
}

const updateDriverLocationInFirestore = async (
   courierId: string,
   location: { lat: number; lng: number }
) => {
   const driverRef = doc(db, 'drivers', courierId)
   await setDoc(driverRef, { location }, { merge: true })
}
