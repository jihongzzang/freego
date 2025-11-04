/**
 * Onboarding Reducer
 *
 * Intent를 받아서 새로운 State를 반환 (동기)
 */

import { Reducer } from '@/mvi/base';
import { OnboardingState, OnboardingIntent } from './types';

export const onboardingReducer: Reducer<OnboardingState, OnboardingIntent> = (
  state,
  intent
): OnboardingState => {
  switch (intent.type) {
    case 'NEXT_STEP':
      // 다음 단계로 이동 (마지막 단계가 아닐 경우에만)
      if (state.currentStep < state.totalSteps - 1) {
        return {
          ...state,
          currentStep: state.currentStep + 1,
        };
      }
      return state;

    case 'PREVIOUS_STEP':
      // 이전 단계로 이동 (첫 단계가 아닐 경우에만)
      if (state.currentStep > 0) {
        return {
          ...state,
          currentStep: state.currentStep - 1,
        };
      }
      return state;

    default:
      return state;
  }
};
