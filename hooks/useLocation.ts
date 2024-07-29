import { useLocatioStore } from '@/providers/locationStore'
import { distanceBetweenCoords } from '@/utils/distanceBetweenCoords'
import * as Location from 'expo-location'
import { router } from 'expo-router'
import * as TaskManager from 'expo-task-manager'
import { useEffect, useState } from 'react'
const LOCATION_TASK_NAME = 'background-location-task'

var l1
var l2

export const useBackgroundLocation = () => {
   const [locationStarted, setLocationStarted] = useState(false)
   const [clicked, setClicked] = useState(0)
   const [backgroundPermission, setBackgroundPermission] = useState<boolean>(false)
   const setCurrent = useLocatioStore((s) => s.setLocation)

   const startLocationTracking = async () => {
      try {
         const initiated = await TaskManager.isTaskRegisteredAsync(LOCATION_TASK_NAME)
         if (initiated) {
            await TaskManager.unregisterTaskAsync(LOCATION_TASK_NAME)
         }
         const available = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME)
         if (available) {
            await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME)
         }

         const currentLocation = await getForgroundLocation()
         if (currentLocation) {
            setCurrent(currentLocation.coords)
         }

         await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
            accuracy: Location.Accuracy.Highest,
            timeInterval: 5000,
            distanceInterval: 20,
            activityType: Location.ActivityType.AutomotiveNavigation,
            deferredUpdatesInterval: 5000,
            deferredUpdatesDistance: 20,
            showsBackgroundLocationIndicator: true,
            pausesUpdatesAutomatically: true
         })

         const hasStarted = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME)
         setLocationStarted(hasStarted)
         console.log('tracking started?', hasStarted)
      } catch (error) {
         console.log(error)
      }
   }

   const getForgroundLocation: () => Promise<Location.LocationObject | null> = async () => {
      const location = await Location.getCurrentPositionAsync({
         accuracy: Location.Accuracy.Balanced
      })

      useLocatioStore.getState().setLocation(location.coords)
      return location
   }

   const stopLocation = () => {
      setLocationStarted(false)
      TaskManager.isTaskRegisteredAsync(LOCATION_TASK_NAME).then((tracking) => {
         if (tracking) {
            Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME)
            console.log('tracking stopped')
         }
      })
   }

   const config = async () => {
      try {
         let resf = await Location.requestForegroundPermissionsAsync()
         let resb = await Location.requestBackgroundPermissionsAsync()

         if (resf.status != 'granted' || resb.status !== 'granted') {
            setBackgroundPermission(false)
            router.replace('/notlocation')
         } else {
            setBackgroundPermission(true)
            console.log('Permission to access location granted', resb.status)
            router.replace('/(tabs)')
         }
      } catch (error) {
         console.log(error)
      }
   }

   useEffect(() => {
      let mounted = true
      if (mounted) {
         Location.requestBackgroundPermissionsAsync()
            .then((res) => {
               console.log(res.status)
               setBackgroundPermission(res.status === 'granted')
               if (res.status !== 'granted') config()
            })
            .catch((err) => console.log(err))
      }
   }, [backgroundPermission])

   return {
      stopLocation,
      startLocationTracking,
      getForgroundLocation,
      backgroundPermission,
      locationStarted,
      clicked,
      setClicked,
      config
   }
}

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error, executionInfo }) => {
   if (error) {
      console.log('LOCATION_TRACKING task ERROR:', error)
      return
   }

   if (data) {
      const { locations } = data as any
      let lat = locations[0].coords.latitude
      let long = locations[0].coords.longitude
      const location = useLocatioStore.getState().getLocation()
      const diff = distanceBetweenCoords(location, { latitude: lat, longitude: long })

      if (diff < 5) return
      console.log('diff', diff)
      useLocatioStore.getState().setLocation({ latitude: lat, longitude: long })

      l1 = lat
      l2 = long

      console.log(`${new Date(Date.now()).toLocaleString()}: ${lat},${long}`)
   }
})
