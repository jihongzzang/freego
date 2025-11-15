/**
 * MVI Shared Helpers
 *
 * 여러 feature에서 공통으로 사용하는 헬퍼 함수
 */

import { Ingredient } from '@/data/models/ingredient.model';
import { EnrichedIngredient, CommonEffect, ToastPayload } from './types';
import { getCalculateStatus } from '@/utils/status';
import { getCalculateDaysRemaining } from '@/utils/time';

/**
 * 재료에 status와 daysRemaining 추가
 */
export function enrichIngredients(ingredients: Ingredient[]): EnrichedIngredient[] {
  return ingredients.map((item) => ({
    ...item,
    status: getCalculateStatus(item.expired_date_time),
    daysRemaining: getCalculateDaysRemaining(item.expired_date_time),
  }));
}

/**
 * 에러 토스트 Effect 생성
 */
export function createErrorEffect(message: string): CommonEffect {
  return {
    type: 'SHOW_TOAST',
    payload: {
      message,
      variant: 'error',
    },
  };
}

/**
 * 성공 토스트 Effect 생성
 */
export function createSuccessEffect(message: string): CommonEffect {
  return {
    type: 'SHOW_TOAST',
    payload: {
      message,
      variant: 'success',
    },
  };
}

/**
 * 정보 토스트 Effect 생성
 */
export function createInfoEffect(message: string): CommonEffect {
  return {
    type: 'SHOW_TOAST',
    payload: {
      message,
      variant: 'info',
    },
  };
}

/**
 * 경고 토스트 Effect 생성
 */
export function createWarningEffect(message: string): CommonEffect {
  return {
    type: 'SHOW_TOAST',
    payload: {
      message,
      variant: 'warning',
    },
  };
}

/**
 * 네비게이션 Effect 생성
 */
export function createNavigateEffect(path: string): CommonEffect {
  return {
    type: 'NAVIGATE',
    payload: path,
  };
}

/**
 * 뒤로가기 Effect 생성
 */
export function createNavigateBackEffect(): CommonEffect {
  return {
    type: 'NAVIGATE_BACK',
  };
}
