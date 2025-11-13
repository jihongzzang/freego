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

        if (data) {
          const ingredient: Ingredient = data;

          return {
            state: {
              ...state,
              ingredient,
              editForm: {
                name: data.name,
                emoji: data.emoji,
                category: data.category,
                quantity: data.quantity?.toString() || null,
                unit: data.unit,
                purchased_date_time: data.purchased_date_time,
                expired_date_time: data.expired_date_time,
                storage_location: data.storage_location,
                memo: data.memo,
              },
              loading: false,
              error: null,
            },
          };
        } else {
          return {
            state: {
              ...state,
              loading: false,
              error: '식재료를 찾을 수 없어요.',
            },
          };
        }
      } catch (error) {
        console.error('Error fetching ingredient:', error);
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
                message: '식재료를 불러오는데 실패했어요.',
                variant: 'error',
              },
            },
          ],
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
        effects: [
          {
            type: 'SHOW_TOAST',
            payload: {
              message: '식재료가 삭제됐어요.',
              variant: 'success',
            },
          },
          { type: 'NAVIGATE_BACK' },
        ],
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
                  await shoppingService.addToShoppingList({
                    name: ingredient.name,
                    category: ingredient.category,
                    emoji: ingredient.emoji,
                    memo: null,
                    last_modifed_date_time: null,
                    deleted_date_time: null,
                  });
                  await ingredientService.deleteIngredient(ingredient.id);
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
          {
            type: 'SHOW_TOAST',
            payload: {
              message: `${intent.payload.name}이(가) 장보기 목록에 추가됐어요.`,
              variant: 'success',
            },
          },
          { type: 'NAVIGATE_BACK' },
        ],
      };
    }

    case 'UPDATE_INGREDIENT': {
      if (!state.ingredient) return {};

      if (state.editForm.quantity?.trim() === '0') {
        return {
          effects: [
            {
              type: 'SHOW_TOAST',
              payload: {
                message: '수량이 0개인 식재료는 등록할 수 없어요.',
                variant: 'warning',
              },
            },
          ],
        };
      }

      try {
        await ingredientService.updateIngredient(state.ingredient.id, {
          name: state.editForm.name,
          emoji: state.editForm.emoji,
          category: state.editForm.category,
          quantity: Number.isInteger(Number(state.editForm.quantity?.trim())) ? Number(state.editForm.quantity) : null,
          unit: state.editForm.unit as any,
          purchased_date_time: state.editForm.purchased_date_time,
          expired_date_time: state.editForm.expired_date_time,
          storage_location: state.editForm.storage_location,
          memo: state.editForm.memo,
        });

        // 업데이트 후 다시 로드
        const ingredients = await ingredientService.getIngredients();
        const data = ingredients.find((item) => item.id === state.ingredient!.id);

        if (data) {
          const ingredient: Ingredient = data;

          return {
            state: {
              ...state,
              ingredient,
              editForm: {
                name: data.name,
                emoji: data.emoji,
                category: data.category,
                quantity: data.quantity?.toString() || null,
                unit: data.unit,
                purchased_date_time: data.purchased_date_time,
                expired_date_time: data.expired_date_time,
                storage_location: data.storage_location,
                memo: data.memo,
              },
              isEditing: false,
            },
            effects: [
              {
                type: 'SHOW_TOAST',
                payload: {
                  message: '식재료 정보가 업데이트됐어요.',
                  variant: 'success',
                },
              },
            ],
          };
        }

        return {};
      } catch (error) {
        console.error('Error updating ingredient:', error);
        return {
          effects: [
            {
              type: 'SHOW_TOAST',
              payload: {
                message: '식재료 업데이트에 실패했어요.',
                variant: 'error',
              },
            },
          ],
        };
      }
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
