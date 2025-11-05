import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useEffect, useMemo } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import {
  GestureDetector,
  Gesture,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import {
  // ChevronRight,
  Refrigerator,
  ShoppingCart,
  TrendingDown,
  Sparkles,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/lib/theme';
import { useMVIStore } from '@/mvi/base';
import { createOnboardingStore } from '@/mvi/features/onboarding';
import { useRouter } from '@/hooks/useRouter';

const { width } = Dimensions.get('window');

interface OnboardingStep {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

export default function OnboardingScreen() {
  const { typography, spacing, borderRadius, shadows } = useTheme();
  const [state, dispatch, effect] = useMVIStore(createOnboardingStore);
  const insets = useSafeAreaInsets();
  const translateX = useSharedValue(0);
  const router = useRouter();

  const styles = useMemo(
    () => createStyles({ spacing, borderRadius, shadows }),
    [spacing, borderRadius, shadows],
  );

  const steps: OnboardingStep[] = [
    {
      icon: <Refrigerator size={80} color="#ffffff" />,
      title: '냉장고를 스마트하게',
      description: '식재료를 체계적으로 관리하고\n유통기한을 놓치지 마세요',
      color: '#10b981',
    },
    {
      icon: <TrendingDown size={80} color="#ffffff" />,
      title: '음식물 쓰레기 줄이기',
      description: '소비 패턴을 분석하고\n낭비를 최소화 해요',
      color: '#3b82f6',
    },
    {
      icon: <ShoppingCart size={80} color="#ffffff" />,
      title: '장보기도 간편하게',
      description: '다 떨어진 재료는 손쉽게\n장보기 목록에 추가해요',
      color: '#f59e0b',
    },
    {
      icon: <Sparkles size={80} color="#ffffff" />,
      title: '시작해볼까요?',
      description:
        '현명한 소비 습관을 만들고\n지구를 지키는 작은 실천을 시작해요',
      color: '#8b5cf6',
    },
  ];

  // Handle effects
  useEffect(() => {
    console.log('Effect changed:', effect);
    if (!effect) return;

    if (effect.type === 'NAVIGATE_TO_HOME') {
      console.log('Navigating to home...');
      router.replace('/(tabs)');
    }
  }, [effect]);

  // Animate to current step when step changes
  useEffect(() => {
    translateX.value = withSpring(-state.currentStep * width);
  }, [state.currentStep]);

  function handleNext() {
    console.log(
      'handleNext called, currentStep:',
      state.currentStep,
      'totalSteps:',
      state.totalSteps,
    );
    dispatch({ type: 'NEXT_STEP' });
  }

  function handlePrevious() {
    if (state.currentStep > 0) {
      dispatch({ type: 'PREVIOUS_STEP' });
    }
  }

  function handleSkip() {
    dispatch({ type: 'SKIP_ONBOARDING' });
  }

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
      if (state.currentStep === steps.length - 1 && newTranslation < 0) {
        newTranslation = 0;
      }

      translateX.value = basePosition + newTranslation;
    })
    .onEnd((event) => {
      const shouldGoNext =
        event.translationX < -width * 0.2 &&
        state.currentStep < steps.length - 1;
      const shouldGoPrev =
        event.translationX > width * 0.2 && state.currentStep > 0;

      if (shouldGoNext) {
        scheduleOnRN(handleNext);
      } else if (shouldGoPrev) {
        scheduleOnRN(handlePrevious);
      } else {
        // Snap back to current position
        translateX.value = withSpring(-state.currentStep * width);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const currentStep = steps[state.currentStep];

  return (
    <GestureHandlerRootView style={styles.container}>
      <LinearGradient
        colors={[currentStep.color, currentStep.color + 'dd']}
        style={styles.gradient}
      >
        {/* 상단 고정: 건너뛰기 버튼 */}
        {state.currentStep < steps.length - 1 && (
          <TouchableOpacity
            style={[styles.skipButton, { top: insets.top + 10 }]}
            onPress={handleSkip}
          >
            <Text style={[typography.styles.bodySemibold, styles.skipText]}>
              건너뛰기
            </Text>
          </TouchableOpacity>
        )}

        {/* 가운데 컨텐츠: 캐러셀 */}
        <GestureDetector gesture={panGesture}>
          <View style={styles.contentWrapper}>
            <Animated.View style={[styles.carouselContainer, animatedStyle]}>
              {steps.map((step, index) => (
                <View key={index} style={[styles.slideContent, { width }]}>
                  <View style={styles.iconContainer}>{step.icon}</View>

                  <View style={styles.textContainer}>
                    <Text style={[typography.styles.h1, styles.title]}>
                      {step.title}
                    </Text>
                    <Text style={[typography.styles.h5, styles.description]}>
                      {step.description}
                    </Text>
                  </View>
                </View>
              ))}
            </Animated.View>
          </View>
        </GestureDetector>

        {/* 하단 고정: pagination과 버튼 */}
        <View style={styles.footer}>
          <View style={styles.pagination}>
            {steps.map((_, dotIndex) => (
              <View
                key={dotIndex}
                style={[
                  styles.paginationDot,
                  dotIndex === state.currentStep && styles.paginationDotActive,
                ]}
              />
            ))}
          </View>

          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleNext}
            activeOpacity={0.8}
          >
            <Text style={[typography.styles.h5, styles.nextButtonText]}>
              {state.currentStep < steps.length - 1 ? '다음' : '시작하기'}
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </GestureHandlerRootView>
  );
}

const createStyles = ({
  spacing,
  borderRadius,
  shadows,
}: {
  spacing: typeof import('@/lib/theme').spacing;
  borderRadius: typeof import('@/lib/theme').borderRadius;
  shadows: typeof import('@/lib/theme').shadows;
}) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    gradient: {
      flex: 1,
    },
    skipButton: {
      position: 'absolute',
      right: spacing.xl,
      zIndex: 10,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.lg,
    },
    skipText: {
      color: '#ffffff',
      opacity: 0.9,
    },
    contentWrapper: {
      flex: 1,
      overflow: 'hidden',
      width: width,
    },
    carouselContainer: {
      flexDirection: 'row',
      height: '100%',
    },
    slideContent: {
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 40,
      height: '100%',
    },
    iconContainer: {
      marginBottom: 60,
      alignItems: 'center',
      justifyContent: 'center',
    },
    textContainer: {
      alignItems: 'center',
    },
    title: {
      color: '#ffffff',
      textAlign: 'center',
      marginBottom: spacing.lg,
    },
    description: {
      color: '#ffffff',
      textAlign: 'center',
      opacity: 0.95,
    },
    footer: {
      position: 'absolute',
      bottom: 60,
      left: 40,
      right: 40,
      alignItems: 'center',
      gap: spacing.xxxl,
    },
    pagination: {
      flexDirection: 'row',
      gap: spacing.sm,
    },
    paginationDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: '#ffffff',
      opacity: 0.3,
    },
    paginationDotActive: {
      width: 24,
      opacity: 1,
    },
    nextButton: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#ffffff',
      paddingVertical: spacing.lg,
      paddingHorizontal: spacing.xxxl,
      borderRadius: borderRadius.lg,
      gap: spacing.sm,
      minWidth: 160,
      ...shadows.lg,
    },
    nextButtonText: {},
  });
