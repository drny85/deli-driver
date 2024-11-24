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
      backgroundColor: Colors.primary,
      borderRadius: 30,
      boxShadow: '-1px 5px 3px 0px rgba(184,171,184,0.53)'
   },
   bottomShadow: {
      shadowOffset: {
         width: 2,
         height: 6
      },
      boxShadow: '-1px 3px 3px 0px rgba(184,171,184,0.53)',
      borderRadius: 30,
      backgroundColor: Colors.accent
   }
})
