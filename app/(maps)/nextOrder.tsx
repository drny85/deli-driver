import { View, Text } from 'react-native';
import React, { useCallback, useEffect } from 'react';
import { Container } from '@/components/Container';
import { Button } from '@/components/Button';
import { useOrdersStore } from '@/providers/ordersStore';
import { findUndeliveredOrder } from '@/utils/getNextClosestOrder';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import { SIZES } from '@/constants/Colors';

const NextOrder = () => {
  const orders = useOrdersStore((s) => s.orders);
  const moreOrders = orders.filter((order) => order.status === 'Accepted By Courier');

  const handleNextOrder = useCallback(async () => {
    if (moreOrders.length === 0) return;
    try {
      const { coords } = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });
      if (!coords) return;

      const nextOrder = findUndeliveredOrder(moreOrders, {
        latitude: coords.latitude,
        longitude: coords.longitude,
      });
      if (!nextOrder) return;

      router.push({ pathname: '/(maps)/maps', params: { orderId: nextOrder?.id } });
    } catch (error) {
      console.log(error);
    }
  }, [orders, moreOrders]);

  useEffect(() => {
    if (moreOrders.length === 0) {
      router.replace('/(tabs)/(home)');
    }
  }, [moreOrders]);

  return (
    <Container>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: SIZES.lg }}>
        <Text>nextOrder</Text>
        <Button title="All Orders" onPress={() => router.push('/(tabs)/(home)')} />
        {moreOrders.length > 0 && <Button title="Next Order" onPress={handleNextOrder} />}
      </View>
    </Container>
  );
};

export default NextOrder;
