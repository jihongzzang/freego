/**
 * Ingredient Detail Middleware
 *
 * 비동기 작업 및 부수 효과 처리
 */

import { Middleware, MiddlewareResult } from '@/mvi/base';
import {
  IngredientDetailState,
  IngredientDetailIntent,
  IngredientDetailEffect,
  Ingredient,
} from './types';
import { storage } from '@/lib/storage';
import { StatusType } from '@/constants/itemStatus';

/**
 * 유통기한 상태 계산
 */
function calculateStatus(expiryDate: string | null | undefined): StatusType {
  if (!expiryDate) return 'not_set';

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryDate);
  expiry.setHours(0, 0, 0, 0);
  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return 'expired';
  return 'valid';
}

/**
 * Ingredient Detail Middleware
 */
export const ingredientDetailMiddleware: Middleware<
  IngredientDetailState,
  IngredientDetailIntent,
  IngredientDetailEffect
> = async (
  state,
  intent,
): Promise<MiddlewareResult<IngredientDetailState, IngredientDetailEffect>> => {
  switch (intent.type) {
    case 'LOAD_INGREDIENT': {
      try {
        const ingredients = await storage.getIngredients();
        const data = ingredients.find((item) => item.id === intent.payload);

        if (data) {
          const status = calculateStatus(data.expiry_date);
          const ingredient: Ingredient = { ...data, status };

          return {
            state: {
              ...state,
              ingredient,
              editForm: {
                name: data.name,
                emoji: data.emoji,
                category: data.category,
                quantity: data.quantity?.toString() || '',
                unit: data.unit || '',
                purchase_date: data.purchase_date || '',
                expiry_date: data.expiry_date || '',
                storage_location: data.storage_location,
                memo: data.memo || '',
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
              title: '삭제 확인',
              message: '이 식재료를 삭제할까요?',
              onConfirm: async () => {
                try {
                  await storage.deleteIngredient(state.ingredient!.id);
                } catch (error) {
                  console.error('Error deleting ingredient:', error);
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
          { type: 'NAVIGATE_BACK' },
        ],
      };
    }

    case 'CONSUME_INGREDIENT': {
      if (!state.ingredient) return {};

      const ingredient = state.ingredient;

      return {
        effects: [
          {
            type: 'SHOW_CONFIRM',
            payload: {
              title: '소모 확인',
              message: `${ingredient.name}을(를) 소모 처리할까요?\n장보기 목록에 자동으로 추가돼요.`,
              onConfirm: async () => {
                try {
                  await storage.addToShoppingList({
                    name: ingredient.name,
                    category: ingredient.category,
                  });
                  await storage.deleteIngredient(ingredient.id);
                } catch (error) {
                  console.error('Error consuming ingredient:', error);
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
            type: 'SHOW_ALERT',
            payload: {
              title: '완료',
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

      try {
        await storage.updateIngredient(state.ingredient.id, {
          name: state.editForm.name,
          emoji: state.editForm.emoji,
          category: state.editForm.category,
          quantity: state.editForm.quantity ? parseInt(state.editForm.quantity) || undefined : undefined,
          unit: state.editForm.unit as any,
          purchase_date: state.editForm.purchase_date || undefined,
          expiry_date: state.editForm.expiry_date || undefined,
          storage_location: state.editForm.storage_location,
          memo: state.editForm.memo,
        });

        // 업데이트 후 다시 로드
        const ingredients = await storage.getIngredients();
        const data = ingredients.find(
          (item) => item.id === state.ingredient!.id,
        );

        if (data) {
          const status = calculateStatus(data.expiry_date);
          const ingredient: Ingredient = { ...data, status };

          return {
            state: {
              ...state,
              ingredient,
              editForm: {
                name: data.name,
                emoji: data.emoji,
                category: data.category,
                quantity: data.quantity?.toString() || '',
                unit: data.unit || '',
                purchase_date: data.purchase_date || '',
                expiry_date: data.expiry_date || '',
                storage_location: data.storage_location,
                memo: data.memo || '',
              },
              isEditing: false,
            },
            effects: [
              {
                type: 'SHOW_ALERT',
                payload: {
                  title: '완료',
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
              type: 'SHOW_ALERT',
              payload: {
                title: '오류',
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
