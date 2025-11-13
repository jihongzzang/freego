/**
 * Expiring Middleware
 *
 * 비동기 작업 및 부수 효과 처리
 */

import { Middleware, MiddlewareResult } from '@/mvi/base';
import { ExpiringState, ExpiringIntent, ExpiringEffect } from './types';
import { ingredientService } from '@/services/ingredient.service';
import { shoppingService } from '@/services/shopping.service';
import { getCalculateDaysRemaining } from '@/utils/time';
import { enrichIngredients, createSuccessEffect, createErrorEffect, createNavigateEffect } from '@/mvi/shared';

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
        // 유통기한 4일 이내만 필터링
        const filtered = data.filter((item) => {
          const days = getCalculateDaysRemaining(item.expired_date_time);
          return days !== null && days < 4;
        });
        const ingredients = enrichIngredients(filtered);

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
          effects: [createErrorEffect('식재료 데이터를 불러오는데 실패했어요.')],
        };
      }
    }

    case 'DELETE_INGREDIENT': {
      try {
        await ingredientService.deleteIngredient(intent.payload);

        // 삭제 후 다시 로드
        const data = await ingredientService.getIngredients();
        const filtered = data.filter((item) => {
          const days = getCalculateDaysRemaining(item.expired_date_time);
          return days !== null && days < 4;
        });
        const ingredients = enrichIngredients(filtered);

        return {
          state: {
            ...state,
            ingredients,
          },
          effects: [createSuccessEffect('식재료가 삭제됐어요.')],
        };
      } catch (error) {
        return {
          effects: [createErrorEffect('식재료 삭제에 실패했어요.')],
        };
      }
    }

    case 'ADD_TO_SHOPPING_LIST_INGREDIENT': {
      try {
        // 현재 식재료 찾기
        const ingredient = state.ingredients.find((item) => item.id === intent.payload);

        if (!ingredient) {
          return {
            effects: [createErrorEffect('식재료를 찾을 수 없어요.')],
          };
        }

        // 장보기 목록에 추가
        await shoppingService.addToShoppingList({
          name: ingredient.name,
          category: ingredient.category,
          emoji: ingredient.emoji,
          memo: null,
          last_modifed_date_time: null,
          deleted_date_time: null,
        });

        // 식재료 삭제
        await ingredientService.deleteIngredient(intent.payload);

        // 삭제 후 다시 로드
        const data = await ingredientService.getIngredients();
        const ingredients = enrichIngredients(data);

        return {
          state: {
            ...state,
            ingredients,
          },
          effects: [createSuccessEffect('장보기 목록에 추가했어요')],
        };
      } catch (error) {
        return {
          effects: [createErrorEffect('장보기 목록 추가에 실패했어요.')],
        };
      }
    }

    case 'NAVIGATE_TO_DETAIL':
      return {
        effects: [createNavigateEffect(`/ingredient/${intent.payload}`)],
      };

    case 'NAVIGATE_BACK':
      return {
        effects: [createNavigateEffect('back')],
      };

    default:
      return {};
  }
};
