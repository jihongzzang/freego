import { useEffect } from 'react';
import { BackHandler } from 'react-native';
import { useSharedValue, withSpring } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { Gesture } from 'react-native-gesture-handler';
import { useMVIStore } from '@/mvi/base';
import { createOnboardingStore } from '@/mvi/features/onboarding';
import { useRouter } from '@/hooks/useRouter';
import { useToast } from '@/components/ui';

export function useOnboardingLogic(width: number, stepsLength: number) {
  const [state, dispatch, effect] = useMVIStore(createOnboardingStore);
  const { showToast } = useToast();

  const translateX = useSharedValue(0);

  const router = useRouter();

  useEffect(() => {
    if (!effect) return;

    switch (effect.type) {
      case 'NAVIGATE_TO_HOME':
        router.replace('/(tabs)');
        break;
      case 'SHOW_TOAST':
        showToast({
          message: effect.payload.message,
          type: effect.payload.variant,
        });
        break;
    }
  }, [effect, router, showToast]);

  useEffect(() => {
    translateX.value = withSpring(-state.currentStep * width);
  }, [state.currentStep]);

  useEffect(() => {
    if (!state.showPackageChoice || !state.selectedLifestyle) return;

    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      dispatch({ type: 'SELECT_LIFESTYLE', payload: null as any });
      return true;
    });

    return () => backHandler.remove();
  }, [state.showPackageChoice, state.selectedLifestyle]);

  // Handlers
  const handleNext = () => {
    if (state.currentStep === stepsLength - 1) {
      dispatch({ type: 'SHOW_PACKAGE_CHOICE' });
    } else {
      dispatch({ type: 'NEXT_STEP' });
    }
  };

  const handlePrevious = () => {
    if (state.currentStep > 0) {
      dispatch({ type: 'PREVIOUS_STEP' });
    }
  };

  const handleSkip = () => {
    dispatch({ type: 'SHOW_PACKAGE_CHOICE' });
  };

  const handleSelectLifestyle = (lifestyleId: string) => {
    dispatch({ type: 'SELECT_LIFESTYLE', payload: lifestyleId });
  };

  const handleAddPackage = () => {
    dispatch({ type: 'ADD_STARTER_PACKAGE' });
  };

  const handleSkipPackage = () => {
    dispatch({ type: 'SKIP_PACKAGE' });
  };

  const handleBackFromConfirm = () => {
    dispatch({ type: 'SELECT_LIFESTYLE', payload: null as any });
  };

  // Swipe gesture
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      const basePosition = -state.currentStep * width;
      let newTranslation = event.translationX;

      // 첫 번째 스텝에서 오른쪽 스와이프 제한
      if (state.currentStep === 0 && newTranslation > 0) {
        newTranslation = 0;
      }

      // 마지막 스텝에서 왼쪽 스와이프 제한
      if (state.currentStep === stepsLength - 1 && newTranslation < 0) {
        newTranslation = 0;
      }

      translateX.value = basePosition + newTranslation;
    })
    .onEnd((event) => {
      const shouldGoNext = event.translationX < -width * 0.2 && state.currentStep < stepsLength - 1;
      const shouldGoPrev = event.translationX > width * 0.2 && state.currentStep > 0;

      if (shouldGoNext) {
        scheduleOnRN(handleNext);
      } else if (shouldGoPrev) {
        scheduleOnRN(handlePrevious);
      } else {
        // Snap back to current position
        translateX.value = withSpring(-state.currentStep * width);
      }
    });

  return {
    state,
    translateX,
    panGesture,
    handlers: {
      handleNext,
      handlePrevious,
      handleSkip,
      handleSelectLifestyle,
      handleAddPackage,
      handleSkipPackage,
      handleBackFromConfirm,
    },
  };
}
