/**
 * Expiring Middleware
 *
 * 비동기 작업 및 부수 효과 처리
 */

import { Middleware, MiddlewareResult } from '@/mvi/base';
import { ExpiringState, ExpiringIntent, ExpiringEffect, Ingredient } from './types';
import { storage } from '@/lib/storage';

/**
 * 유통기한 상태 계산
 */
function calculateStatus(
  expiryDate: string | null,
): '신선' | '주의' | '소모됨' {
  if (!expiryDate) return '신선';

  const today = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return '소모됨';
  if (diffDays <= 3) return '주의';
  return '신선';
}

/**
 * 남은 일수 계산
 */
function calculateDaysRemaining(expiryDate: string | null): number | null {
  if (!expiryDate) return null;

  const today = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}

/**
 * Expiring Middleware
 */
export const expiringMiddleware: Middleware<
  ExpiringState,
  ExpiringIntent,
  ExpiringEffect
> = async (state, intent): Promise<MiddlewareResult<ExpiringState, ExpiringEffect>> => {
  switch (intent.type) {
    case 'LOAD_INGREDIENTS': {
      try {
        const data = await storage.getIngredients();
        // 주의 또는 소모됨 상태인 재료만 필터링
        const allIngredients: Ingredient[] = data.map((item) => ({
          ...item,
          status: calculateStatus(item.expiry_date),
          daysRemaining: calculateDaysRemaining(item.expiry_date),
        }));

        const ingredients = allIngredients.filter(
          (item) => item.status === '주의' || item.status === '소모됨'
        );

        return {
          state: {
            ...state,
            ingredients,
            loading: false,
            error: null,
          },
        };
      } catch (error) {
        return {
          state: {
            ...state,
            loading: false,
            error: error instanceof Error ? error.message : '데이터 로드 실패',
          },
          effects: [
            {
              type: 'SHOW_TOAST',
              payload: '식재료 데이터를 불러오는데 실패했습니다.',
            },
          ],
        };
      }
    }

    case 'DELETE_INGREDIENT': {
      try {
        await storage.deleteIngredient(intent.payload);

        // 삭제 후 다시 로드
        const data = await storage.getIngredients();
        const allIngredients: Ingredient[] = data.map((item) => ({
          ...item,
          status: calculateStatus(item.expiry_date),
          daysRemaining: calculateDaysRemaining(item.expiry_date),
        }));

        const ingredients = allIngredients.filter(
          (item) => item.status === '주의' || item.status === '소모됨'
        );

        return {
          state: {
            ...state,
            ingredients,
          },
          effects: [
            {
              type: 'SHOW_TOAST',
              payload: '식재료가 삭제되었습니다.',
            },
          ],
        };
      } catch (error) {
        return {
          effects: [
            {
              type: 'SHOW_TOAST',
              payload: '식재료 삭제에 실패했습니다.',
            },
          ],
        };
      }
    }

    case 'NAVIGATE_TO_DETAIL':
      return {
        effects: [
          { type: 'NAVIGATE', payload: `/ingredient/${intent.payload}` },
        ],
      };

    case 'NAVIGATE_BACK':
      return {
        effects: [{ type: 'NAVIGATE', payload: 'back' }],
      };

    default:
      return {};
  }
};
