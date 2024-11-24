import { addCourierToWaitingList } from '@/actions/courier/addCourierToWaitingList'

import Loading from '@/components/Loading'
import NeoView from '@/components/NeoView'
import Row from '@/components/Row'
import { Colors, SIZES } from '@/constants/Colors'
import { globalStyle } from '@/constants/styles'
import { useBusinessAvailable } from '@/hooks/useBusinesses'
import { useCourierWaitingList } from '@/hooks/useCourierAwaitigList'
import { useNavigationSearch } from '@/hooks/useNavigationSeach'
import { useUser } from '@/hooks/useUser'
import { Business } from '@/typing'
import SegmentedControl from '@react-native-segmented-control/segmented-control'
import { useMemo, useState } from 'react'
import {
   ActivityIndicator,
   Alert,
   Button,
   FlatList,
   ListRenderItem,
   ScrollView,
   Text,
   View
} from 'react-native'

const OPTIONS = ['Enrolled', 'Available']

const Restaurants = () => {
   const { user } = useUser()
   const { business, isLoading } = useBusinessAvailable()
   const { list, loadingList } = useCourierWaitingList()
   const waitingList = useMemo(
      () =>
         list
            .filter((b) => b.status === 'pending' && b.courierId === user?.id)
            .map((w) => w.businessId),
      [list.length, user]
   )

   const [loading, setLoading] = useState(false)
   const [option, setOption] = useState(0)

   const search = useNavigationSearch({
      searchBarOptions: {
         placeholder: 'Search',
         hintTextColor: Colors.main,
         tintColor: Colors.main
      }
   })

   const items = useMemo(() => {
      if (!search)
         return option === 0
            ? business.filter((b) => b.couriers.includes(user?.id!))
            : business.filter((b) => !b.couriers.includes(user?.id!))
      return business.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))
   }, [search, business, option, list])

   const onStoreRequestSent = async (businessId: string, enrolled: boolean) => {
      try {
         if (!businessId || !user) return
         console.log('NO')
         if (!enrolled) {
            setLoading(true)
            const { message, success } = await addCourierToWaitingList(
               businessId,
               user?.id!,
               `${user.name} ${user.lastName}`,
               user.phone!
            )
            if (message) Alert.alert(message)
         } else {
            console.log('SI')
         }
      } catch (error) {
         console.log(error)
      } finally {
         setLoading(false)
      }
   }

   const renderBusiness: ListRenderItem<Business> = ({ item }) => {
      const enrolled = item.couriers.includes(user?.id!)
      const waiting = waitingList.includes(item.id!)

      return (
         <NeoView containerStyle={{ padding: SIZES.sm, borderRadius: SIZES.sm }}>
            <Row align="between">
               <View style={{ gap: SIZES.sm }}>
                  <Text style={{ fontFamily: 'Genos-Bold', fontSize: 22 }}>{item.name}</Text>
                  <Text>{item.phone}</Text>
                  <Text>{item.address?.slice(0, -5)}</Text>
               </View>
               {loading ? (
                  <ActivityIndicator size={'small'} color={Colors.main} />
               ) : waiting ? (
                  <Button title={'Waiting'} color={Colors.main} />
               ) : (
                  <Button
                     disabled={loading}
                     title={enrolled ? 'De-Enroll' : 'Enroll'}
                     onPress={() => onStoreRequestSent(item.id!, enrolled)}
                  />
               )}
            </Row>
         </NeoView>
      )
   }

   if (isLoading || loadingList) return <Loading />
   return (
      <View style={{ flex: 1, backgroundColor: Colors.primary }}>
         <View style={{ width: '100%' }}>
            <SegmentedControl
               values={OPTIONS}
               onChange={(event) => {
                  setOption(event.nativeEvent.selectedSegmentIndex)
               }}
               selectedIndex={option}
               fontStyle={{
                  fontSize: 18,
                  color: '#212121'
               }}
               tintColor={Colors.main}
               activeFontStyle={{
                  color: '#ffffff',
                  fontSize: 20
               }}
               style={{
                  height: 40,
                  width: '70%',
                  marginVertical: SIZES.sm,
                  alignSelf: 'center',
                  alignItems: 'center'
               }}
            />
         </View>
         <ScrollView contentInsetAdjustmentBehavior="automatic">
            <FlatList
               scrollEnabled={false}
               data={items}
               renderItem={renderBusiness}
               contentContainerStyle={{ gap: SIZES.md, padding: SIZES.md }}
               ListEmptyComponent={
                  <View style={globalStyle.center}>
                     <Text>No Businesses available</Text>
                  </View>
               }
            />
         </ScrollView>
      </View>
   )
}

export default Restaurants
