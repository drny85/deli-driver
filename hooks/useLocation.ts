import { useEffect, useState } from 'react';

import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
const LOCATION_TASK_NAME = 'background-location-task';

var l1;
var l2;

export const useBackgroundLocation = (interval: number = 10) => {
  const [locationStarted, setLocationStarted] = useState(false);
  const [locationGranted, setLocationGranted] = useState(false);

  const startLocationTracking = async (interval: number) => {
    try {
      const initiated = await TaskManager.isTaskRegisteredAsync(LOCATION_TASK_NAME);
      if (initiated) {
        await TaskManager.unregisterTaskAsync(LOCATION_TASK_NAME);
      }
      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.BestForNavigation,
        timeInterval: 5000,
        distanceInterval: interval,
      });

      const hasStarted = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
      setLocationStarted(hasStarted);
      console.log('tracking started?', hasStarted);
    } catch (error) {
      console.log(error);
    }
  };

  const getForgroundLocation: () => Promise<Location.LocationObject> = async () => {
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    return location;
  };

  const stopLocation = () => {
    setLocationStarted(false);
    TaskManager.isTaskRegisteredAsync(LOCATION_TASK_NAME).then((tracking) => {
      if (tracking) {
        Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
      }
    });
  };

  const config = async (): Promise<boolean> => {
    try {
      let resf = await Location.requestForegroundPermissionsAsync();
      let resb = await Location.requestBackgroundPermissionsAsync();
      if (resf.status != 'granted' && resb.status !== 'granted') {
        console.log('Permission to access location was denied');
        setLocationGranted(false);
        return false;
      } else {
        console.log('Permission to access location granted');

        setLocationGranted(true);
        return true;
      }
    } catch (error) {
      console.log(error);
      setLocationGranted(false);
      return false;
    }
  };
  useEffect(() => {
    config();
  }, [interval]);

  return {
    locationStarted,
    stopLocation,
    startLocationTracking,
    locationGranted,
    getForgroundLocation,
  };
};

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.log('LOCATION_TRACKING task ERROR:', error);
    return;
  }
  if (data) {
    const { locations } = data as any;
    let lat = locations[0].coords.latitude;
    let long = locations[0].coords.longitude;

    l1 = lat;
    l2 = long;

    console.log(`${new Date(Date.now()).toLocaleString()}: ${lat},${long}`);
  }
});
