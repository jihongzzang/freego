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
  selectedLifestyle: string | null;
  showPackageChoice: boolean;
}

/**
 * Onboarding Intent (사용자 액션)
 */
export type OnboardingIntent =
  | { type: 'NEXT_STEP' }
  | { type: 'PREVIOUS_STEP' }
  | { type: 'SELECT_LIFESTYLE'; payload: string }
  | { type: 'SHOW_PACKAGE_CHOICE' }
  | { type: 'ADD_STARTER_PACKAGE' }
  | { type: 'SKIP_PACKAGE' }
  | { type: 'COMPLETE_ONBOARDING' };

/**
 * Onboarding Effect (부수 효과)
 */
export type OnboardingEffect =
  | { type: 'NAVIGATE_TO_HOME' }
  | { type: 'REQUEST_NOTIFICATION_PERMISSION' }
  | { type: 'ADD_PACKAGE'; payload: string }
  | {
      type: 'SHOW_TOAST';
      payload: {
        message: string;
        variant: 'success' | 'info' | 'warning' | 'error';
      };
    };
