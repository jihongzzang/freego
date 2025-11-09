import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { hasCompletedOnboarding } from '@/mvi/features/onboarding/middleware';

export default function Index() {
  const [isChecking, setIsChecking] = useState(true);
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);

  useEffect(() => {
    async function checkOnboarding() {
      const completed = await hasCompletedOnboarding();
      setIsOnboardingComplete(completed);
      setIsChecking(false);
    }
    checkOnboarding();
  }, []);

  if (isChecking) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // return <Redirect href={isOnboardingComplete ? '/(tabs)' : '/onboarding'} />;
  return <Redirect href={'/onboarding'} />;
}
