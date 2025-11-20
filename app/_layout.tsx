import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';

// This is the default configuration
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false, // Reanimated runs in strict mode by default
});

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useFonts } from '@/hooks/useFonts';
import { ThemeProvider, useTheme } from '@/lib/theme';
import { DialogProvider } from '@/contexts/DialogContext';
import { ToastProvider } from '@/components/ui';
import { KeyboardProvider } from 'react-native-keyboard-controller';

// 스플래시 화면 자동 숨김 방지
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  initialRouteName: 'index',
};

function RootStack() {
  const { isDark, colors } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: 'default',
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </View>
  );
}

export default function RootLayout() {
  useFrameworkReady();
  const fontsLoaded = useFonts();

  // 폰트 로드 후 최소 1초 대기 후 스플래시 화면 숨김
  useEffect(() => {
    if (fontsLoaded) {
      const timer = setTimeout(() => {
        SplashScreen.hideAsync();
      }, 1000); // 1초 대기 (원하는 시간으로 조절)

      return () => clearTimeout(timer);
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <KeyboardProvider>
      <ThemeProvider>
        <ToastProvider>
          <DialogProvider>
            <RootStack />
          </DialogProvider>
        </ToastProvider>
      </ThemeProvider>
    </KeyboardProvider>
  );
}
