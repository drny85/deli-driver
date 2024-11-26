import { useAuth } from '@/providers/authProvider'
import * as Location from 'expo-location'
import { useEffect } from 'react'
import * as TaskManager from 'expo-task-manager'
import * as Device from 'expo-device'
import { LocationData } from '@/typing'
import { useLocatioStore } from '@/providers/locationStore'
import { distanceBetweenCoords } from '@/utils/distanceBetweenCoords'
import { LOCATION_TASK_NAME } from '@/constants'

export const useDriverLocation = (
   courierId: string,
   updateLocation: (location: { latitude: number; longitude: number }) => void
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
               distanceInterval: 5

               // Update if moved by 10 meters
            },
            (location) => {
               const { latitude, longitude } = location.coords
               updateLocation({ latitude, longitude })
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

// Define the background task
TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }): any => {
   if (error) {
      console.error('Background Location Task Error:', error)
      return
   }
   if (data) {
      const { locations } = data as LocationData
      const location = locations[0]

      if (location) {
         const oldLocation = useLocatioStore.getState().location
         if (!oldLocation) return useLocatioStore.getState().setLocation(location.coords)

         const diff = distanceBetweenCoords(oldLocation, location.coords)
         console.log('DIFF', oldLocation, location.coords)
         if (diff < 2) return
         console.log('Background location:', location)
         if (Device.isDevice) {
            console.log('UPDATED in REAL DEVICE')
            useLocatioStore.getState().setLocation(location.coords)
         }

         // Send the location to the server or Firestore
         //updateDriverLocation(location.coords);
      }
   }
})

// Example function to update Firestore with location data
// const updateDriverLocation = async (coords: { latitude: number; longitude: number }) => {
//   try {
//     const driverId = 'YOUR_DRIVER_ID'; // Replace with actual driver ID
//     const locationData = {
//       latitude: coords.latitude,
//       longitude: coords.longitude,
//       timestamp: Date.now(),
//     };

//     // Update the location in Firestore
//     await firebase.firestore().collection('drivers').doc(driverId).update({
//       currentLocation: locationData,
//     });
//   } catch (error) {
//     console.error('Error updating driver location:', error);
//   }
// };
