import { Coords } from '@/typing';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type LocationStore = {
  location: Coords | null;
  setLocation: (coords: Coords) => void;
  getLocation: () => Coords;
};

export const useLocatioStore = create<LocationStore>()(
  persist(
    (set, get) => ({
      location: null,
      setLocation: (coords) => set({ location: coords }),
      getLocation: () => {
        return get().location!;
      },
    }),
    {
      name: 'location-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export const location = useLocatioStore.getState().getLocation();
export const setLocation = useLocatioStore.getState().setLocation;
