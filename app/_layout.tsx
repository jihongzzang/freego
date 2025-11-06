import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useFonts } from '@/hooks/useFonts';
import { hasCompletedOnboarding } from '@/mvi/features/onboarding/middleware';
import { ThemeProvider, useTheme } from '@/lib/theme';
import { DialogProvider } from '@/contexts/DialogContext';

function RootStack({ isOnboardingComplete }: { isOnboardingComplete: boolean }) {
  const { isDark, colors } = useTheme();

  return (
    <DialogProvider>
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <Stack
          // initialRouteName={isOnboardingComplete ? '(tabs)' : 'onboarding'}
          initialRouteName="onboarding"
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
  const [isOnboardingChecked, setIsOnboardingChecked] = useState(false);
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);

  useEffect(() => {
    async function checkOnboarding() {
      const completed = await hasCompletedOnboarding();
      setIsOnboardingComplete(completed);
      setIsOnboardingChecked(true);
    }
    checkOnboarding();
  }, []);

  if (!fontsLoaded || !isOnboardingChecked) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ThemeProvider>
      <DialogProvider>
        <RootStack isOnboardingComplete={isOnboardingComplete} />
      </DialogProvider>
    </ThemeProvider>
  );
}
