import { Redirect, Tabs } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { TabBarIcon } from '../../components/TabBarIcon';
import { useAuth } from '@/providers/authProvider';
import { useUser } from '@/hooks/useUser';

export default function TabLayout() {
  const { loading: LoadingUer } = useUser();
  const { user, loading } = useAuth();
  console.log('TABS', user?.email);
  if (loading || LoadingUer) return null;

  if (!user || !user.isActive) {
    return <Redirect href={'/(auth)/login'} />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.main,

        tabBarStyle: {
          backgroundColor: Colors.primary,
        },
        headerStyle: {
          backgroundColor: Colors.primary,
        },
      }}
      initialRouteName="(home)">
      <Tabs.Screen
        name="(home)"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="(delivery)"
        options={{
          title: 'Deliveries',
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
        }}
      />
      <Tabs.Screen
        name="(restaurants)"
        options={{
          title: 'Restaurants',
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
        }}
      />
      <Tabs.Screen
        name="(settings)"
        options={{
          title: 'Settings',
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="gears" color={color} />,
        }}
      />
    </Tabs>
  );
}
