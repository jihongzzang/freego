import { useColorScheme } from 'react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_KEY = '@theme_preference';

export type ThemeMode = 'system' | 'light' | 'dark';

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
    primary: '#0064FF',
    primaryLight: '#E8F3FF',
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
  full: 9999,
};

export const typography = {
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 28,
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

export function useTheme() {
  const systemColorScheme = useColorScheme();
  const [themePreference, setThemePreference] = useState<ThemeMode>('system');

  useEffect(() => {
    loadThemePreference();
  }, []);

  async function loadThemePreference() {
    try {
      const saved = await AsyncStorage.getItem(THEME_KEY);
      if (saved) {
        setThemePreference(saved as ThemeMode);
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
    }
  }

  const isDark = themePreference === 'system'
    ? systemColorScheme === 'dark'
    : themePreference === 'dark';

  const colors = isDark ? Colors.dark : Colors.light;

  async function setTheme(mode: ThemeMode) {
    try {
      await AsyncStorage.setItem(THEME_KEY, mode);
      setThemePreference(mode);
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  }

  return {
    colors,
    isDark,
    themePreference,
    setTheme,
    spacing,
    borderRadius,
    typography,
    shadows,
  };
}

export function getStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    '신선': '#10B981',
    '주의': '#F59E0B',
    '임박': '#F04452',
    '만료': '#9CA3AF',
  };
  return statusColors[status] || '#6B7280';
}

export function getCategoryColor(category: string): string {
  const categoryColors: Record<string, string> = {
    '채소': '#10B981',
    '과일': '#F59E0B',
    '육류': '#EF4444',
    '유제품': '#3B82F6',
    '기타': '#6B7280',
  };
  return categoryColors[category] || '#6B7280';
}

export function getStorageColor(location: string): string {
  const storageColors: Record<string, string> = {
    '냉장실': '#3B82F6',
    '냉동실': '#8B5CF6',
    '실온': '#10B981',
  };
  return storageColors[location] || '#6B7280';
}
