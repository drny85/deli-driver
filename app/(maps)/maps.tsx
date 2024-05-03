import ETA from '@/components/map/ETA';
import MapHeader from '@/components/map/MapHeader';
import { Colors, SIZES } from '@/constants/Colors';
import { useOrder } from '@/hooks/useOrder';
import { useLocatioStore } from '@/providers/locationStore';
import { Coords, Order, TempOrder } from '@/typing';
import { findUndeliveredOrder } from '@/utils/getNextClosestOrder';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import MapViewDirections, { MapDirectionsResponse } from 'react-native-maps-directions';
import openMap from 'react-native-open-maps';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

const AnimatedMap = Animated.createAnimatedComponent(MapView);
const DELTA = {
  latitudeDelta: 0.02,
  longitudeDelta: 0.02,
};

const ordersData: TempOrder[] = [
  {
    id: '1',
    destination: { latitude: 40.83017, longitude: -73.91595 }, // New York
    status: 'Accepted By Courier',
  },
  {
    id: '2',
    destination: { latitude: 40.83399, longitude: -73.90537 }, // Los Angeles
    status: 'Delivered',
  },
  {
    id: '3',
    destination: { latitude: 51.5074, longitude: -0.1278 }, // London
    status: 'Accepted By Courier',
  },
  {
    id: '4',
    destination: { latitude: 40.82658, longitude: -73.90762 }, // London
    status: 'Accepted By Courier',
  },
  {
    id: '5',
    destination: { latitude: 40.833, longitude: -73.90109 }, // London
    status: 'Accepted By Courier',
  },
  // Add more orders as needed
];

let timeOut: NodeJS.Timeout;

