// EarningsScreen.tsx
import React, { useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import SegmentedControl from '@react-native-segmented-control/segmented-control'

import { addDays, format, startOfWeek, startOfMonth } from 'date-fns'
import DailyEarnings from './DailyEarnings'

import { Order } from '@/typing'
import { calculateEarnings } from '@/utils/calculateEarningByDays'
import EarningsChart from './EarningsChart'

type Props = {
   orders: Order[]
}
const EarningsScreen: React.FC<Props> = ({ orders }) => {
   const [selectedIndex, setSelectedIndex] = useState<number>(0)

   const filterOrders = (orders: Order[], filter: string) => {
      const now = new Date()
      let filteredOrders = orders

      if (filter === 'Day') {
         filteredOrders = orders.filter(
            (order) => format(new Date(order.orderDate), 'yyyy-MM-dd') === format(now, 'yyyy-MM-dd')
         )
      } else if (filter === 'Week') {
         const startOfWeekDate = startOfWeek(now)
         filteredOrders = orders.filter(
            (order) =>
               new Date(order.orderDate) >= startOfWeekDate &&
               new Date(order.orderDate) <= addDays(startOfWeekDate, 6)
         )
      } else if (filter === 'Month') {
         const startOfMonthDate = startOfMonth(now)
         filteredOrders = orders.filter((order) => new Date(order.orderDate) >= startOfMonthDate)
      }

      return filteredOrders
   }

   const segments = ['Day', 'Week', 'Month']
   const filter = segments[selectedIndex]
   const filteredOrders = filterOrders(orders, segments[selectedIndex])
   const earningsData = calculateEarnings(filteredOrders, filter)

   return (
      <View style={styles.container}>
         <EarningsChart data={earningsData} />
         <SegmentedControl
            values={segments}
            selectedIndex={selectedIndex}
            onChange={(event) => setSelectedIndex(event.nativeEvent.selectedSegmentIndex)}
            style={styles.segmentedControl}
         />
         <ScrollView style={styles.scrollView}>
            {earningsData.map((earnings, index) => (
               <DailyEarnings key={index} day={earnings.day} totalTips={earnings.totalTips} />
            ))}
         </ScrollView>
      </View>
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      padding: 16
   },
   segmentedControl: {
      marginBottom: 16
   },
   scrollView: {
      flex: 1
   }
})

export default EarningsScreen
