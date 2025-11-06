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
  border: string;
  borderLight: string;
  overlay: string;
};

export const Colors: Record<'light' | 'dark', ColorPalette> = {
  light: {
    background: '#F9FAFB',
    surface: '#FFFFFF',
    surfaceSecondary: '#F2F4F6',
    primary: '#2563EB',
    primaryLight: '#EFF6FF',
    secondary: '#FF6B00',
    secondaryLight: '#FFF5E6',
    danger: '#F04452',
    dangerLight: '#FFF5F5',
    success: '#10B981',
    successLight: '#D1FAE5',
    warning: '#F59E0B',
    warningLight: '#FEF3C7',
    text: '#191F28',
    textSecondary: '#4E5968',
    textTertiary: '#9CA3AF',
    border: '#E5E7EB',
    borderLight: '#F2F4F6',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
  dark: {
    background: '#121212',
    surface: '#1E1E1E',
    surfaceSecondary: '#2C2C2C',
    primary: '#3D8BFF',
    primaryLight: '#1A3A5C',
    secondary: '#FF8C3D',
    secondaryLight: '#3D2A1A',
    danger: '#FF5C6C',
    dangerLight: '#3D1A1F',
    success: '#34D399',
    successLight: '#1A3A2C',
    warning: '#FBBF24',
    warningLight: '#3D2F1A',
    text: '#F9FAFB',
    textSecondary: '#B4B9C1',
    textTertiary: '#6B7280',
    border: '#3D3D3D',
    borderLight: '#2C2C2C',
    overlay: 'rgba(0, 0, 0, 0.7)',
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
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
  fontSize: {
    xs: scaleFontSize(12),
    sm: scaleFontSize(14),
    md: scaleFontSize(16),
    lg: scaleFontSize(18),
    xl: scaleFontSize(20),
    xxl: scaleFontSize(24),
    xxxl: scaleFontSize(28),
    huge: scaleFontSize(32),
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
    // 헤딩 스타일
    h1: {
      fontFamily: 'Pretendard-Bold',
      fontSize: scaleFontSize(32),
      fontWeight: '700' as const,
      lineHeight: scaleFontSize(38),
    },
    h2: {
      fontFamily: 'Pretendard-Bold',
      fontSize: scaleFontSize(28),
      fontWeight: '700' as const,
      lineHeight: scaleFontSize(34),
    },
    h3: {
      fontFamily: 'Pretendard-SemiBold',
      fontSize: scaleFontSize(24),
      fontWeight: '600' as const,
      lineHeight: scaleFontSize(29),
    },
    h4: {
      fontFamily: 'Pretendard-SemiBold',
      fontSize: scaleFontSize(20),
      fontWeight: '600' as const,
      lineHeight: scaleFontSize(24),
    },
    h5: {
      fontFamily: 'Pretendard-SemiBold',
      fontSize: scaleFontSize(18),
      fontWeight: '600' as const,
      lineHeight: scaleFontSize(22),
    },
    h6: {
      fontFamily: 'Pretendard-SemiBold',
      fontSize: scaleFontSize(16),
      fontWeight: '600' as const,
      lineHeight: scaleFontSize(19),
    },
    // 본문 스타일
    body: {
      fontFamily: 'Pretendard-Regular',
      fontSize: scaleFontSize(16),
      fontWeight: '400' as const,
      lineHeight: scaleFontSize(24),
    },
    bodyMedium: {
      fontFamily: 'Pretendard-Medium',
      fontSize: scaleFontSize(16),
      fontWeight: '500' as const,
      lineHeight: scaleFontSize(24),
    },
    bodySemibold: {
      fontFamily: 'Pretendard-SemiBold',
      fontSize: scaleFontSize(16),
      fontWeight: '600' as const,
      lineHeight: scaleFontSize(24),
    },
    bodySmall: {
      fontFamily: 'Pretendard-Regular',
      fontSize: scaleFontSize(14),
      fontWeight: '400' as const,
      lineHeight: scaleFontSize(21),
    },
    bodySmallMedium: {
      fontFamily: 'Pretendard-Medium',
      fontSize: scaleFontSize(14),
      fontWeight: '500' as const,
      lineHeight: scaleFontSize(21),
    },
    // 캡션 스타일
    caption: {
      fontFamily: 'Pretendard-Regular',
      fontSize: scaleFontSize(12),
      fontWeight: '400' as const,
      lineHeight: scaleFontSize(18),
    },
    captionMedium: {
      fontFamily: 'Pretendard-Medium',
      fontSize: scaleFontSize(12),
      fontWeight: '500' as const,
      lineHeight: scaleFontSize(18),
    },
    captionBold: {
      fontFamily: 'Pretendard-Bold',
      fontSize: scaleFontSize(12),
      fontWeight: '700' as const,
      lineHeight: scaleFontSize(18),
    },
    // 버튼 스타일
    button: {
      fontFamily: 'Pretendard-SemiBold',
      fontSize: scaleFontSize(16),
      fontWeight: '600' as const,
      lineHeight: scaleFontSize(19),
    },
    buttonSmall: {
      fontFamily: 'Pretendard-SemiBold',
      fontSize: scaleFontSize(14),
      fontWeight: '600' as const,
      lineHeight: scaleFontSize(17),
    },
    // 라벨 스타일
    label: {
      fontFamily: 'Pretendard-Medium',
      fontSize: scaleFontSize(14),
      fontWeight: '500' as const,
      lineHeight: scaleFontSize(17),
    },
    labelSmall: {
      fontFamily: 'Pretendard-Medium',
      fontSize: scaleFontSize(12),
      fontWeight: '500' as const,
      lineHeight: scaleFontSize(14),
    },
    // 오버라인 (작은 강조 텍스트)
    overline: {
      fontFamily: 'Pretendard-SemiBold',
      fontSize: scaleFontSize(10),
      fontWeight: '600' as const,
      lineHeight: scaleFontSize(12),
      textTransform: 'uppercase' as const,
      letterSpacing: 1,
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
