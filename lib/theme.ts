import { useColorScheme } from 'react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_KEY = '@theme_preference';

export const Colors = {
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
    success: '#0064FF',
    successLight: '#E8F3FF',
    text: '#191F28',
    textSecondary: '#4E5968',
    textTertiary: '#9CA3AF',
    border: '#E5E7EB',
    borderLight: '#F2F4F6',
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
    success: '#3D8BFF',
    successLight: '#1A3A5C',
    text: '#F9FAFB',
    textSecondary: '#B4B9C1',
    textTertiary: '#6B7280',
    border: '#3D3D3D',
    borderLight: '#2C2C2C',
  },
};

export function useTheme() {
  const systemColorScheme = useColorScheme();
  const [themePreference, setThemePreference] = useState<'system' | 'light' | 'dark'>('system');

  useEffect(() => {
    loadThemePreference();
  }, []);

  async function loadThemePreference() {
    try {
      const saved = await AsyncStorage.getItem(THEME_KEY);
      if (saved) {
        setThemePreference(saved as 'system' | 'light' | 'dark');
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
    }
  }

  const isDark = themePreference === 'system'
    ? systemColorScheme === 'dark'
    : themePreference === 'dark';

  const colors = isDark ? Colors.dark : Colors.light;

  async function setTheme(mode: 'system' | 'light' | 'dark') {
    try {
      await AsyncStorage.setItem(THEME_KEY, mode);
      setThemePreference(mode);
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  }

  return { colors, isDark, themePreference, setTheme };
}
