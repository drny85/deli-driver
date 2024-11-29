import { SIZES } from '@/constants/Colors'
import { Order, Range } from '@/typing'
import { transformDataForPieChart } from '@/utils/charts/filterDataByDate'

import React, { useEffect, useState } from 'react'
import { ColorValue, StyleSheet, Text, View } from 'react-native'
import { PieChart } from 'react-native-gifted-charts'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import Row from '../Row'
import RangeSegmentedControl from './RangeSegmentedControl'

const SIZE = SIZES.width / 6

const EarningsData = ({ orders }: { orders: Order[] }) => {
   const width = useSharedValue(48)
   const [range, setRange] = useState<Range>('all')

   const chartData = transformDataForPieChart(orders, range)

   const total = chartData.reduce((acc, item) => acc + item.value, 0)

   const renderDot = (color: ColorValue) => {
      return <View style={[styles.dot, { backgroundColor: color }]} />
   }

   const animatedStyle = useAnimatedStyle(() => {
      return {
         width: `${width.value}%`
      }
   })

   useEffect(() => {
      if (chartData.length > 1) {
         width.value = withTiming(48, { duration: 500 })
      } else {
         width.value = withTiming(100, { duration: 500 })
      }
   }, [chartData.length])

   return (
      <View style={styles.container}>
         <Text style={styles.title}>Earnings</Text>

         <View
            style={{
               flex: 1,
               justifyContent: 'center',
               width: '100%',
               alignItems: 'center',
               gap: SIZES.md
            }}>
            {chartData.length === 0 && <Text style={styles.centerLabel}>No data available</Text>}

            <PieChart
               data={chartData}
               donut
               innerRadius={SIZE}
               radius={SIZE * 2}
               sectionAutoFocus
               showText={range !== 'all'}
               textColor="#212121"
               textSize={13}
               showGradient
               centerLabelComponent={() => (
                  <View style={styles.totalView}>
                     <Text style={[styles.centerLabel, { fontWeight: 'condensed' }]}>Total</Text>
                     <Text style={[styles.centerLabel, { fontSize: 26 }]}>${total.toFixed(2)}</Text>
                  </View>
               )}
            />

            <View
               style={{
                  backgroundColor: 'white',
                  width: '100%',
                  borderRadius: SIZES.sm,
                  padding: SIZES.sm,
                  boxShadow: chartData.length > 0 ? '-3px -2px 8px rgba(0, 0, 0, 0.2)' : undefined
               }}>
               <Animated.View style={[styles.legendContainer]}>
                  {chartData.map((item, index) => (
                     <Animated.View key={index} style={[styles.legendItem, animatedStyle]}>
                        {renderDot(item.color)}
                        <Row containerStyle={{ gap: 4 }}>
                           <Text
                              adjustsFontSizeToFit
                              style={[styles.centerLabel, { fontWeight: '500' }]}>
                              {item.text}:
                           </Text>
                           <Text adjustsFontSizeToFit style={styles.centerLabel}>
                              ${item.value.toFixed(2)}
                           </Text>
                        </Row>
                     </Animated.View>
                  ))}
               </Animated.View>
            </View>
         </View>

         <RangeSegmentedControl selectedRange={range} onChange={setRange} />
      </View>
   )
}

export default EarningsData

const styles = StyleSheet.create({
   container: {
      flex: 1,
      padding: 16,
      justifyContent: 'center',
      alignItems: 'center'
   },
   legendContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      paddingTop: 10,
      width: '100%',

      paddingHorizontal: 16
   },
   legendItem: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      marginVertical: 4,
      marginHorizontal: 2
   },
   dot: {
      height: 10,
      width: 10,
      borderRadius: 5,
      marginRight: 8
   },
   totalView: {
      justifyContent: 'center',
      alignItems: 'center',
      gap: SIZES.sm
   },

   title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 16
   },
   buttonsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: 16
   },
   centerLabel: {
      fontSize: 16,
      fontWeight: 'bold'
   }
})