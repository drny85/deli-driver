import { Container } from '@/components/Container';
import NeoView from '@/components/NeoView';
import NotLocationGranted from '@/components/NotLocationGranted';
import SegmentedControlOrders from '@/components/SegmentedControlOrders';
import { Colors, SIZES } from '@/constants/Colors';
import { ordersData } from '@/constants/ordersData';
import { useBackgroundLocation } from '@/hooks/useLocation';
import { useNavigationSearch } from '@/hooks/useNavigationSeach';
import { useOrdersStore } from '@/providers/ordersStore';
import { TempOrder } from '@/typing';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { router, Stack } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, ListRenderItem, ScrollView, Text, TouchableOpacity, View } from 'react-native';

const ORDER_OPTIONS = ['All Orders', 'Pending', 'Current'];

const Home = () => {
  const {
    stopLocation,
    startLocationTracking,
    config,

    backgroundPermission,
    foregroundPermission,
  } = useBackgroundLocation();

  const { setOrders, orders, setOrder } = useOrdersStore();
  const [option, setOption] = useState(0);

  const ordersToRender = useMemo(() => {
    if (option === 0) return orders;
    if (option === 1) return orders.filter((o) => o.status === 'Ready For Delivery');
    if (option === 2) return orders.filter((o) => o.status === 'Picked By Courier');
    return orders;
  }, [option, orders]);

  const renderOrders: ListRenderItem<TempOrder> = useCallback(({ item }) => {
    const disabled = orders.some((o) => o.status === 'Picked By Courier');
    return (
      <TouchableOpacity
        disabled={disabled && item.status !== 'Picked By Courier'}
        onPress={() => {
          setOrder(item);
          router.push('/(maps)/maps');
        }}>
        <NeoView
          containerStyle={{
            padding: SIZES.md,
            borderRadius: SIZES.sm,
            backgroundColor: item.status === 'Picked By Courier' ? Colors.accent : Colors.primary,
          }}>
          <Text>{item.status}</Text>
        </NeoView>
      </TouchableOpacity>
    );
  }, []);

  useEffect(() => {
    setOrders(ordersData);
  }, [orders]);

  if (!backgroundPermission) {
    return <NotLocationGranted onPress={config} />;
  }

  // return <OrderProgress status="Accepted By Courier" />;

  return (
    <Container>
      <View style={{ flex: 1, paddingHorizontal: SIZES.md }}>
        <Text
          style={{
            textAlign: 'center',
            fontFamily: 'Genos-Bold',
            fontSize: 30,
            marginBottom: SIZES.md,
          }}>
          Orders
        </Text>
        <SegmentedControl
          values={ORDER_OPTIONS}
          onChange={(event) => {
            setOption(event.nativeEvent.selectedSegmentIndex);
          }}
          selectedIndex={0}
          tintColor={Colors.main}
          activeFontStyle={{ color: '#ffffff', fontWeight: '700' }}
          style={{ marginBottom: SIZES.md, height: 40 }}
        />
        <FlatList
          scrollEnabled={false}
          data={ordersToRender}
          renderItem={renderOrders}
          contentContainerStyle={{ gap: SIZES.md }}
        />
      </View>
    </Container>
  );
};

export default Home;
