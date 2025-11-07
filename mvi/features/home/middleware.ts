/**
 * Home Middleware
 *
 * 비동기 작업 및 부수 효과 처리
 */

import { Middleware, MiddlewareResult } from '@/mvi/base';
import { HomeState, HomeIntent, HomeEffect, Ingredient } from './types';
import { storage } from '@/lib/storage';
import { calculateStatus } from '@/utils/calculateStatus';
import { calculateDaysRemaining } from '@/utils/calculateDaysRemaining';

/**
 * Home Middleware
 */
export const homeMiddleware: Middleware<HomeState, HomeIntent, HomeEffect> = async (
  state,
  intent,
): Promise<MiddlewareResult<HomeState, HomeEffect>> => {
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
              payload: '식재료 데이터를 불러오는데 실패했어요.',
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
              payload: '식재료가 삭제됐어요.',
            },
          ],
        };
      } catch (error) {
        return {
          effects: [
            {
              type: 'SHOW_TOAST',
              payload: '식재료 삭제에 실패했어요.',
            },
          ],
        };
      }
    }

    case 'UPDATE_EXPIRY_DATE': {
      try {
        const { id, expiryDate } = intent.payload;

        await storage.updateIngredient(id, { expiry_date: expiryDate });

        // 업데이트 후 다시 로드
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
              payload: '유통기한이 수정됐어요.',
            },
          ],
        };
      } catch (error) {
        console.error('Middleware: UPDATE_EXPIRY_DATE 에러', error);
        return {
          effects: [
            {
              type: 'SHOW_TOAST',
              payload: '유통기한 수정에 실패했어요.',
            },
          ],
        };
      }
    }

    case 'NAVIGATE_TO_ADD': {
      return {
        effects: [
          {
            type: 'NAVIGATE',
            payload: intent.payload ? `/add?category=${encodeURIComponent(intent.payload)}` : '/add',
          },
        ],
      };
    }

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
        effects: [{ type: 'NAVIGATE', payload: `/ingredient/${intent.payload}` }],
      };

    default:
      return {};
  }
};
