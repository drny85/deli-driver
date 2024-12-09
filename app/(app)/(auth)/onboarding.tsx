import { Button } from '@/components/Button'
import { Container } from '@/components/Container'
import Input from '@/components/Input'
import { Colors, SIZES } from '@/constants/Colors'
import { useUser } from '@/hooks/useUser'
import { zodResolver } from '@hookform/resolvers/zod'
import SegmentedControl from '@react-native-segmented-control/segmented-control'
import React, { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import {
   KeyboardAvoidingView,
   Platform,
   ScrollView,
   StyleSheet,
   Text,
   TouchableOpacity,
   View
} from 'react-native'
import { z } from 'zod'

import { updateCourier } from '@/actions/user/createCourier'
import CircularProgressBar from '@/components/ScoreCircle'
import { usePhoto } from '@/hooks/usePhoto'
import { useFont } from '@shopify/react-native-skia'
import { Image } from 'expo-image'
import { router } from 'expo-router'
import { useSharedValue, withTiming } from 'react-native-reanimated'
const IMAGE_SIZES = SIZES.width * 0.5
export type DirectionsMode = 'DRIVING' | 'BICYCLING'

const onboardingFirstSchema = z.object({
   name: z.string().min(2, { message: 'First Name must contain at least 2 characters' }),
   lastName: z.string().min(2, { message: 'Last Name must contain at least 2 characters' }),
   transportation: z.enum(['DRIVING', 'BICYCLING']),
   image: z.string().url().optional()
})

type FirstSchema = z.infer<typeof onboardingFirstSchema>

const Onboarding = () => {
   const { user } = useUser()
   const font = useFont(require('@/assets/fonts/Genos-Regular.ttf'), 16)
   const end = useSharedValue(0)

   const { handleImageUpload, selectedImage, loading, progress, photo, uploadPhoto } = usePhoto()
   // console.log(selectedImage, photo);

   const {
      control,
      handleSubmit,
      setValue,

      formState: { errors, isSubmitting }
   } = useForm<FirstSchema>({
      defaultValues: {
         lastName: '',
         name: '',
         transportation: 'DRIVING',
         image: ''
      },
      resolver: zodResolver(onboardingFirstSchema)
   })
   console.log(errors)

   // console.log(
   //   Object.entries(user!).map((val, index) => {
   //     if (val[1]) {
   //       return { [val[0]]: val[1] };
   //     }
   //   })

   const handleSave = async (values: FirstSchema) => {
      try {
         if (!user) return
         console.log(values)
         const updated = await updateCourier({ ...user, ...values })
         if (updated) {
            router.replace('/stripe-onboarding')
         }

         // const uploaded = await uploadPhoto(photo, user?.id!);
      } catch (error) {
         console.log(error)
      }
   }

   useEffect(() => {
      if (selectedImage) {
         setValue('image', selectedImage)
         end.value = withTiming(1, { duration: 600 })
      }
   }, [selectedImage])

   useEffect(() => {
      if (!photo || !user) return
      if (photo.assets![0].uri) {
         uploadPhoto(photo, user?.id!)
      }
   }, [photo])

   return (
      <Container>
         <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={40}>
            <View
               style={{ justifyContent: 'center', alignItems: 'center', marginVertical: SIZES.md }}>
               <View style={{ position: 'absolute', zIndex: -1 }}>
                  <CircularProgressBar
                     percentage={progress}
                     strokeWidth={10}
                     font={font!}
                     radius={105}
                     end={end}
                  />
               </View>
               <TouchableOpacity onPress={handleImageUpload}>
                  <Image
                     style={styles.image}
                     source={{
                        uri: photo?.assets
                           ? photo?.assets[0].uri
                           : selectedImage
                             ? selectedImage
                             : 'https://picsum.photos/seed/696/3000/2000'
                     }}
                     contentFit="cover"
                     transition={1000}
                  />
               </TouchableOpacity>
               {errors && errors.image && (
                  <Text
                     style={{
                        textAlign: 'center',
                        marginTop: 16,
                        color: 'orange',
                        fontWeight: '700'
                     }}>
                     Image is required
                  </Text>
               )}
            </View>
            <ScrollView contentContainerStyle={{ padding: SIZES.sm, gap: SIZES.md }}>
               <Controller
                  name="name"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                     <Input
                        autoCapitalize="words"
                        title="First Name"
                        placeholder="John"
                        value={value}
                        error={errors.name?.message}
                        onChangeText={onChange}
                     />
                  )}
               />
               <Controller
                  name="lastName"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                     <Input
                        autoCapitalize="words"
                        title="Last Name"
                        placeholder="Doe"
                        value={value}
                        error={errors.lastName?.message}
                        onChangeText={onChange}
                     />
                  )}
               />
               <Text style={styles.title}>Delivery Mode</Text>
               <SegmentedControl
                  tintColor={Colors.main}
                  activeFontStyle={{ color: '#ffffff', fontWeight: '700' }}
                  style={{ marginBottom: SIZES.md, height: 40 }}
                  selectedIndex={0}
                  values={['DRIVING', 'BICYCLING']}
                  onChange={(event) => {
                     setValue('transportation', event.nativeEvent.value as DirectionsMode)
                  }}
               />
               <Button title="Save" disabled={isSubmitting} onPress={handleSubmit(handleSave)} />
            </ScrollView>
         </KeyboardAvoidingView>
      </Container>
   )
}

export default Onboarding

const styles = StyleSheet.create({
   title: {
      fontFamily: 'Genos-Bold',
      fontSize: 24,
      paddingLeft: SIZES.sm,
      textTransform: 'capitalize',
      paddingBottom: SIZES.sm * 0.5
   },
   image: {
      width: IMAGE_SIZES,
      height: IMAGE_SIZES,
      borderRadius: IMAGE_SIZES / 2,
      zIndex: 20
   }
})
