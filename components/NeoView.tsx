import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import React from 'react'
import { Colors } from '@/constants/Colors'

type Props = {
   children: React.ReactNode
   size?: number
   rounded?: boolean
   containerStyle?: StyleProp<ViewStyle>
   outterContainerStyles?: StyleProp<ViewStyle>
}
const NeoView = ({
   children,
   containerStyle,
   size,
   outterContainerStyles,
   rounded = false
}: Props) => {
   return (
      <View style={[styles.topShadow, outterContainerStyles]}>
         <View style={[styles.bottomShadow, outterContainerStyles]}>
            <View
               style={[
                  styles.inner,
                  {
                     width: size ? size : undefined,
                     height: size ? size : undefined,
                     borderRadius: rounded && size ? size : undefined,
                     justifyContent: rounded ? 'center' : undefined,
                     alignItems: rounded ? 'center' : undefined
                  },
                  containerStyle
               ]}>
               {children}
            </View>
         </View>
      </View>
   )
}

export default NeoView

const styles = StyleSheet.create({
   inner: {
      backgroundColor: Colors.primary,
      borderColor: Colors.border,
      borderWidth: 0.8
   },
   topShadow: {
      shadowOffset: {
         width: -2,
         height: -4
      },
      shadowColor: 'lightgrey',
      backgroundColor: Colors.primary,
      shadowOpacity: 1,
      shadowRadius: 4
   },
   bottomShadow: {
      shadowOffset: {
         width: 2,
         height: 6
      },
      shadowColor: Colors.accent,
      backgroundColor: Colors.accent,
      shadowOpacity: 1,
      shadowRadius: 4
   }
})
