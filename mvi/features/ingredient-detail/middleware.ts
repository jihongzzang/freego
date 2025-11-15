/**
 * Ingredient Detail Middleware
 *
 * 비동기 작업 및 부수 효과 처리
 */

import { Middleware, MiddlewareResult } from '@/mvi/base';
import { IngredientDetailState, IngredientDetailIntent, IngredientDetailEffect } from './types';
import { ingredientService } from '@/services/ingredient.service';
import { shoppingService } from '@/services/shopping.service';
import { Ingredient } from '@/data/models/ingredient.model';
import { createErrorEffect, createSuccessEffect } from '@/mvi/shared';
import ERROR_MESSAGES from '@/constants/toast/errorMessages';

/**
 * Ingredient Detail Middleware
 */
export const ingredientDetailMiddleware: Middleware<
  IngredientDetailState,
  IngredientDetailIntent,
  IngredientDetailEffect
> = async (state, intent): Promise<MiddlewareResult<IngredientDetailState, IngredientDetailEffect>> => {
  switch (intent.type) {
    case 'LOAD_INGREDIENT': {
      try {
        const ingredients = await ingredientService.getIngredients();
        const data = ingredients.find((item) => item.id === intent.payload);

        if (!data) {
          return {
            state: { ...state, loading: false, error: '식재료를 찾을 수 없어요.' },
          };
        }

        const ingredient: Ingredient = data;

        return {
          state: {
            ...state,
            ingredient,
            loading: false,
            error: null,
          },
        };
      } catch (error) {
        console.error('Error fetching ingredient:', error);
        return {
          state: {
            ...state,
            loading: false,
            error: error instanceof Error ? error.message : '데이터 로드 실패',
          },
          effects: [createErrorEffect(ERROR_MESSAGES.ERROR_INGREDIENT_LOAD_FAILED)],
        };
      }
    }

    case 'DELETE_INGREDIENT': {
      if (!state.ingredient) return {};

      return {
        effects: [
          {
            type: 'SHOW_CONFIRM',
            payload: {
              title: '식재료 삭제',
              message: '이 식재료를 삭제할까요?',
              onConfirm: async () => {
                try {
                  await ingredientService.deleteIngredient(state.ingredient!.id);
                  return { success: true };
                } catch (error) {
                  console.error('Error deleting ingredient:', error);
                  return { success: false };
                }
              },
              isDanger: true,
            },
          },
        ],
      };
    }

    case 'DELETE_SUCCESS': {
      return {
        effects: [createSuccessEffect('식재료가 삭제됐어요.'), { type: 'NAVIGATE_BACK' }],
      };
    }

    case 'CONSUME_INGREDIENT': {
      if (!state.ingredient) return {};

      const ingredient = state.ingredient;
      const ingredientName = ingredient.name;

      return {
        effects: [
          {
            type: 'SHOW_CONFIRM',
            payload: {
              title: '식재료 소모',
              message: `${ingredient.name}을(를) 소모 처리할까요?\n장보기 목록에 자동으로 추가돼요.`,
              onConfirm: async () => {
                try {
                  await ingredientService.consumeIngredient(ingredient.id);
                  await shoppingService.addToShoppingList({
                    name: ingredient.name,
                    category: ingredient.category,
                    emoji: ingredient.emoji,
                    memo: null,
                    last_modified_date_time: null,
                    deleted_date_time: null,
                  });
                  return { success: true, ingredientName };
                } catch (error) {
                  console.error('Error consuming ingredient:', error);
                  return { success: false };
                }
              },
            },
          },
        ],
      };
    }

    case 'CONSUME_SUCCESS': {
      return {
        effects: [
          createSuccessEffect(`${intent.payload.name}이(가) 장보기 목록에 추가됐어요.`),
          { type: 'NAVIGATE_BACK' },
        ],
      };
    }

    case 'NAVIGATE_TO_EDIT': {
      if (!state.ingredient) return {};

      return {
        effects: [{ type: 'NAVIGATE_TO_EDIT', payload: { id: state.ingredient.id } }],
      };
    }

    case 'NAVIGATE_BACK': {
      return {
        effects: [{ type: 'NAVIGATE_BACK' }],
      };
    }

    default:
      return {};
  }
};
