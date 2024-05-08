import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Container } from '@/components/Container';
import { useUser } from '@/hooks/useUser';

const Settings = () => {
  const { user } = useUser();
  return (
    <Container>
      <Text>Welcome {user?.name}</Text>
    </Container>
  );
};

export default Settings;

const styles = StyleSheet.create({});
