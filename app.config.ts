import { ExpoConfig } from 'expo/config'

const filteredEnv = Object.fromEntries(
   Object.entries(process.env).filter(([key, val]) => key.indexOf('EXPO_PUBLIC_') === 0)
)

// In SDK 46 and lower, use the following import instead:
// import { ExpoConfig } from '@expo/config-types';

const config: ExpoConfig = {
   name: 'deli-driver',
   slug: 'deli-driver',
   version: '1.0.0',
   scheme: 'deli-driver',
   web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/favicon.png'
   },

   plugins: [
      'expo-router',
      'expo-localization',
      [
         'expo-location',
         {
            locationAlwaysAndWhenInUsePermission: 'Allow $(PRODUCT_NAME) to use your location.',

            locationAlwaysPermission: 'Allow $(PRODUCT_NAME) to use your location.',
            locationWhenInUsePermission: 'Allow $(PRODUCT_NAME) to use your location.',
            NSLocationUsageDescription: 'Allow $(PRODUCT_NAME) to use your location.',
            isIosBackgroundLocationEnabled: true,
            isAndroidBackgroundLocationEnabled: true
         }
      ]
   ],
   experiments: {
      typedRoutes: true,

      tsconfigPaths: true
   },

   orientation: 'portrait',
   icon: './assets/icon.png',

   userInterfaceStyle: 'light',

   splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff'
   },
   assetBundlePatterns: ['**/*'],
   ios: {
      supportsTablet: false,
      bundleIdentifier: 'com.robertdev.deli.driver',

      infoPlist: {
         UIBackgroundModes: ['location', 'fetch', 'remote-notification', 'audio'],
         NSLocationWhenInUseUsageDescription: 'Allow $(PRODUCT_NAME) to use your location.',
         NSLocationAlwaysAndWhenInUseUsageDescription:
            'Allow $(PRODUCT_NAME) to use your location.',
         NSLocationAlwaysUsageDescription: 'Allow $(PRODUCT_NAME) to use your location.',
         NSLocationUsageDescription: 'Allow $(PRODUCT_NAME) to use your location.'
      }
   },
   android: {
      adaptiveIcon: {
         foregroundImage: './assets/adaptive-icon.png',
         backgroundColor: '#ffffff'
      }
   },
   extra: {
      env: filteredEnv,
      eas: {
         projectId: '6683f544-5343-4401-8c5d-89a47c2e20dc'
      }
   }
}

export default config
