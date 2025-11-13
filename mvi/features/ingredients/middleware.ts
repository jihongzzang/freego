/**
 * Ingredients Middleware
 *
 * 비동기 작업 및 부수 효과 처리
 */

import { Middleware, MiddlewareResult } from '@/mvi/base';
import { IngredientsState, IngredientsIntent, IngredientsEffect } from './types';
import { ingredientService } from '@/services/ingredient.service';
import { shoppingService } from '@/services/shopping.service';
import {
  handleLoadIngredients,
  enrichIngredients,
  createSuccessEffect,
  createErrorEffect,
  createNavigateEffect,
} from '@/mvi/shared';

/**
 * Ingredients Middleware
 */
export const ingredientsMiddleware: Middleware<IngredientsState, IngredientsIntent, IngredientsEffect> = async (
  state,
  intent,
): Promise<MiddlewareResult<IngredientsState, IngredientsEffect>> => {
  switch (intent.type) {
    case 'LOAD_INGREDIENTS': {
      return handleLoadIngredients<IngredientsState, IngredientsEffect>();
    }

    case 'DELETE_INGREDIENT': {
      try {
        await ingredientService.deleteIngredient(intent.payload);

        // 삭제 후 다시 로드
        const data = await ingredientService.getIngredients();
        const ingredients = enrichIngredients(data);

        return {
          state: {
            ...state,
            ingredients,
          },
          effects: [createErrorEffect('식재료가 삭제됐어요')],
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

    case 'BULK_ADD_INGREDIENTS': {
      try {
        await ingredientService.addMultipleIngredients(intent.payload as any);

        // 추가 후 다시 로드
        const data = await ingredientService.getIngredients();
        const ingredients = enrichIngredients(data);

        return {
          state: {
            ...state,
            ingredients,
          },
          effects: [createSuccessEffect(`${intent.payload.length}개의 재료가 추가됐어요.`)],
        };
      } catch (error) {
        console.error('Error adding templates:', error);
        return {
          effects: [createErrorEffect('재료 추가 중 오류가 발생했어요.')],
        };
      }
    }

    case 'UPDATE_INGREDIENT_EXPIRY': {
      try {
        await ingredientService.updateIngredient(intent.payload.id, {
          expired_date_time: intent.payload.expired_date_time,
        });

        // 업데이트 후 다시 로드
        const data = await ingredientService.getIngredients();
        const ingredients = enrichIngredients(data);

        return {
          state: {
            ...state,
            ingredients,
          },
          effects: [createSuccessEffect('유통기한이 수정됐어요')],
        };
      } catch (error) {
        return {
          effects: [createErrorEffect('유통기한 수정에 실패했어요.')],
        };
      }
    }

    case 'UPDATE_INGREDIENT_QUANTITY': {
      try {
        await ingredientService.updateIngredient(intent.payload.id, {
          quantity: intent.payload.quantity ? Number(intent.payload.quantity) : null,
        });

        // 업데이트 후 다시 로드
        const data = await ingredientService.getIngredients();
        const ingredients = enrichIngredients(data);

        return {
          state: {
            ...state,
            ingredients,
          },
          effects: [createSuccessEffect('수량이 수정됐어요')],
        };
      } catch (error) {
        return {
          effects: [createErrorEffect('수량 수정에 실패했어요.')],
        };
      }
    }

    case 'UPDATE_INGREDIENT_STORAGE': {
      try {
        await ingredientService.updateIngredient(intent.payload.id, {
          storage_location: intent.payload.storage_location,
        });

        // 업데이트 후 다시 로드
        const data = await ingredientService.getIngredients();
        const ingredients = enrichIngredients(data);

        return {
          state: {
            ...state,
            ingredients,
          },
          effects: [createSuccessEffect('보관위치를 수정했어요.')],
        };
      } catch (error) {
        return {
          effects: [createErrorEffect('보관위치 수정에 실패했어요.')],
        };
      }
    }

    case 'UPDATE_MEMO': {
      try {
        await ingredientService.updateIngredient(intent.payload.id, {
          memo: intent.payload.memo ? intent.payload.memo : null,
        });

        // 업데이트 후 다시 로드
        const data = await ingredientService.getIngredients();
        const ingredients = enrichIngredients(data);

        return {
          state: {
            ...state,
            ingredients,
          },
          effects: [createSuccessEffect('메모를 수정했어요.')],
        };
      } catch (error) {
        return {
          effects: [createErrorEffect('메모 수정에 실패했어요.')],
        };
      }
    }

    case 'NAVIGATE_TO_ADD':
      return {
        effects: [createNavigateEffect('/add')],
      };

    case 'NAVIGATE_TO_DETAIL':
      return {
        effects: [createNavigateEffect(`/ingredient/${intent.payload}`)],
      };

    case 'NAVIGATE_TO_DETAIL_EDIT':
      return {
        effects: [createNavigateEffect(`/ingredient/${intent.payload}?mode=edit`)],
      };

    default:
      return {};
  }
};
