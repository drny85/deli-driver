import * as TaskManager from 'expo-task-manager'
import * as Location from 'expo-location'
import { LOCATION_TASK_NAME } from '@/constants'

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
         distanceInterval: 30, // Update every 50 meters
         deferredUpdatesInterval: 1000 * 60, // Minimum time interval between updates (in ms)
         showsBackgroundLocationIndicator: true
         // iOS only: shows the blue bar while tracking
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
