import { Colors } from '@/constants/Colors'
import { forwardRef } from 'react'
import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps, ViewStyle } from 'react-native'
import NeoView from './NeoView'

type ButtonProps = {
   onPress?: TouchableOpacityProps['onPress']
   title?: string
   contentContainerStyle?: ViewStyle
} & TouchableOpacityProps

export const Button = forwardRef<TouchableOpacity, ButtonProps>(
   ({ onPress, title, contentContainerStyle }, ref) => {
      return (
         <NeoView containerStyle={[{ borderRadius: styles.button.borderRadius }]}>
            <TouchableOpacity
               ref={ref}
               style={[styles.button, contentContainerStyle]}
               onPress={onPress}>
               <Text style={styles.buttonText}>{title}</Text>
            </TouchableOpacity>
         </NeoView>
      )
   }
)

const styles = StyleSheet.create({
   button: {
      alignItems: 'center',
      backgroundColor: Colors.main,
      borderRadius: 24,
      elevation: 5,
      flexDirection: 'row',
      justifyContent: 'center',
      padding: 16,
      shadowColor: '#000',
      shadowOffset: {
         height: 2,
         width: 0
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84
   },
   buttonText: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: '700',
      textAlign: 'center'
   }
})
