/**
 * Onboarding Screen MVI Types
 */

import { Intent, State, Effect } from '@/mvi/base';

/**
 * Onboarding Step
 */
export interface OnboardingStep {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

/**
 * Onboarding State
 */
export interface OnboardingState extends State {
  currentStep: number;
  totalSteps: number;
}

/**
 * Onboarding Intent (사용자 액션)
 */
export type OnboardingIntent =
  | { type: 'NEXT_STEP' }
  | { type: 'SKIP_ONBOARDING' }
  | { type: 'COMPLETE_ONBOARDING' };

/**
 * Onboarding Effect (부수 효과)
 */
export type OnboardingEffect = { type: 'NAVIGATE_TO_HOME' };
