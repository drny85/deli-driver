import { View, Text, KeyboardAvoidingView, Platform, TextInput, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { Container } from '@/components/Container';
import { Colors, SIZES } from '@/constants/Colors';
import { Button } from '@/components/Button';
import { useAuth } from '@/providers/authProvider';

const Login = () => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleLogin = async () => {
    console.log('login');
    try {
      await signIn(email, password);
    } catch (error) {}
  };
  return (
    <Container>
      <KeyboardAvoidingView
        style={{ flex: 1, paddingHorizontal: SIZES.md }}
        keyboardVerticalOffset={40}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: SIZES.lg }}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
          />
          <Button title="Login" onPress={handleLogin} />
        </View>
      </KeyboardAvoidingView>
    </Container>
  );
};

export default Login;

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 0.5,
    padding: 10,
    borderColor: Colors.main,
    borderRadius: SIZES.md,
    width: '100%',
  },
});
