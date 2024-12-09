import { TabBarIcon } from '@/components/TabBarIcon'
import { Colors } from '@/constants/Colors'
import { useOrders } from '@/hooks/useOrders'
import { useUser } from '@/hooks/useUser'
import { useUserListener } from '@/hooks/useUserListener'
import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import { Tabs } from 'expo-router'

export default function TabLayout() {
   useUserListener()
   const { loading } = useUser()

   useOrders()
   // useDriverLocation(user?.id!, (location) => {
   //    if (location) {
   //       console.log('Location Updated', location)
   //       updateDriverLocationInFirestore(user?.id!, location)
   //    } else {
   //       console.log('Location Not Updated')
   //    }
   // })
   if (loading) return null

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
         }}>
         <Tabs.Screen
            name="index"
            options={{
               title: 'Home',
               headerShown: false,
               tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />
            }}
         />
         <Tabs.Screen
            name="deliveries"
            options={{
               title: 'Deliveries',

               tabBarIcon: ({ color, size }) => (
                  <MaterialIcons name="delivery-dining" size={size} color={color} />
               )
            }}
         />
         <Tabs.Screen
            name="restaurants"
            options={{
               title: 'Businesses',
               tabBarIcon: ({ color, size }) => (
                  <Ionicons name="restaurant-outline" size={size} color={color} />
               )
            }}
         />
         <Tabs.Screen
            name="settings"
            options={{
               title: 'Settings',
               headerShown: false,
               tabBarIcon: ({ color }) => <TabBarIcon name="gears" color={color} />
            }}
         />
      </Tabs>
   )
}
