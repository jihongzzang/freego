/**
 * Onboarding Middleware
 *
 * 비동기 작업 및 부수 효과 처리
 */

import { Middleware, MiddlewareResult } from '@/mvi/base';
import { OnboardingState, OnboardingIntent, OnboardingEffect } from './types';

/**
 * Onboarding Middleware
 */
export const onboardingMiddleware: Middleware<
  OnboardingState,
  OnboardingIntent,
  OnboardingEffect
> = async (
  state,
  intent
): Promise<MiddlewareResult<OnboardingState, OnboardingEffect>> => {
  switch (intent.type) {
    case 'SKIP_ONBOARDING':
      // 온보딩 건너뛰기 -> 홈으로 이동
      return {
        effects: [{ type: 'NAVIGATE_TO_HOME' }],
      };

    case 'COMPLETE_ONBOARDING':
      // 온보딩 완료 -> 홈으로 이동
      return {
        effects: [{ type: 'NAVIGATE_TO_HOME' }],
      };

    case 'NEXT_STEP':
      // 마지막 단계에서 다음 버튼을 누르면 완료 처리
      console.log('NEXT_STEP middleware, currentStep:', state.currentStep, 'totalSteps:', state.totalSteps);
      if (state.currentStep >= state.totalSteps - 1) {
        console.log('Emitting NAVIGATE_TO_HOME effect');
        return {
          effects: [{ type: 'NAVIGATE_TO_HOME' }],
        };
      }
      return {};

    default:
      return {};
  }
};
