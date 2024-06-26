import { Container } from '@/components/Container';
import NeoView from '@/components/NeoView';
import Row from '@/components/Row';
import { Colors, SIZES } from '@/constants/Colors';
import { useBackgroundLocation } from '@/hooks/useLocation';
import { useOrders } from '@/hooks/useOrders';
import { Order, ORDER_STATUS } from '@/typing';
import { dayjsFormat } from '@/utils/dayjs';
import { FontAwesome } from '@expo/vector-icons';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { router } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, FlatList, ListRenderItem, Text, TouchableOpacity, View } from 'react-native';

const ORDER_OPTIONS = ['New Orders', 'Pending', 'Current'];

const Home = () => {
  const { config } = useBackgroundLocation();

  const { orders } = useOrders();

  const [option, setOption] = useState(0);

  const ordersToRender = useMemo(() => {
    if (option === 0)
      return orders.filter((o) => o.status === ORDER_STATUS.marked_ready_for_delivery);
    if (option === 1) return orders.filter((o) => o.status === ORDER_STATUS.accepted_by_driver);
    if (option === 2) return orders.filter((o) => o.status === ORDER_STATUS.picked_up_by_driver);
    return orders;
  }, [option, orders]);

  // console.log(JSON.stringify(ordersToRender, null, 2));

  const renderOrders: ListRenderItem<Order> = ({ item }) => {
    const disabled = orders.some((o) => o.status === ORDER_STATUS.picked_up_by_driver);

    return (
      <TouchableOpacity
        onPress={() => {
          if (disabled && item.status !== ORDER_STATUS.picked_up_by_driver) {
            Alert.alert('Current Order', 'You must deliver the current order first', [
              { onPress: () => setOption(2) },
            ]);
            return;
          }
          router.push({ pathname: '/(maps)/maps', params: { orderId: item.id! } });
        }}>
        <NeoView
          containerStyle={{
            padding: SIZES.sm,
            borderRadius: SIZES.sm,
            backgroundColor:
              item.status === ORDER_STATUS.picked_up_by_driver ? Colors.accent : Colors.primary,
          }}>
          <Row align="between">
            <View style={{ gap: SIZES.sm }}>
              <Row align="between">
                <Text style={{ fontSize: 24, fontFamily: 'Genos-Bold' }}>
                  Order # {item.orderNumber}
                </Text>
                <Text>{dayjsFormat(item.orderDate).format('lll')}</Text>
              </Row>
              <Text>{item.address?.street.slice(0, -7)}</Text>
            </View>
            <FontAwesome name="chevron-right" size={22} color={Colors.main} />
          </Row>
        </NeoView>
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    // const gt = async () => {
    //   const or = await sortOrderByDistance(ordersData);
    //   setOrders(or);
    // };
    // gt();
    // startLocationTracking();
  }, []);

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
          selectedIndex={option}
          tintColor={Colors.main}
          activeFontStyle={{ color: '#ffffff', fontWeight: '700' }}
          style={{ marginBottom: SIZES.md, height: 40 }}
        />
        <FlatList
          scrollEnabled={false}
          data={ordersToRender}
          renderItem={renderOrders}
          ListEmptyComponent={() => (
            <View style={{ marginTop: 60 }}>
              <Text style={{ textAlign: 'center', fontSize: 22 }}>No orders</Text>
            </View>
          )}
          contentContainerStyle={{ gap: SIZES.md }}
        />
      </View>
    </Container>
  );
};

export default Home;
