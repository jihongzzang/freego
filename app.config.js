const IS_PROD = process.env.APP_ENV === 'production';

export default {
  expo: {
    name: IS_PROD ? '프리고' : 'Freego Dev',
    slug: IS_PROD ? 'freego-app' : 'freego-app-dev',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: IS_PROD ? 'freego' : 'freego-dev',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    privacy: 'https://jihongzzang.github.io/freego/privacy-policy.html',
    splash: {
      image: './assets/images/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    android: {
      adaptiveIcon: {
        backgroundColor: '#ffffff',
      },
      package: IS_PROD ? 'com.frigo.app' : 'com.frigo.app.dev',
      softwareKeyboardLayoutMode: 'resize',
      locales: {
        ko: {
          label: '프리고',
        },
      },
      splash: {
        image: './assets/images/splash.png',
        resizeMode: 'contain',
        backgroundColor: '#ffffff',
        dark: {
          image: './assets/images/splash-dark.png',
          backgroundColor: '#000000',
        },
      },
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: IS_PROD ? 'com.frigo.app' : 'com.frigo.app.dev',
      buildNumber: '4',
      infoPlist: {
        CFBundleLocalizations: ['ko'],
        CFBundleDisplayName: '프리고',
      },
      splash: {
        image: './assets/images/splash.png',
        resizeMode: 'contain',
        backgroundColor: '#ffffff',
        dark: {
          image: './assets/images/splash-dark.png',
          backgroundColor: '#17171C',
        },
      },
    },
    web: {
      bundler: 'metro',
      output: 'single',
      favicon: './assets/images/favicon.png',
    },
    plugins: ['expo-router', 'expo-font', 'expo-web-browser'],
    experiments: {
      typedRoutes: true,
    },
  },
};
