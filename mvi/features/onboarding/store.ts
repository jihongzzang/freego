/**
 * Onboarding Store
 *
 * Onboarding 화면의 MVI Store 생성
 */

import { Store } from '@/mvi/base';
import { OnboardingState, OnboardingIntent, OnboardingEffect } from './types';
import { onboardingReducer } from './reducer';
import { onboardingMiddleware } from './middleware';

/**
 * 초기 상태
 */
const initialState: OnboardingState = {
  currentStep: 0,
  totalSteps: 3, // 온보딩 단계 수
};

/**
 * Onboarding Store 생성 함수
 */
export function createOnboardingStore(): Store<
  OnboardingState,
  OnboardingIntent,
  OnboardingEffect
> {
  return new Store({
    initialState,
    reducer: onboardingReducer,
    middlewares: [onboardingMiddleware],
  });
}
