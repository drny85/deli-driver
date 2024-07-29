import { Colors } from '@/constants/Colors'
import { EarningsData } from '@/utils/calculateEarningByDays'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import { LineChart } from 'react-native-gifted-charts'

interface EarningsChartProps {
   data: EarningsData[]
}

const EarningsChart: React.FC<EarningsChartProps> = ({ data }) => {
   const chartData = data.map((item, index) => ({
      value: item.totalTips
   }))

   return (
      <View style={styles.container}>
         <LineChart
            areaChart
            curved
            yAxisLabelPrefix="$"
            data={chartData}
            adjustToWidth
            startFillColor={Colors.main}
            startOpacity={0.8}
            endFillColor={Colors.accent}
            endOpacity={0.3}
         />
      </View>
   )
}

const styles = StyleSheet.create({
   container: {
      alignItems: 'center',
      marginTop: 20,
      width: '100%'
   }
})

export default EarningsChart
