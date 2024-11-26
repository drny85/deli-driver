import { updateDriverLocationInFirestore } from '@/actions/courier'
import { updateCourier } from '@/actions/user/createCourier'
import { auth, usersCollection } from '@/firebase'
import { Coords } from '@/typing'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { doc, getDoc } from 'firebase/firestore'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

type LocationStore = {
   location: Coords | null
   setLocation: (coords: Coords) => void
   getLocation: () => Coords
}

export const useLocatioStore = create<LocationStore>()(
   persist(
      (set, get) => ({
         location: null,
         setLocation: async (coords) => {
            const user = auth.currentUser
            if (user) {
               const userRef = doc(usersCollection, user.uid)
               const userData = await getDoc(userRef)
               const data = userData.data()
               if (userData.exists() && data && coords) {
                  console.log('Updating user location from Location Store')
                  await updateCourier({
                     ...data,
                     coords: { latitude: coords.latitude, longitude: coords.longitude }
                  })
                  updateDriverLocationInFirestore(user.uid, coords)
               }
            }
            set({ location: coords })
         },
         getLocation: () => {
            return get().location!
         }
      }),
      {
         name: 'location-storage',
         storage: createJSONStorage(() => AsyncStorage)
      }
   )
)

export const location = useLocatioStore.getState().getLocation()
export const setLocation = useLocatioStore.getState().setLocation
