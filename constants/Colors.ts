import { Dimensions } from 'react-native'
import Constants from 'expo-constants'
const { width, height } = Dimensions.get('window')

export const Colors = {
   primary: '#FBFFFF',
   secondary: '#DEE9F7',
   accent: '#B7C4DD',
   border: '#E2ECFD',
   main: '#7b2cbf',
   white: '#ffffff'
}

export const SIZES = {
   sm: 10,
   md: 16,
   lg: 22,
   width,
   height,
   statusBarHeight: Constants.statusBarHeight
}
