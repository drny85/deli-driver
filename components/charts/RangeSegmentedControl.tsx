import { View, StyleSheet } from 'react-native'
import SegmentedControl from '@react-native-segmented-control/segmented-control'
import { Colors } from '@/constants/Colors'

type Range = 'today' | 'wtd' | 'mtd' | 'all'

interface SegmentedControlProps {
   selectedRange: Range
   onChange: (range: Range) => void
}

const RangeSegmentedControl: React.FC<SegmentedControlProps> = ({ selectedRange, onChange }) => {
   const segments = ['Today', 'WTD', 'MTD', 'All']

   return (
      <View style={styles.container}>
         <SegmentedControl
            values={segments}
            selectedIndex={segments.indexOf(
               selectedRange[0].toUpperCase() + selectedRange.slice(1)
            )}
            onChange={(event) => {
               const index = event.nativeEvent.selectedSegmentIndex
               const newRange = segments[index].toLowerCase() as Range
               onChange(newRange)
            }}
            activeFontStyle={{
               fontSize: 18,
               color: Colors.main
            }}
            tintColor="white"
            style={styles.segmentedControl}
         />
      </View>
   )
}

const styles = StyleSheet.create({
   container: {
      height: 40,
      width: '100%',
      margin: 10
   },
   segmentedControl: {
      height: '100%',
      width: '100%'
   }
})

export default RangeSegmentedControl
