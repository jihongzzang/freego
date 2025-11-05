/**
 * Home Middleware
 *
 * 비동기 작업 및 부수 효과 처리
 */

import { Middleware, MiddlewareResult } from '@/mvi/base';
import { HomeState, HomeIntent, HomeEffect, Ingredient } from './types';
import { storage } from '@/lib/storage';

/**
 * 유통기한 상태 계산
 */
function calculateStatus(
  expiryDate: string | null | undefined,
): '유효' | '만료' | '미설정' {
  if (!expiryDate) return '미설정';

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryDate);
  expiry.setHours(0, 0, 0, 0);
  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return '만료';
  return '유효';
}

/**
 * 남은 일수 계산
 */
function calculateDaysRemaining(expiryDate: string | null | undefined): number | null {
  if (!expiryDate) return null;

  const today = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}

/**
 * Home Middleware
 */
export const homeMiddleware: Middleware<
  HomeState,
  HomeIntent,
  HomeEffect
> = async (state, intent): Promise<MiddlewareResult<HomeState, HomeEffect>> => {
  switch (intent.type) {
    case 'LOAD_INGREDIENTS': {
      try {
        const data = await storage.getIngredients();
        const ingredients: Ingredient[] = data.map((item) => ({
          ...item,
          status: calculateStatus(item.expiry_date),
          daysRemaining: calculateDaysRemaining(item.expiry_date),
        }));

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
        const ingredients: Ingredient[] = data.map((item) => ({
          ...item,
          status: calculateStatus(item.expiry_date),
          daysRemaining: calculateDaysRemaining(item.expiry_date),
        }));

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

    case 'UPDATE_EXPIRY_DATE': {
      try {
        const { id, expiryDate } = intent.payload;
        console.log('Middleware: UPDATE_EXPIRY_DATE 시작', { id, expiryDate });

        await storage.updateIngredient(id, { expiry_date: expiryDate });
        console.log('Middleware: storage.updateIngredient 완료');

        // 업데이트 후 다시 로드
        const data = await storage.getIngredients();
        console.log('Middleware: 재료 개수:', data.length);

        const ingredients: Ingredient[] = data.map((item) => ({
          ...item,
          status: calculateStatus(item.expiry_date),
          daysRemaining: calculateDaysRemaining(item.expiry_date),
        }));

        return {
          state: {
            ...state,
            ingredients,
          },
          effects: [
            {
              type: 'SHOW_TOAST',
              payload: '유통기한이 수정되었습니다.',
            },
          ],
        };
      } catch (error) {
        console.error('Middleware: UPDATE_EXPIRY_DATE 에러', error);
        return {
          effects: [
            {
              type: 'SHOW_TOAST',
              payload: '유통기한 수정에 실패했습니다.',
            },
          ],
        };
      }
    }

    case 'NAVIGATE_TO_ADD':
      return {
        effects: [{ type: 'NAVIGATE', payload: '/add' }],
      };

    case 'NAVIGATE_TO_INGREDIENTS':
      return {
        effects: [
          {
            type: 'NAVIGATE',
            payload: intent.payload
              ? `/(tabs)/ingredients?category=${encodeURIComponent(intent.payload)}`
              : '/(tabs)/ingredients',
          },
        ],
      };

    case 'NAVIGATE_TO_EXPIRING':
      return {
        effects: [{ type: 'NAVIGATE', payload: '/expiring' }],
      };

    case 'NAVIGATE_TO_DETAIL':
      return {
        effects: [
          { type: 'NAVIGATE', payload: `/ingredient/${intent.payload}` },
        ],
      };

    default:
      return {};
  }
};
