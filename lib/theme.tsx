import { useColorScheme, TextStyle, Platform } from 'react-native';
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_KEY = '@theme_preference';

export type ThemeMode = 'system' | 'light' | 'dark';

type ThemeContextType = {
  colors: ColorPalette;
  isDark: boolean;
  themePreference: ThemeMode;
  setTheme: (mode: ThemeMode) => Promise<void>;
  spacing: typeof spacing;
  borderRadius: typeof borderRadius;
  typography: typeof typography;
  shadows: typeof shadows;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export type ColorPalette = {
  white: string;
  black: string;

  background: string;

  surface: string;
  surfaceSecondary: string;

  primary: string;
  primaryLight: string;

  secondary: string;
  secondaryLight: string;

  danger: string;
  dangerLight: string;

  success: string;
  successLight: string;

  warning: string;
  warningLight: string;

  text: string;
  textSecondary: string;
  textTertiary: string;
  textDisabled: string;

  border: string;
  borderFocus: string;
  borderError: string;
  borderSuccess: string;

  overlay: string;

  blue50: string;
  blue100: string;
  blue200: string;
  blue300: string;
  blue400: string;
  blue500: string;
  blue600: string;
  blue700: string;
  blue800: string;
  blue900: string;

  red50: string;
  red100: string;
  red200: string;
  red300: string;
  red400: string;
  red500: string;
  red600: string;
  red700: string;
  red800: string;
  red900: string;

  orange50: string;
  orange100: string;
  orange200: string;
  orange300: string;
  orange400: string;
  orange500: string;
  orange600: string;
  orange700: string;
  orange800: string;
  orange900: string;

  yellow50: string;
  yellow100: string;
  yellow200: string;
  yellow300: string;
  yellow400: string;
  yellow500: string;
  yellow600: string;
  yellow700: string;
  yellow800: string;
  yellow900: string;

  green50: string;
  green100: string;
  green200: string;
  green300: string;
  green400: string;
  green500: string;
  green600: string;
  green700: string;
  green800: string;
  green900: string;

  teal50: string;
  teal100: string;
  teal200: string;
  teal300: string;
  teal400: string;
  teal500: string;
  teal600: string;
  teal700: string;
  teal800: string;
  teal900: string;

  grey50: string;
  grey100: string;
  grey200: string;
  grey300: string;
  grey400: string;
  grey500: string;
  grey600: string;
  grey700: string;
  grey800: string;
  grey900: string;

  greyOpactiy50: string;
  greyOpactiy100: string;
  greyOpactiy200: string;
  greyOpactiy300: string;
  greyOpactiy400: string;
  greyOpactiy500: string;
  greyOpactiy600: string;
  greyOpactiy700: string;
  greyOpactiy800: string;
  greyOpactiy900: string;

  whiteOpactiy50: string;
  whiteOpactiy100: string;
  whiteOpactiy200: string;
  whiteOpactiy300: string;
  whiteOpactiy400: string;
  whiteOpactiy500: string;
  whiteOpactiy600: string;
  whiteOpactiy700: string;
  whiteOpactiy800: string;
  whiteOpactiy900: string;
};

export const Colors: Record<'light' | 'dark', ColorPalette> = {
  light: {
    white: '#FFFFFF',
    black: '#000000',

    background: '#F2F4F6',

    surface: '#FFFFFF',
    surfaceSecondary: '#F2F4F6',

    primary: '#02A262',
    primaryLight: '#77E4B8',

    secondary: '#ffa929',
    secondaryLight: '#fff3e0',

    danger: '#f66571',
    dangerLight: '#fff0f0',

    success: '#15C67F',
    successLight: '#F0FAF6',

    // warning: '#ffc342',
    warning: '#ff9900',
    warningLight: '#fff9e5',

    text: '#191F28',
    textSecondary: '#4E5968',
    textTertiary: '#9CA3AF',
    textDisabled: '#AFB7C0',

    border: '#F2F4F6',
    borderFocus: '#02A262',
    borderError: '#f66571',
    borderSuccess: '#15C67F',

    overlay: 'rgba(0, 0, 0, 0.2)',

    blue50: '#e5f2ff',
    blue100: '#c7e1ff',
    blue200: '#8fc1ff',
    blue300: '#66a8ff',
    blue400: '#4594fc',
    blue500: '#3183f6',
    blue600: '#2473eb',
    blue700: '#1b64da',
    blue800: '#1957c2',
    blue900: '#1949a4',

    red50: '#fff0f0',
    red100: '#ffd6d8',
    red200: '#feaeb4',
    red300: '#fb8990',
    red400: '#f66571',
    red500: '#f04251',
    red600: '#e52a39',
    red700: '#d11f2e',
    red800: '#bb1b2b',
    red900: '#a41926',

    orange50: '#fff3e0',
    orange100: '#ffe0b2',
    orange200: '#ffcc7f',
    orange300: '#ffbd52',
    orange400: '#ffa929',
    orange500: '#ff9900',
    orange600: '#fa8900',
    orange700: '#f57600',
    orange800: '#eb6600',
    orange900: '#e55800',

    yellow50: '#fff9e5',
    yellow100: '#ffeebd',
    yellow200: '#ffe599',
    yellow300: '#ffde7a',
    yellow400: '#ffcf57',
    yellow500: '#ffc342',
    yellow600: '#ffb433',
    yellow700: '#faa033',
    yellow800: '#ee8e11',
    yellow900: '#de7f02',

    green50: '#F0FAF6',
    green100: '#AEEFD5',
    green200: '#77E4B8',
    green300: '#3FD599',
    green400: '#15C67F',
    green500: '#03B06B',
    green600: '#02A262',
    green700: '#029258',
    green800: '#02834F',
    green900: '#027949',

    teal50: '#edf8f8',
    teal100: '#beeaea',
    teal200: '#88d7d7',
    teal300: '#57c7c7',
    teal400: '#30b5b5',
    teal500: '#18a5a5',
    teal600: '#109494',
    teal700: '#0c8383',
    teal800: '#097777',
    teal900: '#076464',

    grey50: '#F9FAFB',
    grey100: '#F2F4F6',
    grey200: '#e5e8eb',
    grey300: '#d1d6db',
    grey400: '#afb7c0',
    grey500: '#8c95a1',
    grey600: '#6c7684',
    grey700: '#4e5968',
    grey800: '#333d4b',
    grey900: '#191f28',

    greyOpactiy50: 'rgba(0, 23, 51, 0.02)',
    greyOpactiy100: 'rgba(2, 32, 71, 0.05)',
    greyOpactiy200: 'rgba(0, 27, 55, 0.1)',
    greyOpactiy300: 'rgba(0, 29, 58, 0.18)',
    greyOpactiy400: 'rgba(0, 25, 54, 0.31)',
    greyOpactiy500: 'rgba(3, 24, 50, 0.46)',
    greyOpactiy600: 'rgba(0, 19, 43, 0.58)',
    greyOpactiy700: 'rgba(3, 18, 40, 0.70)',
    greyOpactiy800: 'rgba(0, 12, 31, 0.80)',
    greyOpactiy900: 'rgba(2, 9, 19, 0.91)',

    whiteOpactiy50: 'rgba(209, 209, 253, 0.05)',
    whiteOpactiy100: 'rgba(217, 217, 255, 0.11)',
    whiteOpactiy200: 'rgba(222, 222, 255, 0.19)',
    whiteOpactiy300: 'rgba(224, 224, 255, 0.27)',
    whiteOpactiy400: 'rgba(232, 232, 253, 0.38)',
    whiteOpactiy500: 'rgba(242, 242, 255, 0.47)',
    whiteOpactiy600: 'rgba(248, 248, 255, 0.6)',
    whiteOpactiy700: 'rgba(253, 253, 255, 0.75)',
    whiteOpactiy800: 'rgba(255, 255, 255, 0.89)',
    whiteOpactiy900: '#FFFFFF',
  },
  dark: {
    white: '#FFFFFF',
    black: '#000000',

    background: '#101013',

    surface: '#17171c',
    surfaceSecondary: '#4f5a69',

    primary: '#02A262',
    primaryLight: '#77E4B8',

    secondary: '#ffa929',
    secondaryLight: '#fff3e0',

    danger: '#f04251',
    dangerLight: '#fff0f0',

    success: '#15C67F',
    successLight: '#F0FAF6',

    // warning: '#ffc342',
    warning: '#ff9900',
    warningLight: '#fff9e5',

    text: '#F9FAFB',
    textSecondary: '#d1d6db',
    textTertiary: '#8c95a1',
    textDisabled: '#4f5a69',

    border: '#33333C',
    borderFocus: '#02A262',
    borderError: '#f04251',
    borderSuccess: '#15C67F',

    overlay: 'rgba(2, 9, 19, 0.91)', // greyOpacity900

    blue50: '#e5f2ff',
    blue100: '#c7e1ff',
    blue200: '#8fc1ff',
    blue300: '#66a8ff',
    blue400: '#4594fc',
    blue500: '#3183f6',
    blue600: '#2473eb',
    blue700: '#1b64da',
    blue800: '#1957c2',
    blue900: '#1949a4',

    red50: '#fff0f0',
    red100: '#ffd6d8',
    red200: '#feaeb4',
    red300: '#fb8990',
    red400: '#f66571',
    red500: '#f04251',
    red600: '#e52a39',
    red700: '#d11f2e',
    red800: '#bb1b2b',
    red900: '#a41926',

    orange50: '#fff3e0',
    orange100: '#ffe0b2',
    orange200: '#ffcc7f',
    orange300: '#ffbd52',
    orange400: '#ffa929',
    orange500: '#ff9900',
    orange600: '#fa8900',
    orange700: '#f57600',
    orange800: '#eb6600',
    orange900: '#e55800',

    yellow50: '#fff9e5',
    yellow100: '#ffeebd',
    yellow200: '#ffe599',
    yellow300: '#ffde7a',
    yellow400: '#ffcf57',
    yellow500: '#ffc342',
    yellow600: '#ffb433',
    yellow700: '#faa033',
    yellow800: '#ee8e11',
    yellow900: '#de7f02',

    green50: '#F0FAF6',
    green100: '#AEEFD5',
    green200: '#77E4B8',
    green300: '#3FD599',
    green400: '#15C67F',
    green500: '#03B06B',
    green600: '#02A262',
    green700: '#029258',
    green800: '#02834F',
    green900: '#027949',

    teal50: '#edf8f8',
    teal100: '#beeaea',
    teal200: '#88d7d7',
    teal300: '#57c7c7',
    teal400: '#30b5b5',
    teal500: '#18a5a5',
    teal600: '#109494',
    teal700: '#0c8383',
    teal800: '#097777',
    teal900: '#076464',

    grey50: '#F9FAFB',
    grey100: '#F2F4F6',
    grey200: '#e5e8eb',
    grey300: '#d1d6db',
    grey400: '#afb7c0',
    grey500: '#8c95a1',
    grey600: '#6c7684',
    grey700: '#4f5a69',
    grey800: '#333d48',
    grey900: '#1a2029',

    greyOpactiy50: 'rgba(0, 23, 51, 0.02)',
    greyOpactiy100: 'rgba(2, 32, 71, 0.05)',
    greyOpactiy200: 'rgba(0, 27, 55, 0.1)',
    greyOpactiy300: 'rgba(0, 29, 58, 0.18)',
    greyOpactiy400: 'rgba(0, 25, 54, 0.31)',
    greyOpactiy500: 'rgba(3, 24, 50, 0.46)',
    greyOpactiy600: 'rgba(0, 19, 43, 0.58)',
    greyOpactiy700: 'rgba(3, 18, 40, 0.70)',
    greyOpactiy800: 'rgba(0, 12, 31, 0.80)',
    greyOpactiy900: 'rgba(2, 9, 19, 0.91)',

    whiteOpactiy50: 'rgba(209, 209, 253, 0.05)',
    whiteOpactiy100: 'rgba(217, 217, 255, 0.11)',
    whiteOpactiy200: 'rgba(222, 222, 255, 0.19)',
    whiteOpactiy300: 'rgba(224, 224, 255, 0.27)',
    whiteOpactiy400: 'rgba(232, 232, 253, 0.38)',
    whiteOpactiy500: 'rgba(242, 242, 255, 0.47)',
    whiteOpactiy600: 'rgba(248, 248, 255, 0.6)',
    whiteOpactiy700: 'rgba(253, 253, 255, 0.75)',
    whiteOpactiy800: 'rgba(255, 255, 255, 0.89)',
    whiteOpactiy900: '#FFFFFF',
  },
};

export const spacing = {
  /** 4 */
  xs: 4,
  /** 8 */
  sm: 8,
  /** 12 */
  md: 12,
  /** 16 */
  lg: 16,
  /** 20 */
  xl: 20,
  /** 24 */
  xxl: 24,
  /** 32 */
  xxxl: 32,
};

export const borderRadius = {
  /** 8 */
  sm: 8,
  /** 12 */
  md: 12,
  /** 16 */
  lg: 16,
  /** 20 */
  xl: 20,
  /** 24 */
  xxl: 24,
  full: 9999,
};

// Pretendard 폰트 패밀리 매핑
const getFontFamily = (weight: '400' | '500' | '600' | '700') => {
  const fontMap = {
    '400': 'Pretendard-Regular',
    '500': 'Pretendard-Medium',
    '600': 'Pretendard-SemiBold',
    '700': 'Pretendard-Bold',
  };
  return fontMap[weight];
};

// iOS에서 폰트가 약간 작게 보이므로 1.05 스케일 적용
const fontScale = Platform.OS === 'ios' ? 1.06 : 1;

const scaleFontSize = (size: number) => Math.round(size * fontScale);

export const typography = {
  fontFamily: {
    regular: 'Pretendard-Regular',
    medium: 'Pretendard-Medium',
    semibold: 'Pretendard-SemiBold',
    bold: 'Pretendard-Bold',
  },
  fontWeight: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
  // 재사용 가능한 텍스트 스타일 프리셋
  styles: {
    /** t1 - 매우 큰 제목 (30) */
    t1: {
      fontFamily: 'Pretendard-Regular',
      fontSize: scaleFontSize(30),
      fontWeight: '400' as const,
      lineHeight: scaleFontSize(30 * 1.5),
    },
    /** t1 - 매우 큰 제목 (30) */
    t1Medium: {
      fontFamily: 'Pretendard-Medium',
      fontSize: scaleFontSize(30),
      fontWeight: '500' as const,
      lineHeight: scaleFontSize(30 * 1.5),
    },
    /** t1 - 매우 큰 제목 (30) */
    t1Semibold: {
      fontFamily: 'Pretendard-SemiBold',
      fontSize: scaleFontSize(30),
      fontWeight: '600' as const,
      lineHeight: scaleFontSize(30 * 1.5),
    },
    /** t1 - 매우 큰 제목 (30) */
    t1Bold: {
      fontFamily: 'Pretendard-Bold',
      fontSize: scaleFontSize(30),
      fontWeight: '700' as const,
      lineHeight: scaleFontSize(30 * 1.5),
    },
    /** t2 - 큰 제목 (26) */
    t2: {
      fontFamily: 'Pretendard-Regular',
      fontSize: scaleFontSize(26),
      fontWeight: '400' as const,
      lineHeight: scaleFontSize(26 * 1.5),
    },
    /** t2 - 큰 제목 (26) */
    t2Medium: {
      fontFamily: 'Pretendard-Medium',
      fontSize: scaleFontSize(26),
      fontWeight: '500' as const,
      lineHeight: scaleFontSize(26 * 1.5),
    },
    /** t2 - 큰 제목 (26) */
    t2Semibold: {
      fontFamily: 'Pretendard-SemiBold',
      fontSize: scaleFontSize(26),
      fontWeight: '600' as const,
      lineHeight: scaleFontSize(26 * 1.5),
    },
    /** t2 - 큰 제목 (26) */
    t2Bold: {
      fontFamily: 'Pretendard-Bold',
      fontSize: scaleFontSize(26),
      fontWeight: '700' as const,
      lineHeight: scaleFontSize(26 * 1.5),
    },
    /** st5 - 조금 큰 제목 (24) */
    st5: {
      fontFamily: 'Pretendard-Regular',
      fontSize: scaleFontSize(24),
      fontWeight: '400' as const,
      lineHeight: scaleFontSize(24 * 1.5),
    },
    /** st5 - 조금 큰 제목 (24) */
    st5Medium: {
      fontFamily: 'Pretendard-Medium',
      fontSize: scaleFontSize(24),
      fontWeight: '500' as const,
      lineHeight: scaleFontSize(24 * 1.5),
    },
    /** st5 - 조금 큰 제목 (24) */
    st5Semibold: {
      fontFamily: 'Pretendard-SemiBold',
      fontSize: scaleFontSize(24),
      fontWeight: '600' as const,
      lineHeight: scaleFontSize(24 * 1.5),
    },
    /** st5 - 조금 큰 제목 (24) */
    st5Bold: {
      fontFamily: 'Pretendard-Bold',
      fontSize: scaleFontSize(24),
      fontWeight: '700' as const,
      lineHeight: scaleFontSize(24 * 1.5),
    },
    /** t3 - 일반 제목 (22) */
    t3: {
      fontFamily: 'Pretendard-Regular',
      fontSize: scaleFontSize(22),
      fontWeight: '400' as const,
      lineHeight: scaleFontSize(22 * 1.5),
    },
    /** t3 - 일반 제목 (22) */
    t3Medium: {
      fontFamily: 'Pretendard-Medium',
      fontSize: scaleFontSize(22),
      fontWeight: '500' as const,
      lineHeight: scaleFontSize(22 * 1.5),
    },
    /** t3 - 일반 제목 (22) */
    t3Semibold: {
      fontFamily: 'Pretendard-SemiBold',
      fontSize: scaleFontSize(22),
      fontWeight: '600' as const,
      lineHeight: scaleFontSize(22 * 1.5),
    },
    /** t3 - 일반 제목 (22) */
    t3Bold: {
      fontFamily: 'Pretendard-Bold',
      fontSize: scaleFontSize(22),
      fontWeight: '700' as const,
      lineHeight: scaleFontSize(22 * 1.5),
    },
    /** t4 - 작은 제목 (20) */
    t4: {
      fontFamily: 'Pretendard-Regular',
      fontSize: scaleFontSize(20),
      fontWeight: '400' as const,
      lineHeight: scaleFontSize(20 * 1.5),
    },
    /** t4 - 작은 제목 (20) */
    t4Medium: {
      fontFamily: 'Pretendard-Medium',
      fontSize: scaleFontSize(20),
      fontWeight: '500' as const,
      lineHeight: scaleFontSize(20 * 1.5),
    },
    /** t4 - 작은 제목 (20) */
    t4Semibold: {
      fontFamily: 'Pretendard-SemiBold',
      fontSize: scaleFontSize(20),
      fontWeight: '600' as const,
      lineHeight: scaleFontSize(20 * 1.5),
    },
    /** t4 - 작은 제목 (20) */
    t4Bold: {
      fontFamily: 'Pretendard-Bold',
      fontSize: scaleFontSize(20),
      fontWeight: '700' as const,
      lineHeight: scaleFontSize(20 * 1.5),
    },
    /** st8 - 조금 큰 본문 (19) */
    st8: {
      fontFamily: 'Pretendard-Regular',
      fontSize: scaleFontSize(19),
      fontWeight: '400' as const,
      lineHeight: scaleFontSize(19 * 1.5),
    },
    /** st8 - 조금 큰 본문 (19) */
    st8Medium: {
      fontFamily: 'Pretendard-Medium',
      fontSize: scaleFontSize(19),
      fontWeight: '500' as const,
      lineHeight: scaleFontSize(19 * 1.5),
    },
    /** st8 - 조금 큰 본문 (19) */
    st8Semibold: {
      fontFamily: 'Pretendard-SemiBold',
      fontSize: scaleFontSize(19),
      fontWeight: '600' as const,
      lineHeight: scaleFontSize(19 * 1.5),
    },
    /** st8 - 조금 큰 본문 (19) */
    st8Bold: {
      fontFamily: 'Pretendard-Bold',
      fontSize: scaleFontSize(19),
      fontWeight: '700' as const,
      lineHeight: scaleFontSize(19 * 1.5),
    },
    /** t5 - 일반 본문 (17) */
    t5: {
      fontFamily: 'Pretendard-Regular',
      fontSize: scaleFontSize(17),
      fontWeight: '400' as const,
      lineHeight: scaleFontSize(17 * 1.5),
    },
    /** t5 - 일반 본문 (17) */
    t5Medium: {
      fontFamily: 'Pretendard-Medium',
      fontSize: scaleFontSize(17),
      fontWeight: '500' as const,
      lineHeight: scaleFontSize(17 * 1.5),
    },
    /** t5 - 일반 본문 (17) */
    t5Semibold: {
      fontFamily: 'Pretendard-SemiBold',
      fontSize: scaleFontSize(17),
      fontWeight: '600' as const,
      lineHeight: scaleFontSize(17 * 1.5),
    },
    /** t5 - 일반 본문 (17) */
    t5Bold: {
      fontFamily: 'Pretendard-Bold',
      fontSize: scaleFontSize(17),
      fontWeight: '700' as const,
      lineHeight: scaleFontSize(17 * 1.5),
    },
    /** t6 - 작은 본문 (15) */
    t6: {
      fontFamily: 'Pretendard-Regular',
      fontSize: scaleFontSize(15),
      fontWeight: '400' as const,
      lineHeight: scaleFontSize(15 * 1.5),
    },
    /** t6 - 작은 본문 (15) */
    t6Medium: {
      fontFamily: 'Pretendard-Medium',
      fontSize: scaleFontSize(15),
      fontWeight: '500' as const,
      lineHeight: scaleFontSize(15 * 1.5),
    },
    /** t6 - 작은 본문 (15) */
    t6Semibold: {
      fontFamily: 'Pretendard-SemiBold',
      fontSize: scaleFontSize(15),
      fontWeight: '600' as const,
      lineHeight: scaleFontSize(15 * 1.5),
    },
    /** t6 - 작은 본문 (15) */
    t6Bold: {
      fontFamily: 'Pretendard-Bold',
      fontSize: scaleFontSize(15),
      fontWeight: '700' as const,
      lineHeight: scaleFontSize(15 * 1.5),
    },
    /** t7 - 안 읽어도 됨 (13) */
    t7: {
      fontFamily: 'Pretendard-Regular',
      fontSize: scaleFontSize(13),
      fontWeight: '400' as const,
      lineHeight: scaleFontSize(13 * 1.5),
    },
    /** t7 - 안 읽어도 됨 (13) */
    t7Medium: {
      fontFamily: 'Pretendard-Medium',
      fontSize: scaleFontSize(13),
      fontWeight: '500' as const,
      lineHeight: scaleFontSize(13 * 1.5),
    },
    /** t7 - 안 읽어도 됨 (13) */
    t7Semibold: {
      fontFamily: 'Pretendard-SemiBold',
      fontSize: scaleFontSize(13),
      fontWeight: '600' as const,
      lineHeight: scaleFontSize(13 * 1.5),
    },
    /** t7 - 안 읽어도 됨 (13) */
    t7Bold: {
      fontFamily: 'Pretendard-Bold',
      fontSize: scaleFontSize(13),
      fontWeight: '700' as const,
      lineHeight: scaleFontSize(13 * 1.5),
    },

    /** t8 - (11) */
    t8Medium: {
      fontFamily: 'Pretendard-Medium',
      fontSize: scaleFontSize(11),
      fontWeight: '500' as const,
      lineHeight: scaleFontSize(11 * 1.5),
    },

    /** t11 - (14) */
    t11Bold: {
      fontFamily: 'Pretendard-Medium',
      fontSize: scaleFontSize(14),
      fontWeight: '700' as const,
      lineHeight: scaleFontSize(14 * 1.5),
    },

    /** t12 - (12) */
    t12Bold: {
      fontFamily: 'Pretendard-Medium',
      fontSize: scaleFontSize(12),
      fontWeight: '700' as const,
      lineHeight: scaleFontSize(12 * 1.5),
    },
  } satisfies Record<string, TextStyle>,
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [themePreference, setThemePreference] = useState<ThemeMode>('system');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(THEME_KEY);
        setThemePreference((saved as ThemeMode) || 'system');
      } catch {
        setThemePreference('system');
      } finally {
        setReady(true);
      }
    })();
  }, []);

  // 아직 로드 안됐으면 children 렌더링하지 않음
  if (!ready || themePreference === null) {
    return null;
  }

  // useEffect(() => {
  //   loadThemePreference();
  // }, []);

  // async function loadThemePreference() {
  //   try {
  //     const saved = await AsyncStorage.getItem(THEME_KEY);
  //     if (saved) {
  //       setThemePreference(saved as ThemeMode);
  //     }
  //   } catch (error) {
  //     console.error('Error loading theme preference:', error);
  //   }
  // }

  const isDark = themePreference === 'system' ? systemColorScheme === 'dark' : themePreference === 'dark';

  const colors = isDark ? Colors.dark : Colors.light;

  async function setTheme(mode: ThemeMode) {
    try {
      await AsyncStorage.setItem(THEME_KEY, mode);
      setThemePreference(mode);
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  }

  const value: ThemeContextType = {
    colors,
    isDark,
    themePreference,
    setTheme,
    spacing,
    borderRadius,
    typography,
    shadows,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
