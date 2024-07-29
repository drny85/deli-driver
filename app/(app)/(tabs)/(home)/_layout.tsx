import OnlineToggleButton from '@/components/OnlineToggleButton'
import TodayEarningButton from '@/components/TodayEarningButton'
import { Colors } from '@/constants/Colors'
import { useBackgroundLocation } from '@/hooks/useLocation'
import { Stack } from 'expo-router'

const HomeLayout = () => {
   // console.log('backgroundPermission', backgroundPermission?.granted)
   useBackgroundLocation()
   // if (!backgroundPermission?.granted) return <Redirect href={'/notlocation'} />

   return (
      <Stack>
         <Stack.Screen
            name="index"
            options={{
               headerShadowVisible: false,
               headerTitle: () => <TodayEarningButton />,
               headerStyle: {
                  backgroundColor: Colors.primary
               },

               headerRight: () => <OnlineToggleButton />
            }}
         />
      </Stack>
   )
}

export default HomeLayout
