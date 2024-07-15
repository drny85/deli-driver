import { Colors, SIZES } from '@/constants/Colors'
import React from 'react'
import {
   StyleProp,
   StyleSheet,
   Text,
   TextInput,
   TextInputProps,
   View,
   ViewStyle
} from 'react-native'

type Props = TextInputProps & {
   title?: string
   error?: string
   containerStyle?: StyleProp<ViewStyle>
   RightIcon?: React.ReactNode
}
const Input = ({ error, title, RightIcon, containerStyle, ...props }: Props) => {
   return (
      <View style={{ width: '100%' }}>
         {title && <Text style={styles.title}>{title}</Text>}
         <View style={styles.innerView}>
            <TextInput style={[styles.input, containerStyle]} {...props} />
            {RightIcon && <View style={styles.rightIcon}>{RightIcon}</View>}
         </View>
         {error && <Text style={styles.error}>{error}</Text>}
      </View>
   )
}

export default Input

const styles = StyleSheet.create({
   input: {
      height: 46,
      borderWidth: 1,
      padding: 10,
      borderColor: Colors.main,
      borderRadius: SIZES.md,
      width: '100%',
      fontSize: 22,
      fontFamily: 'Genos'
   },
   title: {
      fontFamily: 'Genos-Bold',
      fontSize: 24,
      paddingLeft: SIZES.sm,
      textTransform: 'capitalize',
      paddingBottom: SIZES.sm * 0.5
   },

   error: {
      fontFamily: 'Genos',
      fontSize: 16,
      color: 'red',
      paddingLeft: SIZES.sm
   },
   rightIcon: {
      position: 'absolute',
      right: 16
   },
   innerView: {
      justifyContent: 'center'
   }
})
