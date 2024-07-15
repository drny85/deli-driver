import { Container } from '@/components/Container'
import { useAuth } from '@/providers/authProvider'
import React from 'react'
import { StyleSheet, Text } from 'react-native'

const Settings = () => {
   const { user } = useAuth()
   return (
      <Container>
         <Text>Welcome {user?.name}</Text>
         <Text>Active {user?.isActive ? 'YES' : 'NO'}</Text>
      </Container>
   )
}

export default Settings

const styles = StyleSheet.create({})
