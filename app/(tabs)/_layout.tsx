import { Tabs } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { TabBarIcon } from '../../components/TabBarIcon';

export default function TabLayout() {
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
    </Tabs>
  );
}
