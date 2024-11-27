import { Button } from '@/components/Button'
import Divider from '@/components/Divider'
import Loading from '@/components/Loading'
import ETA from '@/components/map/ETA'
import MapHeader from '@/components/map/MapHeader'
import MapOrderDetails from '@/components/map/MapOrderDetails'
import Row from '@/components/Row'
import { Colors, SIZES } from '@/constants/Colors'
import { useBusiness } from '@/hooks/useBusiness'

import { useAuth } from '@/providers/authProvider'
import { useLocatioStore } from '@/providers/locationStore'
import { useOrdersStore } from '@/providers/ordersStore'
import { Coords, Order, ORDER_STATUS } from '@/typing'
import { actionTitle } from '@/utils/actionTitle'

import Constants from 'expo-constants'
import { router, useLocalSearchParams } from 'expo-router'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native'
import MapView, { Marker, Region } from 'react-native-maps'
import MapViewDirections, {
   MapDirectionsResponse,
   MapViewDirectionsMode
} from 'react-native-maps-directions'
import openMap from 'react-native-open-maps'
import { useSharedValue, withTiming } from 'react-native-reanimated'
import OTP from './otp'
import { Sheet, useSheetRef } from '@/components/Sheet'
import { listenToDriverLocation } from '@/actions/courier'
import debounce from 'lodash.debounce'
import { startBackgroundLocationUpdates } from '@/utils/location'

const API_KEY = Constants.expoConfig?.extra?.env.EXPO_PUBLIC_GOOGLE_API || ''

const DELTA = {
   latitudeDelta: 0.02,
   longitudeDelta: 0.02
}
let DISTANCE = 0.1
let timeOut: NodeJS.Timeout

