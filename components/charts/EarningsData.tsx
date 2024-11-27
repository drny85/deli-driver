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
            <PieChart
               data={chartData}
               donut
               innerRadius={SIZE}
               radius={SIZE * 2}
               sectionAutoFocus
               extraRadiusForFocused={SIZES.sm}
               centerLabelComponent={() => (
                  <View style={styles.totalView}>
                     <Text style={[styles.centerLabel, { fontWeight: 'condensed' }]}>Total</Text>
                     <Text style={[styles.centerLabel, { fontSize: 26 }]}>${total.toFixed(2)}</Text>
                  </View>
               )}
            />

            <Animated.View style={[styles.legendContainer]}>
               {chartData.map((item, index) => (
                  <Animated.View key={index} style={[styles.legendItem, animatedStyle]}>
                     {renderDot(item.color)}
                     <Row containerStyle={{ gap: 4 }}>
                        <Text style={[styles.centerLabel, { fontWeight: '500' }]}>
                           {item.text}:
                        </Text>
                        <Text style={styles.centerLabel}>${item.value.toFixed(2)}</Text>
                     </Row>
                  </Animated.View>
               ))}
            </Animated.View>
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
      justifyContent: 'space-around',
      alignItems: 'center',
      width: '100%',
      paddingHorizontal: 16
   },
   legendItem: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: 4
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
