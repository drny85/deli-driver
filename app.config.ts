import { ExpoConfig } from 'expo/config';

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
    favicon: './assets/favicon.png',
  },

  plugins: [
    'expo-router',
    'expo-localization',
    [
      'expo-location',
      {
        locationAlwaysAndWhenInUsePermission: 'Allow $(PRODUCT_NAME) to use your location.',
      },
    ],
  ],
  experiments: {
    typedRoutes: true,

    tsconfigPaths: true,
  },

  orientation: 'portrait',
  icon: './assets/icon.png',

  userInterfaceStyle: 'light',

  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: false,
    bundleIdentifier: 'com.robertdev.deli.driver',
    infoPlist: {
      UIBackgroundModes: ['location', 'fetch', 'remote-notification'],
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
  },
};

export default config;
