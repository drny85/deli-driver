import React from 'react'
import { Stack } from 'expo-router'

const HomeLayout = () => {
   return (
      <Stack>
         <Stack.Screen name="delivery" />
      </Stack>
   )
}

export default HomeLayout
