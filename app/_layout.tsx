import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useFonts } from '@/hooks/useFonts';
import { hasCompletedOnboarding } from '@/mvi/features/onboarding/middleware';
import { ThemeProvider, useTheme } from '@/lib/theme';
import { DialogProvider } from '@/contexts/DialogContext';

function RootStack() {
  const { isDark, colors } = useTheme();
  const router = useRouter();
  const segments = useSegments();
  const [isOnboardingChecked, setIsOnboardingChecked] = useState(false);

  useEffect(() => {
    async function checkOnboarding() {
      const completed = await hasCompletedOnboarding();
      setIsOnboardingChecked(true);

      // 현재 세그먼트가 비어있고 (최초 로드) 온보딩 완료했으면 홈으로
      if (segments.length === 0) {
        if (completed) {
          router.replace('/(tabs)');
        } else {
          router.replace('/onboarding');
        }
      }
    }

    checkOnboarding();
  }, []);

  if (!isOnboardingChecked) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <DialogProvider>
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.background },
            animation: 'default',
          }}
        >
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style={isDark ? 'light' : 'dark'} />
      </View>
    </DialogProvider>
  );
}

export default function RootLayout() {
  useFrameworkReady();
  const fontsLoaded = useFonts();

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ThemeProvider>
      <DialogProvider>
        <RootStack />
      </DialogProvider>
    </ThemeProvider>
  );
}
