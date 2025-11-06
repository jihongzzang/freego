import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView, BackHandler } from 'react-native';
import { useEffect, useMemo } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { GestureDetector, Gesture, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { Refrigerator, ShoppingCart, Sparkles } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/lib/theme';
import { useMVIStore } from '@/mvi/base';
import { createOnboardingStore } from '@/mvi/features/onboarding';
import { useRouter } from '@/hooks/useRouter';
import { LIFESTYLE_PACKAGES } from '@/constants/starterPackages';

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

  const styles = useMemo(() => createStyles({ spacing, borderRadius, shadows }), [spacing, borderRadius, shadows]);

  const steps: OnboardingStep[] = [
    {
      icon: <Refrigerator size={80} color="#ffffff" />,
      title: '냉장고를 스마트하게',
      description: '식재료를 체계적으로 관리하고\n유통기한을 놓치지 마세요',
      color: '#10b981',
    },
    {
      icon: <ShoppingCart size={80} color="#ffffff" />,
      title: '장보기도 간편하게',
      description: '다 떨어진 재료는 손쉽게\n장보기 목록에 추가해요',
      // color: '#f59e0b',
      color: '#10b981',
    },
    {
      icon: <Sparkles size={80} color="#ffffff" />,
      title: '시작해볼까요?',
      description: '현명한 소비 습관을 만들고\n지구를 지키는 작은 실천을 시작해요',
      // color: '#8b5cf6',
      color: '#10b981',
    },
  ];

  // Handle effects
  useEffect(() => {
    if (!effect) return;

    if (effect.type === 'NAVIGATE_TO_HOME') {
      router.replace('/(tabs)');
    }
  }, [effect]);

  // Animate to current step when step changes
  useEffect(() => {
    translateX.value = withSpring(-state.currentStep * width);
  }, [state.currentStep]);

  // Handle Android back button for package confirmation screen
  useEffect(() => {
    if (!state.showPackageChoice || !state.selectedLifestyle) return;

    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      dispatch({ type: 'SELECT_LIFESTYLE', payload: null as any });
      return true;
    });

    return () => backHandler.remove();
  }, [state.showPackageChoice, state.selectedLifestyle]);

  function handleNext() {
    // 마지막 온보딩 단계에서 라이프스타일 선택 화면으로
    if (state.currentStep === steps.length - 1) {
      dispatch({ type: 'SHOW_PACKAGE_CHOICE' });
    } else {
      dispatch({ type: 'NEXT_STEP' });
    }
  }

  function handlePrevious() {
    if (state.currentStep > 0) {
      dispatch({ type: 'PREVIOUS_STEP' });
    }
  }

  function handleSkip() {
    dispatch({ type: 'SKIP_ONBOARDING' });
  }

  function handleSelectLifestyle(lifestyleId: string) {
    dispatch({ type: 'SELECT_LIFESTYLE', payload: lifestyleId });
  }

  function handleAddPackage() {
    dispatch({ type: 'ADD_STARTER_PACKAGE' });
  }

  function handleSkipPackage() {
    dispatch({ type: 'SKIP_PACKAGE' });
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
      const shouldGoNext = event.translationX < -width * 0.2 && state.currentStep < steps.length - 1;
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

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const currentStep = steps[state.currentStep];

  // 라이프스타일 선택 화면
  if (state.showPackageChoice) {
    const selectedPackage = state.selectedLifestyle
      ? LIFESTYLE_PACKAGES.find((pkg) => pkg.id === state.selectedLifestyle)
      : null;

    // color: '',
    return (
      <GestureHandlerRootView style={styles.container}>
        <LinearGradient colors={['#10b981', '#10b981']} style={styles.gradient}>
          {!state.selectedLifestyle ? (
            // 1단계: 라이프스타일 선택
            <View style={[styles.packageChoiceContainer, { paddingTop: insets.top + 20 }]}>
              <View style={styles.headerSection}>
                <Text style={[typography.styles.h1, styles.packageTitle]}>"나의 라이프스타일은?"</Text>
                <Text style={[typography.styles.h5, styles.packageDescription]}>
                  "맞춤형 재료 리스트를 만들어드려요"
                </Text>
              </View>

              <ScrollView
                style={styles.lifestyleScrollView}
                contentContainerStyle={styles.lifestyleScrollContent}
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.lifestyleList}>
                  {LIFESTYLE_PACKAGES.map((lifestyle, index) => (
                    <TouchableOpacity
                      key={lifestyle.id}
                      style={[
                        styles.lifestyleCard,
                        {
                          ...shadows.lg,
                        },
                      ]}
                      onPress={() => handleSelectLifestyle(lifestyle.id)}
                      activeOpacity={0.9}
                    >
                      <View style={styles.lifestyleCardLeft}>
                        <View style={styles.lifestyleIconBadge}>
                          <Text style={typography.styles.h3}>{lifestyle.icon}</Text>
                        </View>
                        <View style={styles.lifestyleInfo}>
                          <Text style={[typography.styles.h6, styles.lifestyleLabel]}>{lifestyle.krLabel}</Text>
                          <Text style={[typography.styles.bodySmall, styles.lifestyleDesc]} numberOfLines={2}>
                            {lifestyle.description}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.arrowIcon}>
                        <Text style={[typography.styles.h2, styles.arrowText]}>›</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>

                <TouchableOpacity style={styles.skipPackageButton} onPress={handleSkipPackage} activeOpacity={0.8}>
                  <Text style={[typography.styles.bodySemibold, styles.skipPackageText]}>건너뛰고 직접 등록할게요</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          ) : (
            // 2단계: 패키지 확인 및 등록
            <ScrollView
              contentContainerStyle={[styles.packageChoiceContainer, { paddingTop: insets.top + 20 }]}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.confirmHeaderSection}>
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => dispatch({ type: 'SELECT_LIFESTYLE', payload: null as any })}
                >
                  <Text style={[typography.styles.h1, styles.backButtonText]}>‹</Text>
                </TouchableOpacity>
                <View style={styles.selectedPackageInfo}>
                  <Text style={typography.styles.h3}>{selectedPackage?.icon}</Text>
                  <Text style={[typography.styles.h2, styles.confirmTitle]}>{selectedPackage?.krLabel}</Text>
                </View>
              </View>

              <Text style={[typography.styles.h5, styles.confirmDescription]}>기본 재료를 자동으로 추가할까요?</Text>

              <View style={[styles.ingredientsCard, { ...shadows.lg }]}>
                <View style={styles.ingredientsCardHeader}>
                  <Text style={[typography.styles.bodySemibold, styles.ingredientsCardTitle]}>
                    포함된 재료 {selectedPackage?.ingredients.length}개
                  </Text>
                </View>
                <View style={styles.ingredientsGrid}>
                  {selectedPackage?.ingredients.map((item, index) => (
                    <View key={index} style={styles.ingredientChip}>
                      <Text style={[typography.styles.bodySmall, styles.ingredientChipText]}>{item.name}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.confirmButtons}>
                <TouchableOpacity
                  style={[styles.primaryButton, { ...shadows.lg }]}
                  onPress={handleAddPackage}
                  activeOpacity={0.9}
                >
                  <Text style={[typography.styles.bodySemibold, styles.primaryButtonText]}>
                    네, 자동으로 추가할게요
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.secondaryButton} onPress={handleSkipPackage} activeOpacity={0.9}>
                  <Text style={[typography.styles.body, styles.secondaryButtonText]}>아니요, 직접 등록할게요</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          )}
        </LinearGradient>
      </GestureHandlerRootView>
    );
  }

  // 기존 온보딩 캐러셀
  return (
    <GestureHandlerRootView style={styles.container}>
      <LinearGradient colors={[currentStep.color, currentStep.color + 'dd']} style={styles.gradient}>
        {state.currentStep < steps.length - 1 && (
          <TouchableOpacity style={[styles.skipButton, { top: insets.top + 10 }]} onPress={handleSkip}>
            <Text style={[typography.styles.bodySemibold, styles.skipText]}>건너뛰기</Text>
          </TouchableOpacity>
        )}

        <GestureDetector gesture={panGesture}>
          <View style={styles.contentWrapper}>
            <Animated.View style={[styles.carouselContainer, animatedStyle]}>
              {steps.map((step, index) => (
                <View key={index} style={[styles.slideContent, { width }]}>
                  <View style={styles.iconContainer}>{step.icon}</View>

                  <View style={styles.textContainer}>
                    <Text style={[typography.styles.h1, styles.title]}>{step.title}</Text>
                    <Text style={[typography.styles.h5, styles.description]}>{step.description}</Text>
                  </View>
                </View>
              ))}
            </Animated.View>
          </View>
        </GestureDetector>

        <View style={styles.footer}>
          <View style={styles.pagination}>
            {steps.map((_, dotIndex) => (
              <View
                key={dotIndex}
                style={[styles.paginationDot, dotIndex === state.currentStep && styles.paginationDotActive]}
              />
            ))}
          </View>

          <TouchableOpacity style={styles.nextButton} onPress={handleNext} activeOpacity={0.8}>
            <Text style={[typography.styles.h5, { color: '#4E5968' }]}>
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
      paddingHorizontal: 16,
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
      left: 20,
      right: 20,
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
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#ffffff',
      paddingVertical: spacing.lg,
      paddingHorizontal: spacing.sm,
      borderRadius: borderRadius.xl,
      gap: spacing.sm,
      ...shadows.lg,
    },
    nextButtonText: {},
    // 라이프스타일 선택 화면
    packageChoiceContainer: {
      flex: 1,
      paddingHorizontal: spacing.xl,
      paddingBottom: 60,
    },
    headerSection: {
      marginBottom: spacing.xxl,
      paddingHorizontal: spacing.xs,
    },
    lifestyleScrollView: {
      flex: 1,
    },
    lifestyleScrollContent: {
      paddingBottom: spacing.xxl,
    },
    packageTitle: {
      color: '#ffffff',
      textAlign: 'left',
      marginBottom: spacing.md,
    },
    packageDescription: {
      color: '#ffffff',
      textAlign: 'left',
      opacity: 0.9,
    },
    lifestyleList: {
      gap: spacing.lg,
      marginBottom: spacing.xxl,
    },
    lifestyleCard: {
      backgroundColor: '#ffffff',
      borderRadius: borderRadius.xl,
      padding: spacing.xl,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    lifestyleCardLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      gap: spacing.lg,
    },
    lifestyleIconBadge: {
      width: 64,
      height: 64,
      borderRadius: borderRadius.xl,
      backgroundColor: '#f8f9ff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    lifestyleInfo: {
      flex: 1,
      gap: spacing.xs,
    },
    lifestyleLabel: {
      color: '#4E5968',
    },
    lifestyleDesc: {
      color: '#9CA3AF',
    },
    arrowIcon: {
      width: 24,
      height: 24,
      alignItems: 'center',
      justifyContent: 'center',
    },
    arrowText: {
      color: '#d1d5db',
    },
    skipPackageButton: {
      paddingVertical: spacing.xl,
      alignItems: 'center',
      marginTop: spacing.md,
    },
    skipPackageText: {
      color: '#ffffff',
      opacity: 0.9,
    },
    // 패키지 확인 화면
    confirmHeaderSection: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.xxl,
      gap: spacing.lg,
    },
    backButton: {
      width: 44,
      height: 44,
      borderRadius: borderRadius.full,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    backButtonText: {
      color: '#ffffff',
      marginTop: -4,
    },
    selectedPackageInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      flex: 1,
    },
    selectedPackageIcon: {
      fontSize: 40,
    },
    confirmTitle: {
      color: '#ffffff',
    },
    confirmDescription: {
      color: '#ffffff',
      opacity: 0.9,
      marginBottom: spacing.xxxl,
    },
    ingredientsCard: {
      backgroundColor: '#ffffff',
      borderRadius: borderRadius.xl,
      padding: spacing.xl,
      marginBottom: spacing.xxl,
    },
    ingredientsCardHeader: {
      marginBottom: spacing.lg,
    },
    ingredientsCardTitle: {
      color: '#1f2937',
    },
    ingredientsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
    },
    ingredientChip: {
      backgroundColor: '#f3f4f6',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.full,
    },
    ingredientChipText: {
      color: '#4b5563',
    },
    confirmButtons: {
      gap: spacing.md,
    },
    primaryButton: {
      backgroundColor: '#66C08A',
      borderRadius: borderRadius.xl,
      paddingVertical: spacing.xl,
      alignItems: 'center',
    },
    primaryButtonText: {
      color: '#FFFFFF',
    },
    secondaryButton: {
      paddingVertical: spacing.xl,
      alignItems: 'center',
      borderRadius: borderRadius.xl,
    },
    secondaryButtonText: {
      color: '#FFFFFF',
    },
  });
