import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

// Import translations
import koCommon from './ko/common.json';
import enCommon from './en/common.json';

// Resource bundles
const resources = {
  ko: {
    common: koCommon,
  },
  en: {
    common: enCommon,
  },
};

// Get device language (fallback to 'ko')
const getDeviceLanguage = (): string => {
  const locale = Localization.getLocales()[0]?.languageCode;
  return locale && ['ko', 'en'].includes(locale) ? locale : 'ko';
};

// Initialize i18n
i18n.use(initReactI18next).init({
  resources,
  lng: getDeviceLanguage(),
  fallbackLng: 'ko',
  defaultNS: 'common',
  ns: ['common'],
  interpolation: {
    escapeValue: false, // React already handles escaping
  },
  react: {
    useSuspense: false, // Disable suspense for React Native
  },
});

export default i18n;
