import { Colors } from '@/constants/Colors'
import { forwardRef } from 'react'
import {
   StyleSheet,
   Text,
   TextStyle,
   TouchableOpacity,
   TouchableOpacityProps,
   ViewStyle
} from 'react-native'
import NeoView from './NeoView'

type ButtonProps = {
   onPress?: TouchableOpacityProps['onPress']
   title?: string
   contentContainerStyle?: ViewStyle
   contentTextStyle?: TextStyle
} & TouchableOpacityProps

export const Button = forwardRef<any, ButtonProps>(
   ({ onPress, title, contentContainerStyle, contentTextStyle }, ref) => {
      return (
         <NeoView
            outterContainerStyles={contentContainerStyle}
            containerStyle={[
               { borderRadius: styles.button.borderRadius, backgroundColor: '#ffffff' }
            ]}>
            <TouchableOpacity
               ref={ref}
               style={[styles.button, contentContainerStyle]}
               onPress={onPress}>
               <Text style={[styles.buttonText, contentTextStyle]}>{title}</Text>
            </TouchableOpacity>
         </NeoView>
      )
   }
)

const styles = StyleSheet.create({
   button: {
      alignItems: 'center',
      backgroundColor: Colors.main,
      borderRadius: 30,
      elevation: 5,
      flexDirection: 'row',
      justifyContent: 'center',
      padding: 16,
      shadowColor: 'rbga(0,0,0,0.7)',
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
