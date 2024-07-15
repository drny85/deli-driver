import { NativeStackNavigationOptions } from '@react-navigation/native-stack'
import { Colors } from './Colors'

export const StackScreenWithSearchBar: NativeStackNavigationOptions = {
   headerLargeTitle: true,
   headerLargeStyle: {
      backgroundColor: Colors.primary
   },
   headerLargeTitleStyle: {
      color: Colors.main
   },

   headerSearchBarOptions: {
      hintTextColor: Colors.secondary,
      tintColor: Colors.main,
      barTintColor: Colors.main
   },

   headerTintColor: Colors.main,
   headerTransparent: true,
   headerBlurEffect: 'prominent',
   headerShadowVisible: false
}
