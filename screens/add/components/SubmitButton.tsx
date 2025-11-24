import { StyleSheet } from 'react-native';
import Button from '@/components/ui/Button';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ColorPalette, useTheme } from '@/lib/theme';
import { useMemo } from 'react';
import { useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';

interface SubmitButtonProps {
  onSubmit: () => void;
  disabled?: boolean;
}

export function SubmitButton({ onSubmit, disabled }: SubmitButtonProps) {
  const { t } = useTranslation();
  const { spacing, colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  const styles = useMemo(() => createStyles({ spacing, colors }), [spacing, colors, isDark]);

  // 버튼을 키보드 위로 올리는 애니메이션 스타일

  // 새로운 키보드 애니메이션 훅
  const { height: keyboardHeight } = useReanimatedKeyboardAnimation();

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: keyboardHeight.value }],
  }));

  return (
    <Animated.View style={[styles.container, { paddingBottom: insets.bottom }, buttonAnimatedStyle]}>
      <Button variant="primary" size="large" onPress={onSubmit} disabled={disabled}>
        {t('ingredientAdd.submit')}
      </Button>
    </Animated.View>
  );
}

const createStyles = ({ spacing, colors }: { spacing: typeof import('@/lib/theme').spacing; colors: ColorPalette }) =>
  StyleSheet.create({
    container: {
      padding: spacing.lg,
      backgroundColor: colors.surface,
    },
  });
