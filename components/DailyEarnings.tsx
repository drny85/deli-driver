import { Colors } from '@/constants/Colors'
import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

interface EarningsProps {
   day: string
   totalTips: number
}

const DailyEarnings: React.FC<EarningsProps> = ({ day, totalTips }) => {
   return (
      <View style={styles.container}>
         <Text style={styles.dayLabel}>{day}</Text>
         <Text style={styles.tipsLabel}>${totalTips.toFixed(2)}</Text>
      </View>
   )
}

const styles = StyleSheet.create({
   container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 16,
      marginVertical: 8,
      backgroundColor: Colors.secondary,
      borderRadius: 8,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 8,
      elevation: 4
   },
   dayLabel: {
      fontSize: 16,
      fontWeight: 'bold'
   },
   tipsLabel: {
      fontSize: 16,
      color: Colors.main,
      fontWeight: 'bold'
   }
})

export default DailyEarnings
