import React from 'react';
import { Stack } from 'expo-router';
import { StackScreenWithSearchBar } from '@/constants/layout';
import SegmentedControlOrders from '@/components/SegmentedControlOrders';

const HomeLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
};

export default HomeLayout;
