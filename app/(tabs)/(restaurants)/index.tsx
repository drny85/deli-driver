import { View, Text, ScrollView, FlatList, ListRenderItem, TouchableOpacity } from 'react-native';
import React, { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { Container } from '@/components/Container';
import { useBusinessAvailable } from '@/hooks/useBusinesses';
import { useAuth } from '@/providers/authProvider';
import { Business } from '@/typing';
import { Colors, SIZES } from '@/constants/Colors';
import { useNavigationSearch } from '@/hooks/useNavigationSeach';
import { globalStyle } from '@/constants/styles';
import { Stack, useNavigation } from 'expo-router';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { NavigationProp } from '@react-navigation/native';
import { useUser } from '@/hooks/useUser';
import Loading from '@/components/Loading';

const OPTIONS = ['Active', 'Available'];

const Restaurants = () => {
  const { user } = useUser();
  const { business, isLoading } = useBusinessAvailable();
  const [option, setOption] = useState(0);
  const navigation = useNavigation();
  const search = useNavigationSearch({
    searchBarOptions: {
      placeholder: 'Search',
      hintTextColor: Colors.main,
      tintColor: Colors.main,
    },
  });

  const items = useMemo(() => {
    if (!search)
      return option === 0
        ? business.filter((b) => b.couriers.includes(user?.id!))
        : business.filter((b) => !b.couriers.includes(user?.id!));
    return business.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));
  }, [search, business.length, option]);

  const renderBusiness: ListRenderItem<Business> = useCallback(
    ({ item }) => {
      return (
        <TouchableOpacity>
          <View style={{ padding: SIZES.md }}>
            <Text>{item.name}</Text>
          </View>
        </TouchableOpacity>
      );
    },
    [business]
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Businesses',
      headerTitle(props: any) {
        return (
          <View {...props} style={globalStyle.flex}>
            <SegmentedControl
              values={OPTIONS}
              onChange={(event) => {
                setOption(event.nativeEvent.selectedSegmentIndex);
              }}
              selectedIndex={option}
              fontStyle={{
                fontFamily: 'Genos',
                fontSize: 20,
              }}
              tintColor={Colors.main}
              activeFontStyle={{ color: '#ffffff', fontFamily: 'Genos-Bold', fontSize: 26 }}
              style={{ marginBottom: SIZES.md, height: 40, width: '80%', alignSelf: 'center' }}
            />
          </View>
        );
      },
    });
  }, [navigation]);

  if (isLoading) return <Loading />;
  return (
    <View style={{ flex: 1, backgroundColor: Colors.primary }}>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <FlatList
          scrollEnabled={false}
          data={items}
          renderItem={renderBusiness}
          contentContainerStyle={{ gap: SIZES.md }}
          ListEmptyComponent={
            <View style={globalStyle.center}>
              <Text>No Businesses available</Text>
            </View>
          }
        />
      </ScrollView>
    </View>
  );
};

export default Restaurants;
