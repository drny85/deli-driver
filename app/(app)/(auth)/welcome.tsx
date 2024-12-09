import { View, Text } from 'react-native'
import React from 'react'
import { Container } from '@/components/Container'
import { Button } from '@/components/Button'
import { router } from 'expo-router'

const welcome = () => {
   return (
      <Container>
         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 20 }}>
            <Text style={{ fontSize: 20 }}>welcome</Text>
            <Button
               title="Go To Dashboard"
               onPress={() => {
                  router.replace('/(app)/(tabs)')
               }}
               contentTextStyle={{ paddingHorizontal: 20 }}
            />
         </View>
      </Container>
   )
}

export default welcome
