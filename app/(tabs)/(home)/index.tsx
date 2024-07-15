import { updateCourier } from '@/actions/user/createCourier'

import { Container } from '@/components/Container'
import GoOnline from '@/components/GoOnline'
import Loading from '@/components/Loading'
import NeoView from '@/components/NeoView'
import Row from '@/components/Row'
import { Colors, SIZES } from '@/constants/Colors'
import { useBackgroundLocation } from '@/hooks/useLocation'
import { useOrders } from '@/hooks/useOrders'
import { useUser } from '@/hooks/useUser'
import { useOrdersStore } from '@/providers/ordersStore'
import { Order, ORDER_STATUS } from '@/typing'
import { dayjsFormat } from '@/utils/dayjs'

import { FontAwesome } from '@expo/vector-icons'
import SegmentedControl from '@react-native-segmented-control/segmented-control'
import { router, Stack } from 'expo-router'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Alert, FlatList, ListRenderItem, Text, TouchableOpacity, View, Button } from 'react-native'
import { useSharedValue, withTiming } from 'react-native-reanimated'

const ORDER_OPTIONS = ['New Orders', 'Pending', 'Current']

const Home = () => {
   const { config } = useBackgroundLocation()
   const end = useSharedValue(0)
   const { user, loading } = useUser()
   const { orders, setOrders } = useOrdersStore()
   const { loading: loadingOrders } = useOrders()

   const [option, setOption] = useState(0)

   const onOnlinePress = useCallback(async () => {
      if (!user) return
      try {
         console.log('Going')
         end.value === withTiming(1, { duration: 600 })

         // TIME_OUT = setTimeout(() => {
         updateCourier({ ...user, isOnline: true })
         // }, 1000);
      } catch (error) {
         console.log(error)
      }
   }, [user])

   const ordersToRender = useMemo(() => {
      if (option === 0)
         return orders.filter((o) => o.status === ORDER_STATUS.marked_ready_for_delivery)
      if (option === 1) return orders.filter((o) => o.status === ORDER_STATUS.accepted_by_driver)
      if (option === 2) return orders.filter((o) => o.status === ORDER_STATUS.picked_up_by_driver)
      return orders
   }, [option, orders])

   // console.log(JSON.stringify(ordersToRender, null, 2));

   const renderOrders: ListRenderItem<Order> = ({ item }) => {
      const disabled = orders.some((o) => o.status === ORDER_STATUS.picked_up_by_driver)

      return (
         <TouchableOpacity
            style={{ borderRadius: SIZES.sm, backgroundColor: Colors.primary }}
            onPress={() => {
               if (disabled && item.status !== ORDER_STATUS.picked_up_by_driver) {
                  Alert.alert('Current Order', 'You must deliver the current order first', [
                     { onPress: () => setOption(2) }
                  ])
                  return
               }
               router.push({ pathname: '/(maps)/maps', params: { orderId: item.id! } })
            }}>
            <NeoView
               containerStyle={{
                  padding: SIZES.sm,
                  borderRadius: SIZES.sm,
                  backgroundColor:
                     item.status === ORDER_STATUS.picked_up_by_driver
                        ? Colors.accent
                        : Colors.primary
               }}>
               <Row align="between">
                  <View style={{ gap: SIZES.sm }}>
                     <Row align="between" containerStyle={{ width: '90%' }}>
                        <Text style={{ fontSize: 24, fontFamily: 'Genos-Bold' }}>
                           Order # {item.orderNumber}
                        </Text>
                        <Text>{dayjsFormat(item.orderDate).format('lll')}</Text>
                     </Row>
                     <Text>{item.address?.street.slice(0, -7)}</Text>
                  </View>
                  <FontAwesome name="chevron-right" size={22} color={Colors.main} />
               </Row>
            </NeoView>
         </TouchableOpacity>
      )
   }

   useEffect(() => {
      // const gt = async () => {
      //   const or = await sortOrderByDistance(orders);
      //   setOrders(or);
      // };
      // gt();
      // startLocationTracking();
   }, [])

   // return <OrderProgress status="Accepted By Courier" />;

   if (loading || loadingOrders) return <Loading />

   if (!user?.isOnline) {
      return <GoOnline onPress={onOnlinePress} end={end} />
   }

   return (
      <View style={{ flex: 1, backgroundColor: Colors.primary }}>
         <Stack.Screen
            options={{
               title: 'Orders',
               headerStyle: {
                  backgroundColor: Colors.primary
               },
               headerShadowVisible: false,
               headerRight:
                  ordersToRender.length > 0
                     ? () => {
                          return (
                             <TouchableOpacity
                                style={{ padding: SIZES.sm }}
                                onPress={() => router.push('/(maps)/nextOrder')}>
                                <FontAwesome name="filter" size={24} />
                             </TouchableOpacity>
                          )
                       }
                     : undefined,
               headerTitle: (props) => {
                  return (
                     <View {...props} style={{ width: '86%' }}>
                        <SegmentedControl
                           values={ORDER_OPTIONS}
                           onChange={(event) => {
                              setOption(event.nativeEvent.selectedSegmentIndex)
                           }}
                           selectedIndex={option}
                           tintColor={Colors.main}
                           activeFontStyle={{ color: '#ffffff', fontWeight: '700' }}
                           style={{ height: 38 }}
                        />
                     </View>
                  )
               }
            }}
         />
         <View style={{ flex: 1, paddingHorizontal: SIZES.md }}>
            <FlatList
               scrollEnabled={false}
               data={ordersToRender}
               renderItem={renderOrders}
               ListEmptyComponent={() => (
                  <View style={{ marginTop: 60 }}>
                     <Text style={{ textAlign: 'center', fontSize: 22 }}>No orders</Text>
                  </View>
               )}
               contentContainerStyle={{ gap: SIZES.md }}
            />
         </View>
      </View>
   )
}

export default Home
