import { useBackgroundLocation } from '@/hooks/useLocation'
import { Redirect, Stack } from 'expo-router'
import React from 'react'

const HomeLayout = () => {
   // console.log('backgroundPermission', backgroundPermission?.granted)

   // if (!backgroundPermission?.granted) return <Redirect href={'/notlocation'} />
   return (
      <Stack>
         <Stack.Screen name="index" />
      </Stack>
   )
}

export default HomeLayout
