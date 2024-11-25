import { useAuth } from '@/providers/authProvider'
import * as Location from 'expo-location'
import { useEffect } from 'react'
import * as TaskManager from 'expo-task-manager'
import { LocationData } from '@/typing'

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

const LOCATION_TASK_NAME = 'background-location-task'

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
         console.log('Background location:', location)

         // Send the location to the server or Firestore
         //updateDriverLocation(location.coords);
      }
   }
})

export const startBackgroundLocationUpdates = async () => {
   const { status } = await Location.requestBackgroundPermissionsAsync()

   if (status !== 'granted') {
      console.error('Background location permission not granted')
      return
   }

   const isTaskDefined = await TaskManager.isTaskRegisteredAsync(LOCATION_TASK_NAME)
   if (!isTaskDefined) {
      console.log('Starting background location updates...')
      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
         accuracy: Location.Accuracy.High,
         distanceInterval: 10, // Update every 50 meters
         deferredUpdatesInterval: 1000 * 60, // Minimum time interval between updates (in ms)
         showsBackgroundLocationIndicator: true // iOS only: shows the blue bar while tracking
      })
   } else {
      console.log('Background location task already running.')
   }
}

export const stopBackgroundLocationUpdates = async () => {
   const isTaskDefined = await TaskManager.isTaskRegisteredAsync(LOCATION_TASK_NAME)
   if (isTaskDefined) {
      console.log('Stopping background location updates...')
      await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME)
   } else {
      console.log('No background location task running.')
   }
}

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
