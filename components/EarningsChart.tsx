import { Colors, SIZES } from '@/constants/Colors'
import { EarningsData } from '@/typing'
import { StyleSheet, View } from 'react-native'
import { LineChart } from 'react-native-gifted-charts'
import NeoView from './NeoView'

interface EarningsChartProps {
   data: EarningsData[]
}

const EarningsChart: React.FC<EarningsChartProps> = ({ data }) => {
   const chartData = data.map((item, index) => ({
      value: item.totalTips
   }))

   if (chartData.length === 0) return null

   return (
      <NeoView
         outterContainerStyles={{ borderRadius: SIZES.md }}
         containerStyle={{ borderRadius: SIZES.md }}>
         <View style={styles.container}>
            <LineChart
               areaChart
               curved
               yAxisLabelPrefix="$"
               data={chartData}
               adjustToWidth
               width={SIZES.width * 0.7}
               spacing={30}
               //width={SIZES.width * 0.9}
               startFillColor={Colors.main}
               startOpacity={0.8}
               yAxisTextStyle={{
                  color: 'grey',
                  fontSize: 12
               }}
               verticalLinesColor={'grey'}
               thickness={2}
               xAxisColor={Colors.accent}
               initialSpacing={10}
               height={SIZES.height * 0.2}
               endFillColor={Colors.accent}
               endOpacity={0.3}
            />
         </View>
      </NeoView>
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
