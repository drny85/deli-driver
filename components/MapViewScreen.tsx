import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

import MapView, { MapViewProps } from 'react-native-maps'
import { Colors } from '@/constants/Colors'

type Props = MapViewProps & {}

const MapViewScreen = ({ ...props }: Props) => {
   return (
      <View style={styles.container} {...props}>
         <MapView style={styles.map} />
      </View>
   )
}

export default MapViewScreen

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: Colors.primary
   },
   map: {
      flex: 1,
      ...StyleSheet.absoluteFillObject
   }
})
