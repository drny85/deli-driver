import { Button } from '@/components/Button'
import { Container } from '@/components/Container'
import { useBackgroundLocation } from '@/hooks/useLocation'
import React from 'react'
import { Text, View } from 'react-native'

const notlocation = () => {
   const { config } = useBackgroundLocation()

   return (
      <Container>
         <View
            style={{
               flex: 1,
               justifyContent: 'center',
               alignItems: 'center',
               padding: 16,
               gap: 60
            }}>
            <Text style={{ fontFamily: 'Genos-Bold', fontSize: 24, textAlign: 'center' }}>
               You must allow the app to use your background location always
            </Text>
            <Button title="Allow Background Location" onPress={config} />
            <Text style={{ textAlign: 'center', fontFamily: 'Genos', fontSize: 18 }}>
               You might have to go to settings and change location permission there.
            </Text>
         </View>
      </Container>
   )
}

export default notlocation
