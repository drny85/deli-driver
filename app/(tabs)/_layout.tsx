import { Redirect, Tabs } from 'expo-router'
import { Colors } from '@/constants/Colors'
import { TabBarIcon } from '../../components/TabBarIcon'
import { useUser } from '@/hooks/useUser'
import { useBackgroundLocation } from '@/hooks/useLocation'
import { Ionicons, MaterialIcons } from '@expo/vector-icons'

export default function TabLayout() {
   const { loading, user } = useUser()
   if (loading) return null

   if (!user || !user.isActive) {
      return <Redirect href={'/(auth)/login'} />
   }

   return (
      <Tabs
         screenOptions={{
            tabBarActiveTintColor: Colors.main,

            tabBarStyle: {
               backgroundColor: Colors.primary
            },
            headerStyle: {
               backgroundColor: Colors.primary
            }
         }}
         initialRouteName="(home)">
         <Tabs.Screen
            name="(home)"
            options={{
               title: 'Home',
               headerShown: false,
               tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />
            }}
         />
         <Tabs.Screen
            name="(delivery)"
            options={{
               title: 'Deliveries',
               tabBarIcon: ({ color, size }) => (
                  <MaterialIcons name="delivery-dining" size={size} color={color} />
               )
            }}
         />
         <Tabs.Screen
            name="(restaurants)"
            options={{
               title: 'Restaurants',
               headerShown: false,
               tabBarIcon: ({ color, size }) => (
                  <Ionicons name="restaurant-outline" size={size} color={color} />
               )
            }}
         />
         <Tabs.Screen
            name="(settings)"
            options={{
               title: 'Settings',
               headerShown: false,
               tabBarIcon: ({ color }) => <TabBarIcon name="gears" color={color} />
            }}
         />
      </Tabs>
   )
}
