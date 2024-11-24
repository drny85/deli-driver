import { TabBarIcon } from '@/components/TabBarIcon'
import { Colors } from '@/constants/Colors'
import { useOrders } from '@/hooks/useOrders'
import { useUser } from '@/hooks/useUser'
import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import { Redirect, Tabs } from 'expo-router'

export default function TabLayout() {
   const { loading, user } = useUser()
   useOrders()
   if (loading) return null

   if (!user || !user.isActive) {
      return <Redirect href={'/login'} />
   }

   // if (!user && backgroundPermission?.granted) return <Redirect href={'/(auth)/login'} />
   // if (user && !backgroundPermission?.granted) return <Redirect href={'/notlocation'} />

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
