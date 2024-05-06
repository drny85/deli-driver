import { View, Text, ScrollView, FlatList, ListRenderItem, TouchableOpacity } from 'react-native';
import React, { useCallback, useMemo } from 'react';
import { Container } from '@/components/Container';
import { useBusinessAvailable } from '@/hooks/useBusinesses';
import { useAuth } from '@/providers/authProvider';
import { Business } from '@/typing';
import { Colors, SIZES } from '@/constants/Colors';
import { useNavigationSearch } from '@/hooks/useNavigationSeach';

const Restaurants = () => {
  const { business, isLoading } = useBusinessAvailable();
  const search = useNavigationSearch({
    searchBarOptions: {
      placeholder: 'Search',
      hintTextColor: Colors.main,
      tintColor: Colors.main,
    },
  });

  const items = useMemo(() => {
    if (!search) return business;
    return business.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));
  }, [search, business.length]);

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

  return (
    <View style={{ flex: 1, backgroundColor: Colors.primary }}>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <FlatList
          scrollEnabled={false}
          data={items}
          renderItem={renderBusiness}
          contentContainerStyle={{ gap: SIZES.md }}
        />
      </ScrollView>
    </View>
  );
};

export default Restaurants;
