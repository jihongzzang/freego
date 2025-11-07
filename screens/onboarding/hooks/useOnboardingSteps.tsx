import { Refrigerator, ShoppingCart, Sparkles } from 'lucide-react-native';
import { useTheme } from '@/lib/theme';

export interface OnboardingStep {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

export function useOnboardingSteps() {
  const { colors } = useTheme();

  const steps: OnboardingStep[] = [
    {
      icon: <Refrigerator size={80} color={colors.primary} />,
      title: '냉장고를 스마트하게',
      description: '식재료를 체계적으로 관리하고\n유통기한을 놓치지 마세요',
      color: colors.green400,
    },
    {
      icon: <ShoppingCart size={80} color={colors.primary} />,
      title: '장보기도 간편하게',
      description: '다 떨어진 재료는 손쉽게\n장보기 목록에 추가해요',
      color: colors.green400,
    },
    {
      icon: <Sparkles size={80} color={colors.primary} />,
      title: '시작해볼까요?',
      description: '현명한 소비 습관을 만들고\n지구를 지키는 작은 실천을 시작해요',
      color: colors.green400,
    },
  ];

  return steps;
}