const Maps = () => {
  const mapViewRef = useRef<MapView>(null);
  const location = useLocatioStore((s) => s.location);
  const [distance, setDistance] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const height = useSharedValue(0.15);
  const [orders, setOrders] = useState<TempOrder[]>(ordersData);

  const [initialRegion, setInitialRegion] = useState<Region>({
    latitude: 40.8306,
    longitude: -73.90453,
    ...DELTA,
  });
  const [origin, setOrigin] = useState<Coords | null>({
    latitude: 40.86758,
    longitude: -73.90475,
  });
  // const [destination, setDestination] = useState<Coords | null>({
  //   latitude: 40.85109,
  //   longitude: -73.89316,
  // });

  const [restaurant, setRestaurant] = useState<Coords | null>({
    latitude: 40.84738,
    longitude: -73.90275,
  });

  const snapshots = useMemo(() => ['15%', '50%', '80%'], []);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const waypoints = useMemo(
    () => (origin && restaurant ? [origin, restaurant] : []),
    [origin, restaurant]
  );

  const order = useMemo(() => findUndeliveredOrder(orders, origin!), [orders]);
  console.log(order);

  const openGoogleMap = useCallback(async (route: { latitude: number; longitude: number }) => {
    try {
      const endRoute = '1450 clay ave, bronx ny 10456';

      // @ts-ignore
      openMap({
        ...route,
        provider: 'google',
        end: endRoute!,
        navigate: true,
        travelType: 'drive',
      });
    } catch (error) {
      console.log('Error opening Map', error);
    }
  }, []);

  const onMapChange = (chnages: MapDirectionsResponse) => {
    const { distance, duration } = chnages;
    setDistance(distance);
    setDuration(duration);
  };

  const animatedHeight = useAnimatedStyle(() => ({
    bottom: withTiming(SIZES.height * height.value),
  }));

  useEffect(() => {
    if (!origin || !order) return;

    if (order.status === 'Accepted By Courier') {
      mapViewRef.current?.fitToSuppliedMarkers(['origin', 'destination', 'restaurant'], {
        edgePadding: {
          top: 20,
          right: 20,
          bottom: 20,
          left: 20,
        },
      });
      timeOut = setTimeout(() => {
        mapViewRef.current?.animateToRegion({
          ...origin,
          ...DELTA,
        });
      }, 1500);
      timeOut = setTimeout(() => {
        mapViewRef.current?.animateToRegion({
          ...restaurant!,
          ...DELTA,
        });
      }, 3500);
      timeOut = setTimeout(() => {
        mapViewRef.current?.animateToRegion({
          ...order.destination!,
          ...DELTA,
        });
      }, 5500);
      timeOut = setTimeout(() => {
        mapViewRef.current?.fitToSuppliedMarkers(['origin', 'restaurant', 'destination'], {
          edgePadding: {
            top: 30,
            right: 30,
            bottom: 50,
            left: 30,
          },
        });
      }, 7000);
    }

    if (order.status === 'Picked By Courier') {
      mapViewRef.current?.fitToSuppliedMarkers(['origin', 'destination']);
    }

    return () => timeOut && clearTimeout(timeOut);
  }, [location, order, restaurant]);

  useEffect(() => {
    if (!order) {
      router.back();
    }
  }, [order]);
  return (
    <View style={styles.container}>
      <MapHeader
        onCenterPress={() => {
          // mapViewRef.current?.fitToSuppliedMarkers(['origin', 'restaurant', 'destination'], {
          //   edgePadding: {
          //     top: 30,
          //     right: 30,
          //     bottom: 50,
          //     left: 30,
          //   },
          // });
          // setOrders((prev) => [
          //   ...prev.map((o) => (o.id === order?.id ? { ...order!, status: 'Delivered' } : o)),
          // ]);
        }}
        onPress={() => {
          openGoogleMap({ ...origin! });
        }}
      />
      {origin && order && (
        <AnimatedMap
          style={[styles.map, animatedHeight]}
          mapPadding={{
            left: 40,
            top: 50,
            right: 40,
            bottom: 20,
          }}
          ref={mapViewRef}
          zoomEnabled
          zoomControlEnabled
          provider={PROVIDER_GOOGLE}
          initialRegion={initialRegion}
          region={initialRegion}
          showsUserLocation
          followsUserLocation
          zoomTapEnabled
          showsPointsOfInterest={false}
          showsBuildings={false}>
          {origin && <Marker coordinate={origin} title="Me" identifier="origin" />}
          {restaurant && (
            <Marker coordinate={restaurant} title="Restaurant" identifier="restaurant" />
          )}
          {order && order.destination && (
            <Marker coordinate={order.destination} title="Customer" identifier="destination" />
          )}
          {origin && order && order.destination && restaurant && (
            <MapViewDirections
              apikey={'AIzaSyAlCsbcHrd8t87qDnUVzWQEqQYDmuDVmDM'}
              origin={origin}
              destination={order.destination}
              strokeWidth={3}
              strokeColor={Colors.main}
              onStart={(params) => {
                console.log(
                  `Started routing between "${params.origin}" and "${params.destination}"`
                );
              }}
              waypoints={waypoints}
              onError={(err) => {
                console.log('Error getting Directions', err);
              }}
              onReady={onMapChange}
            />
          )}
        </AnimatedMap>
      )}

      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapshots}
        backgroundStyle={{ backgroundColor: Colors.white }}
        onChange={(change) => {
          if (change === 1) {
            height.value = withTiming(0.5);
          } else if (change === 2) {
            height.value = withTiming(0.5);
          } else if (change === 0) {
            height.value = withTiming(0.15, { duration: 500 });
          }
        }}
        index={0}
        handleIndicatorStyle={{ backgroundColor: Colors.main }}>
        <BottomSheetScrollView
          contentContainerStyle={{ backgroundColor: Colors.white, padding: SIZES.lg }}>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
            <ETA title={distance.toFixed(2)} subtitle="miles" />
            <Text style={styles.eta}>ETA {orders.length}</Text>
            <ETA title={duration.toFixed(2)} subtitle="mins" />
          </View>
        </BottomSheetScrollView>
      </BottomSheet>
    </View>
  );
};

export default Maps;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  map: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,
  },
  eta: {
    fontSize: 22,
    fontFamily: 'Genos-Bold',
  },
});
