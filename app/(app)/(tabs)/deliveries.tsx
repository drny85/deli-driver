import { updateCourier } from '@/actions/user/createCourier'

import GoOnline from '@/components/GoOnline'
import Loading from '@/components/Loading'
import NeoView from '@/components/NeoView'
import OrderListItem from '@/components/OrderListItem'
import { Colors, SIZES } from '@/constants/Colors'
import { useUser } from '@/hooks/useUser'
import { useOrdersStore } from '@/providers/ordersStore'
import { Order, ORDER_STATUS } from '@/typing'

import { FontAwesome } from '@expo/vector-icons'
import SegmentedControl from '@react-native-segmented-control/segmented-control'
import { router, Stack, useLocalSearchParams } from 'expo-router'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Alert, FlatList, ListRenderItem, Text, TouchableOpacity, View } from 'react-native'

const ORDER_OPTIONS = ['New', 'Pending', 'Current']

type PropsParams = {
   index: string
}

const Deliveries = () => {
   const { orders: data } = useOrdersStore()
   const { index } = useLocalSearchParams<PropsParams>()

   const [option, setOption] = useState(0)

   const in_progress = data.filter((o) => o.status === ORDER_STATUS.picked_up_by_driver)

   const ordersToRender = useMemo(() => {
      const orders = data.filter((o) => o.status !== ORDER_STATUS.delivered)
      if (option === 0)
         return orders.filter((o) => o.status === ORDER_STATUS.marked_ready_for_delivery)
      if (option === 1) return orders.filter((o) => o.status === ORDER_STATUS.accepted_by_driver)
      if (option === 2) return orders.filter((o) => o.status === ORDER_STATUS.picked_up_by_driver)
      return orders
   }, [option, data])

   // console.log(JSON.stringify(ordersToRender, null, 2));

   const renderOrders: ListRenderItem<Order> = ({ item }) => {
      const disabled = data.some((o) => o.status === ORDER_STATUS.picked_up_by_driver)

      return (
         <OrderListItem
            item={item}
            onPress={() => {
               if (disabled && item.status !== ORDER_STATUS.picked_up_by_driver) {
                  Alert.alert('Current Order', 'You must deliver the current order first', [
                     { onPress: () => setOption(2) }
                  ])
                  return
               }
               router.push({ pathname: '/maps', params: { orderId: item.id! } })
            }}
         />
      )
   }

   useEffect(() => {
      if (index) {
         setOption(Number(index))
      }
   }, [index])

   // return <OrderProgress status="Accepted By Courier" />;

   // if (!user?.isOnline) {
   //    return <GoOnline onPress={onOnlinePress} />
   // }

   return (
      <View style={{ flex: 1, backgroundColor: Colors.primary }}>
         <Stack.Screen
            options={{
               title: 'Deliveries',
               headerStyle: {
                  backgroundColor: Colors.primary
               },
               headerShadowVisible: false,
               headerRight: () => {
                  return (
                     <TouchableOpacity
                        onPress={() => router.push('/mydeliveries')}
                        style={{ marginRight: SIZES.md }}>
                        <Text style={{ fontWeight: 600, fontSize: 18, color: Colors.main }}>
                           All
                        </Text>
                     </TouchableOpacity>
                  )
               }
            }}
         />
         <View style={{ flex: 1, paddingHorizontal: SIZES.md }}>
            <View style={{ width: '100%', height: 40 }}>
               <SegmentedControl
                  values={ORDER_OPTIONS}
                  onChange={(event) => {
                     setOption(event.nativeEvent.selectedSegmentIndex)
                  }}
                  selectedIndex={option}
                  tintColor={Colors.main}
                  fontStyle={{ fontSize: 16 }}
                  activeFontStyle={{ color: '#ffffff', fontWeight: '700', fontSize: 18 }}
                  style={{ height: 40 }}
               />
            </View>
            <FlatList
               scrollEnabled={false}
               data={ordersToRender}
               renderItem={renderOrders}
               ListEmptyComponent={() => (
                  <View style={{ marginTop: 60 }}>
                     <Text style={{ textAlign: 'center', fontSize: 22 }}>No Deliveries</Text>
                  </View>
               )}
               contentContainerStyle={{ gap: SIZES.md, marginTop: SIZES.md }}
            />
         </View>
         <View
            style={{
               position: 'absolute',
               bottom: 10,
               right: 10,
               gap: SIZES.md,
               zIndex: 20
            }}>
            {in_progress.length > 0 && (
               <TouchableOpacity
                  onPress={() =>
                     router.push({ pathname: '/maps', params: { orderId: in_progress[0].id } })
                  }>
                  <NeoView rounded size={50} containerStyle={{ backgroundColor: Colors.secondary }}>
                     <FontAwesome name="location-arrow" size={28} color={Colors.main} />
                  </NeoView>
               </TouchableOpacity>
            )}
            {in_progress.length === 0 && (
               <TouchableOpacity onPress={() => router.push('/nextOrder')}>
                  <NeoView rounded size={50} containerStyle={{ backgroundColor: Colors.secondary }}>
                     <FontAwesome name="list-ol" size={28} color={Colors.main} />
                  </NeoView>
               </TouchableOpacity>
            )}
         </View>
      </View>
   )
}

export default Deliveries
