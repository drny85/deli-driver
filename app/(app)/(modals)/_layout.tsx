import { StackScreenWithSearchBar } from '@/constants/layout'
import { Feather } from '@expo/vector-icons'
import { router, Stack } from 'expo-router'
import { TouchableOpacity } from 'react-native'

const ModalsLayout = () => {
   return (
      <Stack>
         <Stack.Screen
            name="mydeliveries"
            options={{
               animation: 'slide_from_bottom',
               title: 'My Deliveries',
               ...StackScreenWithSearchBar,
               headerLargeTitle: false,
               headerLeft: ({ canGoBack, tintColor }) => (
                  <TouchableOpacity
                     onPress={() => {
                        if (canGoBack) {
                           router.back()
                        }
                     }}>
                     <Feather name="chevron-left" size={32} color={tintColor} />
                  </TouchableOpacity>
               )
            }}
         />
         <Stack.Screen name="delivery-details" options={{ title: '' }} />
      </Stack>
   )
}

export default ModalsLayout
