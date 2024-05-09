import { Button } from '@/components/Button';
import { Container } from '@/components/Container';
import Input from '@/components/Input';
import { Colors, SIZES } from '@/constants/Colors';
import { useAuth } from '@/providers/authProvider';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import { FIREBASE_ERRORS } from '@/utils/firebaseErrorMessages';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { FontAwesome } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { router } from 'expo-router';
import { formatPhone } from '@/utils/formatPhone';
const signupSchema = z
  .object({
    email: z.string().email(),
    phone: z.string().min(14, { message: 'Invalid phone formatting' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
    confirmPassword: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
  })
  .refine(({ confirmPassword, password }) => confirmPassword === password, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type SignupSchema = z.infer<typeof signupSchema>;

const Signup = () => {
  const { signUp } = useAuth();
  const translateY = useSharedValue(0);
  const [showPassword, setShowPassword] = useState(false);
  const {
    control,
    handleSubmit,
    reset,
    getFieldState,
    formState: { errors, isSubmitting },
  } = useForm<SignupSchema>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(signupSchema),
  });
  const handleLogin = async (values: SignupSchema) => {
    try {
      await signUp(values.email, values.password, values.phone);
      reset();
    } catch (error) {
      console.log(error);
      const err = error as Error;
      Alert.alert(FIREBASE_ERRORS[err.message]);
    }
  };

  const animate = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withTiming(translateY.value),
        },
      ],
    };
  });

  useEffect(() => {
    const keyboardListener = Keyboard.addListener('keyboardWillShow', ({ startCoordinates }) => {
      if (translateY.value === 0) {
        translateY.value = -startCoordinates?.height!;
      }
    });
    const keyboardListenerHide = Keyboard.addListener('keyboardWillHide', () => {
      translateY.value = 0;
    });

    return () => {
      keyboardListener && keyboardListener.remove();
      keyboardListenerHide && keyboardListenerHide.remove();
    };

    // return keyboardListener.remove();
  }, []);
  return (
    <Container>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={{ flex: 1, paddingHorizontal: SIZES.md }}
          keyboardVerticalOffset={40}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <Animated.View style={[styles.lottieContainer, animate]}>
            <LottieView
              style={styles.lottie}
              source={require('@/assets/animations/delivery_guy.json')}
              autoPlay
              loop
            />
          </Animated.View>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: SIZES.lg }}>
            <Controller
              name="email"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Input
                  autoCapitalize="none"
                  autoComplete="off"
                  autoFocus
                  autoCorrect={false}
                  title="Email"
                  placeholder="Email Address"
                  value={value}
                  error={errors.email?.message}
                  onChangeText={(text) => onChange(text.toLowerCase())}
                />
              )}
            />
            <Controller
              name="phone"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Input
                  autoCapitalize="none"
                  title="Cell Phone Number"
                  keyboardType="number-pad"
                  placeholder="(978) 564-3210"
                  value={value}
                  error={errors.phone?.message}
                  onChangeText={(text) => onChange(formatPhone(text))}
                />
              )}
            />
            <Controller
              name="password"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Input
                  autoCapitalize="none"
                  title="password"
                  secureTextEntry={showPassword}
                  placeholder="Password"
                  value={value}
                  error={errors.password?.message}
                  onChangeText={onChange}
                  RightIcon={
                    <FontAwesome
                      onPress={() => setShowPassword((prev) => !prev)}
                      name={showPassword ? 'eye-slash' : 'eye'}
                      size={20}
                    />
                  }
                />
              )}
            />
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Input
                  autoCapitalize="none"
                  title="Confirm Password"
                  secureTextEntry={showPassword}
                  placeholder="Password"
                  value={value}
                  error={errors.confirmPassword?.message}
                  onChangeText={onChange}
                  RightIcon={
                    <FontAwesome
                      onPress={() => setShowPassword((prev) => !prev)}
                      name={showPassword ? 'eye-slash' : 'eye'}
                      size={20}
                      color={Colors.main}
                    />
                  }
                />
              )}
            />

            <View style={{ width: '60%' }}>
              <Button disabled={isSubmitting} title="Sign Up" onPress={handleSubmit(handleLogin)} />
            </View>
            <View style={styles.bottom}>
              <Text style={styles.bottomText}>have an account?</Text>
              <Text onPress={() => router.back()} style={[styles.bottomText, { fontSize: 20 }]}>
                Sign In
              </Text>
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </Container>
  );
};

export default Signup;

const styles = StyleSheet.create({
  lottie: {
    height: '100%',
    width: 'auto',
  },
  lottieContainer: {
    height: SIZES.height * 0.2,
  },
  bottom: {
    gap: SIZES.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomText: {
    fontFamily: 'Genos',
    fontSize: 18,
  },
});
