import {
   View,
   Text,
   TouchableOpacity,
   FlatList,
   ListRenderItem,
   StyleSheet,
   ScrollView
} from 'react-native'
import React, { useMemo, useState } from 'react'
import { useOrdersStore } from '@/providers/ordersStore'
import { Order } from '@/typing'
import SegmentedControl from '@react-native-segmented-control/segmented-control'
import { Colors, SIZES } from '@/constants/Colors'
import { format } from 'date-fns'
import { useNavigationSearch } from '@/hooks/useNavigationSeach'
import { router } from 'expo-router'

const OPTIONS = ['WTD', 'MTD', 'ALL']

const MyDeliveries = () => {
   const [selectedIndex, setSelectedIndex] = useState(0)
   const orders = useOrdersStore((s) =>
      s.orders.filter((order) => order.status === 'delivered')
   ).sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
   const search = useNavigationSearch({
      searchBarOptions: {
         placeholder: "Search by address, customer's mane"
      }
   })
   const data = useMemo(() => {
      if (!orders) return []
      if (search)
         return orders.filter(
            (o) =>
               o.address?.street.includes(search) ||
               o.contactPerson.name.toLowerCase().includes(search.toLowerCase())
         )
      if (selectedIndex === 0) {
         return orders?.filter(
            (o) => new Date(o.orderDate).getTime() > new Date().getTime() - 7 * 24 * 60 * 60 * 1000
         )
      } else if (selectedIndex === 1) {
         return orders?.filter(
            (o) => new Date(o.orderDate).getTime() > new Date().getTime() - 30 * 24 * 60 * 60 * 1000
         )
      } else {
         return orders
      }
   }, [orders])
   const total =
      useMemo(() => {
         return data.reduce((acc, order) => acc + order.tip?.amount!, 0)
      }, [data]) || 0

   const renderOrders: ListRenderItem<Order> = ({ item }) => (
      <TouchableOpacity
         style={styles.order}
         onPress={() => router.push(`/delivery-details?id=${item.id}`)}>
         <View style={styles.orderContainer}>
            <Text>Order Date: {format(item.orderDate, 'PPpp')}</Text>
            <Text>Tips Amount: ${item.tip?.amount.toFixed(2)}</Text>
         </View>
      </TouchableOpacity>
   )
   return (
      <ScrollView contentInsetAdjustmentBehavior="automatic">
         {/* SEGMENTED CONTROL */}
         <SegmentedControl
            values={OPTIONS}
            selectedIndex={selectedIndex}
            onChange={(event) => {
               setSelectedIndex(event.nativeEvent.selectedSegmentIndex)
            }}
            tintColor={Colors.main}
            activeFontStyle={{ color: 'white', fontWeight: '700' }}
            style={{ marginVertical: SIZES.sm, height: 42, marginHorizontal: SIZES.lg }}
         />
         <Text
            style={{
               fontSize: 22,
               fontWeight: '700',
               textAlign: 'center',
               marginBottom: SIZES.sm
            }}>
            {OPTIONS[selectedIndex]} Total: ${total.toFixed(2)}
         </Text>
         <FlatList
            scrollEnabled={false}
            data={data}
            renderItem={renderOrders}
            ListEmptyComponent={() => (
               <View style={{ padding: 20, marginTop: 30 }}>
                  <Text style={{ textAlign: 'center', fontSize: 18 }}>No Deliveries</Text>
               </View>
            )}
            keyExtractor={({ id }) => id!}
         />
      </ScrollView>
   )
}

export default MyDeliveries

const styles = StyleSheet.create({
   order: {
      padding: SIZES.lg,
      backgroundColor: Colors.white,
      borderRadius: SIZES.md,
      marginBottom: SIZES.sm,
      boxShadow: '3px 3px 5px rgba(0,0,0,0.2)'
   },
   orderContainer: {
      gap: SIZES.sm
   }
})
