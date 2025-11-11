/**
 * Expiring Middleware
 *
 * 비동기 작업 및 부수 효과 처리
 */

import { Middleware, MiddlewareResult } from '@/mvi/base';
import { ExpiringState, ExpiringIntent, ExpiringEffect, Ingredient } from './types';
import { ingredientService } from '@/services/ingredient.service';
import { getCalculateDaysRemaining } from '@/utils/time';
import { getCalculateStatus } from '@/utils/status';
import { shoppingService } from '@/services/shopping.service';

/**
 * Expiring Middleware
 */
export const expiringMiddleware: Middleware<ExpiringState, ExpiringIntent, ExpiringEffect> = async (
  state,
  intent,
): Promise<MiddlewareResult<ExpiringState, ExpiringEffect>> => {
  switch (intent.type) {
    case 'LOAD_INGREDIENTS': {
      try {
        const data = await ingredientService.getIngredients();
        const ingredients: Ingredient[] = data
          .filter((item) => {
            const days = getCalculateDaysRemaining(item.expiry_date);
            return days !== null && days < 4;
          })
          .map((item) => ({
            ...item,
            status: getCalculateStatus(item.expiry_date),
            daysRemaining: getCalculateDaysRemaining(item.expiry_date),
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
              payload: {
                message: '식재료 데이터를 불러오는데 실패했어요.',
                variant: 'error',
              },
            },
          ],
        };
      }
    }

    case 'DELETE_INGREDIENT': {
      try {
        await ingredientService.deleteIngredient(intent.payload);

        // 삭제 후 다시 로드
        const data = await ingredientService.getIngredients();
        const ingredients: Ingredient[] = data
          .filter((item) => {
            const days = getCalculateDaysRemaining(item.expiry_date);
            return days !== null && days < 4;
          })
          .map((item) => ({
            ...item,
            status: getCalculateStatus(item.expiry_date),
            daysRemaining: getCalculateDaysRemaining(item.expiry_date),
          }));

        return {
          state: {
            ...state,
            ingredients,
          },
          effects: [
            {
              type: 'SHOW_TOAST',
              payload: {
                message: '식재료가 삭제됐어요.',
                variant: 'success',
              },
            },
          ],
        };
      } catch (error) {
        return {
          effects: [
            {
              type: 'SHOW_TOAST',
              payload: {
                message: '식재료 삭제에 실패했어요.',
                variant: 'error',
              },
            },
          ],
        };
      }
    }

    case 'ADD_TO_SHOPPING_LIST_INGREDIENT': {
      try {
        // 현재 식재료 찾기
        const ingredient = state.ingredients.find((item) => item.id === intent.payload);

        if (!ingredient) {
          return {
            effects: [
              {
                type: 'SHOW_TOAST',
                payload: { message: '식재료를 찾을 수 없어요.', variant: 'error' },
              },
            ],
          };
        }

        // 장보기 목록에 추가
        await shoppingService.addToShoppingList({
          name: ingredient.name,
          category: ingredient.category,
          emoji: ingredient.emoji,
        });

        // 식재료 삭제
        await ingredientService.deleteIngredient(intent.payload);

        // 삭제 후 다시 로드
        const data = await ingredientService.getIngredients();
        const ingredients: Ingredient[] = data.map((item) => ({
          ...item,
          status: getCalculateStatus(item.expiry_date),
          daysRemaining: getCalculateDaysRemaining(item.expiry_date),
        }));

        return {
          state: {
            ...state,
            ingredients,
          },
          effects: [
            {
              type: 'SHOW_TOAST',
              payload: { message: '장보기 목록에 추가했어요', variant: 'success' },
            },
          ],
        };
      } catch (error) {
        return {
          effects: [
            {
              type: 'SHOW_TOAST',
              payload: { message: '장보기 목록 추가에 실패했어요.', variant: 'error' },
            },
          ],
        };
      }
    }

    case 'NAVIGATE_TO_DETAIL':
      return {
        effects: [{ type: 'NAVIGATE', payload: `/ingredient/${intent.payload}` }],
      };

    case 'NAVIGATE_BACK':
      return {
        effects: [{ type: 'NAVIGATE', payload: 'back' }],
      };

    default:
      return {};
  }
};
