import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, SharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ColorPalette, useTheme } from '@/lib/theme';
import type { OnboardingStep } from '../hooks/useOnboardingSteps';
import { useMemo } from 'react';
import { Button } from '@/components/ui';

const { width } = Dimensions.get('window');

interface OnboardingCarouselProps {
  steps: OnboardingStep[];
  currentStep: number;
  translateX: SharedValue<number>;
  panGesture: any;
  onNext: () => void;
  onSkip: () => void;
}

export function OnboardingCarousel({
  steps,
  currentStep,
  translateX,
  panGesture,
  onNext,
  onSkip,
}: OnboardingCarouselProps) {
  const { colors, typography, spacing, borderRadius, shadows, isDark } = useTheme();

  const insets = useSafeAreaInsets();

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const styles = useMemo(
    () => createStyles({ colors, spacing, borderRadius, shadows }),
    [spacing, borderRadius, shadows],
  );

  return (
    <View style={[styles.content, { backgroundColor: colors.surface }]}>
      {currentStep < steps.length - 1 && (
        <TouchableOpacity style={[styles.skipButton, { top: insets.top + 10 }]} onPress={onSkip}>
          <Text style={[typography.styles.t5Semibold, styles.skipText]}>건너뛰기</Text>
        </TouchableOpacity>
      )}

      <GestureDetector gesture={panGesture}>
        <View style={styles.contentWrapper}>
          <Animated.View style={[styles.carouselContainer, animatedStyle]}>
            {steps.map((step, index) => (
              <View key={index} style={[styles.slideContent, { width }]}>
                <View style={styles.iconContainer}>{step.icon}</View>
                <View style={styles.textContainer}>
                  <Text style={[typography.styles.t1Bold, styles.title, { color: colors.text }]}>{step.title}</Text>
                  <Text style={[typography.styles.t4, styles.description, { color: colors.textSecondary }]}>
                    {step.description}
                  </Text>
                </View>
              </View>
            ))}
          </Animated.View>
        </View>
      </GestureDetector>

      <View style={[styles.footer, { bottom: insets.bottom + 40 }]}>
        <View style={[styles.pagination, { gap: spacing.sm }]}>
          {steps.map((_, dotIndex) => (
            <View
              key={dotIndex}
              style={[
                styles.paginationDot,
                { backgroundColor: isDark ? colors.text : colors.grey500 },
                dotIndex === currentStep && styles.paginationDotActive,
              ]}
            />
          ))}
        </View>

        <Button
          onPress={onNext}
          variant="secondary"
          size="large"
          fullWidth
          style={styles.nextButton}
          textStyle={{ color: colors.white }}
        >
          {currentStep < steps.length - 1 ? '다음' : '시작하기'}
        </Button>
      </View>
    </View>
  );
}

const createStyles = ({
  colors,
  spacing,
  borderRadius,
  shadows,
}: {
  colors: ColorPalette;
  spacing: typeof import('@/lib/theme').spacing;
  borderRadius: typeof import('@/lib/theme').borderRadius;
  shadows: typeof import('@/lib/theme').shadows;
}) =>
  StyleSheet.create({
    content: {
      flex: 1,
    },

    contentWrapper: {
      flex: 1,
      overflow: 'hidden',
      width: width,
    },

    skipText: {
      color: colors.grey400,
      opacity: 0.9,
    },

    skipButton: {
      position: 'absolute',
      right: spacing.sm,
      zIndex: 10,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.lg,
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

    title: {
      textAlign: 'center',
      marginBottom: spacing.lg,
    },

    description: {
      textAlign: 'center',
      opacity: 0.95,
    },

    iconContainer: {
      marginBottom: 60,
      alignItems: 'center',
      justifyContent: 'center',
    },

    textContainer: {
      alignItems: 'center',
    },

    footer: {
      position: 'absolute',
      bottom: 0,
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
      opacity: 0.3,
    },

    paginationDotActive: {
      width: 24,
      opacity: 1,
    },

    nextButton: {
      backgroundColor: colors.primary,
      ...shadows.lg,
    },
  });
