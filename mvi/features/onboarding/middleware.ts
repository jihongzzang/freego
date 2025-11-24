/**
 * Onboarding Middleware
 *
 * 비동기 작업 및 부수 효과 처리
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Middleware, MiddlewareResult } from '@/mvi/base';
import { OnboardingState, OnboardingIntent, OnboardingEffect } from './types';
import { ingredientService } from '@/services/ingredient.service';
import { findLifestylePackageById, SupportedLang } from '@/constants/starterPackages';
import { createErrorEffect, createSuccessEffect } from '@/mvi/shared';
import i18n from '@/locales';

const ONBOARDING_KEY = '@onboarding_completed';

/**
 * Onboarding Middleware
 */
export const onboardingMiddleware: Middleware<OnboardingState, OnboardingIntent, OnboardingEffect> = async (
  state,
  intent,
): Promise<MiddlewareResult<OnboardingState, OnboardingEffect>> => {
  switch (intent.type) {
    case 'SKIP_PACKAGE':
      // 패키지 추가 건너뛰기 -> 알림 권한 요청 후 홈으로 이동
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
      return {
        effects: [{ type: 'REQUEST_NOTIFICATION_PERMISSION' }, { type: 'NAVIGATE_TO_HOME' }],
      };

    case 'ADD_STARTER_PACKAGE':
      // 스타터 패키지 추가
      if (state.selectedLifestyle) {
        const lang = (i18n.language === 'ko' ? 'ko' : 'en') as SupportedLang;
        const lifestylePackage = findLifestylePackageById(state.selectedLifestyle, lang);

        if (lifestylePackage) {
          try {
            const ingredientsToAdd = lifestylePackage.ingredients.map((item) => ({
              name: item.name,
              category: item.category,
              emoji: item.emoji,
              quantity: item.quantity,
              unit: item.unit,
              storage_location: item.storage_location,
              purchased_date_time: null,
              expired_date_time: null,
              last_modified_date_time: null,
              deleted_date_time: null,
              memo: null,
              consumed_date_time: null,
            }));

            await ingredientService.addMultipleIngredients(ingredientsToAdd);

            await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
            return {
              effects: [
                createSuccessEffect(i18n.t('onboarding.starterPackageAdded', { count: ingredientsToAdd.length })),
                { type: 'REQUEST_NOTIFICATION_PERMISSION' },
                { type: 'NAVIGATE_TO_HOME' },
              ],
            };
          } catch (error) {
            console.error('Error adding starter package:', error);
            await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
            return {
              effects: [
                createErrorEffect(i18n.t('onboarding.starterPackageError')),
                { type: 'REQUEST_NOTIFICATION_PERMISSION' },
                { type: 'NAVIGATE_TO_HOME' },
              ],
            };
          }
        }
      }

      await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
      return {
        effects: [{ type: 'REQUEST_NOTIFICATION_PERMISSION' }, { type: 'NAVIGATE_TO_HOME' }],
      };

    case 'COMPLETE_ONBOARDING':
      // 온보딩 완료 -> 알림 권한 요청 후 홈으로 이동
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
      return {
        effects: [{ type: 'REQUEST_NOTIFICATION_PERMISSION' }, { type: 'NAVIGATE_TO_HOME' }],
      };

    case 'NEXT_STEP':
      if (state.currentStep >= state.totalSteps - 1) {
        await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
        return {
          effects: [{ type: 'REQUEST_NOTIFICATION_PERMISSION' }, { type: 'NAVIGATE_TO_HOME' }],
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
