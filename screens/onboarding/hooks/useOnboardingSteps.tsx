import { Refrigerator, ShoppingCart, Sparkles } from 'lucide-react-native';
import { useTheme } from '@/lib/theme';
import { useTranslation } from 'react-i18next';

export interface OnboardingStep {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

export function useOnboardingSteps() {
  const { t } = useTranslation();
  const { colors } = useTheme();

  const steps: OnboardingStep[] = [
    {
      icon: <Refrigerator size={80} color={colors.primary} />,
      title: t('onboarding.steps.smartFridge.title'),
      description: t('onboarding.steps.smartFridge.description'),
      color: colors.green400,
    },
    {
      icon: <ShoppingCart size={80} color={colors.primary} />,
      title: t('onboarding.steps.easyShopping.title'),
      description: t('onboarding.steps.easyShopping.description'),
      color: colors.green400,
    },
    {
      icon: <Sparkles size={80} color={colors.primary} />,
      title: t('onboarding.steps.letsStart.title'),
      description: t('onboarding.steps.letsStart.description'),
      color: colors.green400,
    },
  ];

  return steps;
}