const Maps = () => {
   const { updateUser, user } = useAuth()

   const [drivingMode, setDrivingMode] = useState<MapViewDirectionsMode>('DRIVING')
   const [driverLocation, setDriverLocation] = useState<Coords | null>(null)
   const { orderId } = useLocalSearchParams<{ orderId: string }>()
   const { getOrder, setOrders, orders, updateOrder } = useOrdersStore()
   const order = getOrder(orderId!)

   const restaurant = order.address?.coords
   // useDriverLocation(user?.id!, (location) => {a
   //    console.log('Location: ', location)
   // })
   const mapViewRef = useRef<MapView>(null)
   const snapshots = useMemo(() => ['18%', '65%', '80%'], [])
   const bottomSheetRef = useSheetRef()

   const { business, loading } = useBusiness(order.businessId)
   const [show, setShow] = useState(false)

   const [distance, setDistance] = useState<number>(0)
   const [duration, setDuration] = useState<number>(0)
   const height = useSharedValue(0.2)

   const [initialRegion, setInitialRegion] = useState<Region>({
      latitude: 40.8306,
      longitude: -73.90453,
      ...DELTA
   })

   // const [destination, setDestination] = useState<Coords | null>({
   //   latitude: 40.85109,
   //   longitude: -73.89316,
   // });

   const waypoints = useMemo(
      () =>
         driverLocation &&
         business?.coords &&
         order?.status === ORDER_STATUS.marked_ready_for_delivery
            ? [driverLocation, business.coords]
            : [],
      [driverLocation, business, order.status]
   )

   const onMapChange = (changes: MapDirectionsResponse) => {
      const { distance, duration } = changes
      setDistance(distance)
      setDuration(duration)
      console.log('Distance: => ', distance)
      if (distance < 1.3) {
         setDrivingMode('WALKING')
      }
      if (distance < 0.6) {
         console.log('Opening: ', duration)
         bottomSheetRef.current?.snapToIndex(2)
      }
      if (order.status === ORDER_STATUS.picked_up_by_driver) {
         // DISTANCE = distance;
      }
   }

   const onActionPress = async () => {
      if (order?.status === ORDER_STATUS.marked_ready_for_delivery) {
         const updatedOrder: Order = { ...order, status: ORDER_STATUS.accepted_by_driver }

         const success = await updateOrder(updatedOrder)

         if (!success) return
         updateUser({
            ...user!,
            busy: true
         })
         await startBackgroundLocationUpdates()

         router.back()
         return
      } else if (order?.status === ORDER_STATUS.accepted_by_driver) {
         const updatedNewOrder: Order = { ...order, status: ORDER_STATUS.picked_up_by_driver }
         const success = await updateOrder(updatedNewOrder)
         if (!success) return

         openGoogleMap()
      } else if (order?.status === ORDER_STATUS.picked_up_by_driver) {
         if (distance > 0.7) {
            Alert.alert(
               'Distance',
               `You are too far from the destination\n ${distance.toFixed(2)} miles\n \nPlease get closer`
            )
            return
         }
         setShow(true)
      }
   }

   const completeDelivery = useCallback(async () => {
      const updatedNewOrder: Order = {
         ...order,
         status: ORDER_STATUS.delivered,
         otpPickup: null,
         deliveredOn: new Date().toISOString(),
         deliveredBy: { ...user! }
      }
      try {
         const success = await updateOrder(updatedNewOrder)
         if (!success || !user) return
         await updateUser({
            ...user!,
            busy: false
         })
         setOrders([
            ...orders.map((o) => {
               if (o.id === orderId) {
                  return updatedNewOrder
               }
               return o
            })
         ])
         console.log('Going to NextOrder')
         router.replace('/nextOrder')
      } catch (error) {
         console.log(error)
      }
   }, [])

   const updateCamera = debounce((location) => {
      if (order.status === ORDER_STATUS.marked_ready_for_delivery) return
      mapViewRef.current?.animateCamera({
         center: location,
         zoom: 15,
         pitch: 45, // 3D tilt
         heading: 0
      })
   }, 500) // Adjust delay based on requirements

   useEffect(() => {
      // Start listening to the driver's location in Firestore
      if (!user?.id) return
      const unsubscribe = listenToDriverLocation(user?.id!, (location) => {
         console.log('Location from Firebase', location)
         setDriverLocation(location)
         // Animate the camera to the new location
         updateCamera(location)
      })

      // Clean up the listener when the component unmounts
      return () => unsubscribe()
   }, [user?.id])

   // const order = useMemo(() => findUndeliveredOrder(orders, origin!), [orders]);
   // console.log(order);

   const openGoogleMap = useCallback(async () => {
      try {
         const route =
            order.status === ORDER_STATUS.accepted_by_driver
               ? business?.coords
               : order.status === ORDER_STATUS.picked_up_by_driver
                 ? order.address?.coords
                 : null
         const endRoute =
            order.status === ORDER_STATUS.accepted_by_driver
               ? business?.address
               : order.status === ORDER_STATUS.picked_up_by_driver
                 ? order.address?.street
                 : ''

         // @ts-ignore
         console.log(route, endRoute)
         openMap({
            ...route,
            provider: 'google',
            end: endRoute!,
            navigate: true,
            travelType: 'drive'
         })
      } catch (error) {
         console.log('Error opening Map', error)
      }
   }, [])

   // const animatedHeight = useAnimatedStyle(() => ({
   //   bottom: withTiming(SIZES.height * height.value),
   // }));

   useEffect(() => {
      if (!driverLocation || !order) return

      // startLocationTracking();
      if (order.status === ORDER_STATUS.marked_ready_for_delivery) {
         mapViewRef.current?.fitToSuppliedMarkers(['origin', 'destination', 'restaurant'], {
            edgePadding: {
               top: 20,
               right: 20,
               bottom: 20,
               left: 20
            }
         })
      }

      if (order.status === ORDER_STATUS.picked_up_by_driver) {
         mapViewRef.current?.fitToSuppliedMarkers(['origin', 'destination'])
      }
      if (order.status === ORDER_STATUS.accepted_by_driver) {
         mapViewRef.current?.fitToSuppliedMarkers(['origin', 'restaurant'])
      }
      bottomSheetRef.current?.present()

      return () => timeOut && clearTimeout(timeOut)
   }, [driverLocation, order, business?.coords])

   useEffect(() => {
      if (!order) {
         router.back()
      } else {
      }
   }, [order])

   // if (!API_KEY) return;

   if (loading) return <Loading />
   return (
      <View style={styles.container}>
         <MapHeader
            onCenterPress={() => {
               mapViewRef.current?.fitToSuppliedMarkers(['origin', 'restaurant', 'destination'], {
                  edgePadding: {
                     top: 30,
                     right: 30,
                     bottom: 50,
                     left: 30
                  }
               })
               bottomSheetRef.current?.present()
            }}
            onPress={() => {
               openGoogleMap()
            }}
         />
         {driverLocation && order.address?.coords && business?.coords && (
            <MapView
               style={[styles.map]}
               mapPadding={{
                  left: 40,
                  top: 50,
                  right: 40,
                  bottom: 20
               }}
               ref={mapViewRef}
               zoomEnabled
               zoomControlEnabled
               initialRegion={initialRegion}
               region={initialRegion}
               showsUserLocation
               userLocationPriority="high"
               userLocationUpdateInterval={5000}
               followsUserLocation
               zoomTapEnabled
               showsPointsOfInterest={false}
               showsBuildings={false}>
               {driverLocation && (
                  <Marker coordinate={{ ...driverLocation! }} title="Me" identifier="origin" />
               )}
               {business &&
                  (order.status === ORDER_STATUS.marked_ready_for_delivery ||
                     order.status === ORDER_STATUS.accepted_by_driver) && (
                     <Marker
                        coordinate={business.coords!}
                        title={business.name}
                        identifier="restaurant"
                     />
                  )}
               {order && order.address?.coords && (
                  <Marker
                     coordinate={order.address.coords}
                     title="Customer"
                     identifier="destination"
                  />
               )}

               {driverLocation &&
                  order &&
                  order.address.coords &&
                  restaurant &&
                  bottomSheetRef.current && (
                     <MapViewDirections
                        apikey={API_KEY}
                        mode={drivingMode}
                        origin={driverLocation}
                        destination={
                           order.status === ORDER_STATUS.marked_ready_for_delivery
                              ? order.address.coords
                              : order.status === ORDER_STATUS.accepted_by_driver
                                ? business?.coords
                                : order.address.coords
                        }
                        strokeWidth={3}
                        strokeColor={Colors.main}
                        onStart={(params) => {
                           console.log(
                              `Started routing between "${params.origin}" and "${params.destination}"`
                           )
                        }}
                        waypoints={waypoints}
                        onError={(err) => {
                           console.log('Error getting Directions', err)
                        }}
                        onReady={onMapChange}
                     />
                  )}
            </MapView>
         )}

         <Sheet
            ref={bottomSheetRef}
            index={0}
            snapPoints={snapshots}
            backdropComponent={() => null}
            backgroundStyle={{ backgroundColor: Colors.white }}
            style={{ borderRadius: SIZES.lg, overflow: 'hidden' }}
            handleStyle={{ backgroundColor: Colors.primary, width: '100%', height: 50 }}
            onChange={(change) => {
               if (change === 1) {
                  height.value = withTiming(0.55)
               } else if (change === 2) {
                  height.value = withTiming(0.55)
               } else if (change === 0) {
                  height.value = withTiming(0.2, { duration: 500 })
               }
            }}
            handleIndicatorStyle={{ backgroundColor: Colors.main }}>
            <ScrollView
               contentContainerStyle={{ backgroundColor: Colors.white, padding: SIZES.md }}>
               <Row align="evenly">
                  <ETA title={distance.toFixed(2)} subtitle="miles" />
                  <Text style={styles.eta}>ETA {orders.length}</Text>
                  <ETA title={duration.toFixed(2)} subtitle="mins" />
               </Row>
               <View style={{ marginTop: SIZES.md }}>
                  <Divider small />
               </View>
               <View style={{ marginTop: SIZES.lg }}>
                  <MapOrderDetails
                     order={order}
                     business={business!}
                     distance={DISTANCE / distance}
                  />
               </View>

               {order.deliveryInstructions && (
                  <View>
                     <Text
                        style={{
                           fontSize: 16,
                           fontWeight: '600',
                           color: 'grey',
                           marginVertical: SIZES.sm
                        }}>
                        Delivery Instuctions
                     </Text>
                     <Text>{order.deliveryInstructions}</Text>
                  </View>
               )}

               <View style={{ width: '60%', alignSelf: 'center', marginVertical: SIZES.lg * 2 }}>
                  <Button
                     contentContainerStyle={{ borderRadius: SIZES.lg * 3 }}
                     title={actionTitle(order.status)}
                     onPress={onActionPress}
                  />
               </View>
            </ScrollView>
         </Sheet>
         <OTP
            title="Delivery PIN"
            extraInfo={`Order # ${order.orderNumber}`}
            show={show}
            override={business?.otpOverride!}
            setShow={setShow}
            code={order.otpPickup!}
            lenght={4}
            callBack={() => {
               completeDelivery()
               setShow(false)
            }}
         />
      </View>
   )
}

export default Maps

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: Colors.primary
   },
   map: {
      flex: 1,
      ...StyleSheet.absoluteFillObject
   },
   eta: {
      fontSize: 22,
      fontFamily: 'Genos-Bold'
   }
})
