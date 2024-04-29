import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { Colors } from './Colors';

export const StackScreenWithSearchBar: NativeStackNavigationOptions = {
  headerLargeTitle: true,
  headerLargeStyle: {
    backgroundColor: Colors.main,
  },
  headerLargeTitleStyle: {
    color: Colors.white,
  },

  headerSearchBarOptions: {
    hintTextColor: Colors.secondary,
    tintColor: Colors.white,
    barTintColor: Colors.main,
    textColor: 'red',
  },

  headerTintColor: Colors.main,
  headerTransparent: true,
  headerBlurEffect: 'prominent',
  headerShadowVisible: false,
};
