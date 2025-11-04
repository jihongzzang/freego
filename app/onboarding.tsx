import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useEffect } from 'react';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, Refrigerator, ShoppingCart, TrendingDown, Sparkles } from 'lucide-react-native';
import { useTheme } from '@/lib/theme';
import { useMVIStore } from '@/mvi/base';
import { createOnboardingStore } from '@/mvi/features/onboarding';

const { width, height } = Dimensions.get('window');

interface OnboardingStep {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

export default function OnboardingScreen() {
  const { colors } = useTheme();
  const [state, dispatch, effect] = useMVIStore(createOnboardingStore);

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
      description: '소비 패턴을 분석하고\n낭비를 최소화하세요',
      color: '#3b82f6',
    },
    {
      icon: <ShoppingCart size={80} color="#ffffff" />,
      title: '장보기도 간편하게',
      description: '다 떨어진 재료는 자동으로\n장보기 목록에 추가됩니다',
      color: '#f59e0b',
    },
    {
      icon: <Sparkles size={80} color="#ffffff" />,
      title: '시작해볼까요?',
      description: '현명한 소비 습관을 만들고\n지구를 지키는 작은 실천을 시작하세요',
      color: '#8b5cf6',
    },
  ];

  const currentStepData = steps[state.currentStep];

  // Handle effects
  useEffect(() => {
    if (!effect) return;

    if (effect.type === 'NAVIGATE_TO_HOME') {
      router.replace('/(tabs)');
    }
  }, [effect]);

  function handleNext() {
    dispatch({ type: 'NEXT_STEP' });
  }

  function handleSkip() {
    dispatch({ type: 'SKIP_ONBOARDING' });
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[currentStepData.color, currentStepData.color + 'dd']}
        style={styles.gradient}>
        {state.currentStep < steps.length - 1 && (
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipText}>건너뛰기</Text>
          </TouchableOpacity>
        )}

        <View style={styles.content}>
          <View style={styles.iconContainer}>{currentStepData.icon}</View>

          <View style={styles.textContainer}>
            <Text style={styles.title}>{currentStepData.title}</Text>
            <Text style={styles.description}>{currentStepData.description}</Text>
          </View>

          <View style={styles.footer}>
            <View style={styles.pagination}>
              {steps.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.paginationDot,
                    index === state.currentStep && styles.paginationDotActive,
                  ]}
                />
              ))}
            </View>

            <TouchableOpacity style={styles.nextButton} onPress={handleNext} activeOpacity={0.8}>
              <Text style={styles.nextButtonText}>
                {state.currentStep < steps.length - 1 ? '다음' : '시작하기'}
              </Text>
              <ChevronRight size={24} color={currentStepData.color} />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  skipButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  skipText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    opacity: 0.9,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
    marginBottom: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 80,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 18,
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 28,
    opacity: 0.95,
  },
  footer: {
    position: 'absolute',
    bottom: 60,
    width: width - 80,
    alignItems: 'center',
    gap: 32,
  },
  pagination: {
    flexDirection: 'row',
    gap: 8,
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    gap: 8,
    minWidth: 160,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: '700',
  },
});
