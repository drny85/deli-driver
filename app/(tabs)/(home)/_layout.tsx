import { useBackgroundLocation } from '@/hooks/useLocation'
import { Stack } from 'expo-router'
import React from 'react'

const HomeLayout = () => {
   const { backgroundPermission } = useBackgroundLocation()
   console.log('NOT', backgroundPermission)

   //if (!backgroundPermission?.granted) return <Redirect href={'/notlocation'} />
   return (
      <Stack>
         <Stack.Screen name="index" />
      </Stack>
   )
}

export default HomeLayout
