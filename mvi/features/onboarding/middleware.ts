/**
 * Onboarding Middleware
 *
 * 비동기 작업 및 부수 효과 처리
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Middleware, MiddlewareResult } from '@/mvi/base';
import { OnboardingState, OnboardingIntent, OnboardingEffect } from './types';
import { storage } from '@/lib/storage';
import { findLifestylePackageById } from '@/constants/starterPackages';
import { categoryDefaultEmojis } from '@/constants/ingredientTemplates';

const ONBOARDING_KEY = '@onboarding_completed';

/**
 * Onboarding Middleware
 */
export const onboardingMiddleware: Middleware<OnboardingState, OnboardingIntent, OnboardingEffect> = async (
  state,
  intent,
): Promise<MiddlewareResult<OnboardingState, OnboardingEffect>> => {
  switch (intent.type) {
    case 'SKIP_ONBOARDING':
      // 온보딩 건너뛰기 -> AsyncStorage에 저장하고 홈으로 이동
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
      return {
        effects: [{ type: 'NAVIGATE_TO_HOME' }],
      };

    case 'SKIP_PACKAGE':
      // 패키지 추가 건너뛰기 -> 홈으로 이동
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
      return {
        effects: [{ type: 'NAVIGATE_TO_HOME' }],
      };

    case 'ADD_STARTER_PACKAGE':
      // 스타터 패키지 추가
      if (state.selectedLifestyle) {
        const lifestylePackage = findLifestylePackageById(state.selectedLifestyle);

        if (lifestylePackage) {
          try {
            const ingredientsToAdd = lifestylePackage.ingredients.map((item) => ({
              name: item.name,
              category: item.category,
              emoji: item.emoji ? item.emoji : categoryDefaultEmojis[item.category] || '🍴',
              quantity: item.quantity,
              unit: item.unit,
              storage_location: item.storage_location,
              registration_date: new Date().toISOString().split('T')[0],
              purchase_date: undefined,
              expiry_date: undefined,
              memo: '',
            }));

            await storage.addMultipleIngredients(ingredientsToAdd);
          } catch (error) {
            console.error('Error adding starter package:', error);
          }
        }
      }

      await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
      return {
        effects: [{ type: 'NAVIGATE_TO_HOME' }],
      };

    case 'COMPLETE_ONBOARDING':
      // 온보딩 완료 -> AsyncStorage에 저장하고 홈으로 이동
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
      return {
        effects: [{ type: 'NAVIGATE_TO_HOME' }],
      };

    case 'NEXT_STEP':
      if (state.currentStep >= state.totalSteps - 1) {
        await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
        return {
          effects: [{ type: 'NAVIGATE_TO_HOME' }],
        };
      }
      return {};

    default:
      return {};
  }
};

/**
 * 온보딩 완료 여부 확인
 */
export async function hasCompletedOnboarding(): Promise<boolean> {
  try {
    const value = await AsyncStorage.getItem(ONBOARDING_KEY);
    return value === 'true';
  } catch (error) {
    console.error('Error checking onboarding status:', error);
    return false;
  }
}
