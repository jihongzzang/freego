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
import ERROR_MESSAGES from '@/constants/toast/errorMessages';
import SUCCESS_MESSAGES from '@/constants/toast/successMessages';

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

    case 'ADD_TO_SHOPPING_LIST_INGREDIENT': {
      try {
        // 현재 식재료 찾기
        const ingredient = state.ingredients.find((item) => item.id === intent.payload);

        if (!ingredient) {
          return {
            effects: [createErrorEffect(ERROR_MESSAGES.ERROR_INGREDIENT_ITEM_NOT_FOUND)],
          };
        }

        // 장보기 목록에 추가
        await shoppingService.addToShoppingList({
          name: ingredient.name,
          category: ingredient.category,
          emoji: ingredient.emoji,
          memo: null,
          last_modified_date_time: null,
          deleted_date_time: null,
        });

        // 삭제 후 다시 로드
        const data = await ingredientService.getIngredients();
        const ingredients = enrichIngredients(data);

        return {
          state: {
            ...state,
            ingredients,
          },
          effects: [createSuccessEffect(SUCCESS_MESSAGES.SUCCESS_ADD_SHOPPING_LIST_ITEM)],
        };
      } catch (error) {
        return {
          effects: [createErrorEffect(ERROR_MESSAGES.ERROR_SHOPPING_ITEM_ADD_FAILED)],
        };
      }
    }

    case 'NAVIGATE_TO_DETAIL_EDIT':
      return {
        effects: [createNavigateEffect(`/ingredient-edit/${intent.payload}`)],
      };

    case 'NAVIGATE_TO_DETAIL':
      return {
        effects: [createNavigateEffect(`/ingredient/${intent.payload}`)],
      };

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
          effects: [createSuccessEffect(SUCCESS_MESSAGES.SUCCESS_DELETE_INGREDIENT)],
        };
      } catch (error) {
        return {
          effects: [createErrorEffect(ERROR_MESSAGES.ERROR_INGREDIENT_DELETE_FAILED)],
        };
      }
    }

    case 'CONSUME_INGREDIENT': {
      try {
        const ingredient = state.ingredients.find((item) => item.id === intent.payload);

        if (!ingredient) {
          return {
            effects: [createErrorEffect(ERROR_MESSAGES.ERROR_INGREDIENT_ITEM_NOT_FOUND)],
          };
        }

        await ingredientService.consumeIngredient(intent.payload);

        await shoppingService.addToShoppingList({
          name: ingredient.name,
          category: ingredient.category,
          emoji: ingredient.emoji,
          memo: null,
          last_modified_date_time: null,
          deleted_date_time: null,
        });
        // 소비 후 다시 로드
        const data = await ingredientService.getIngredients();
        const ingredients = enrichIngredients(data);

        return {
          state: {
            ...state,
            ingredients,
          },
          effects: [createSuccessEffect(SUCCESS_MESSAGES.SUCCESS_CONSUME_INGREDIENT)],
        };
      } catch (error) {
        return {
          effects: [createErrorEffect(ERROR_MESSAGES.ERROR_INGREDIENT_CONSUME_FAILED)],
        };
      }
    }

    case 'UPDATE_INGREDIENT_EMOJI': {
      try {
        await ingredientService.updateIngredient(intent.payload.id, {
          emoji: intent.payload.emoji,
        });

        // 업데이트 후 다시 로드
        const data = await ingredientService.getIngredients();
        const ingredients = enrichIngredients(data);

        return {
          state: {
            ...state,
            ingredients,
          },
          effects: [createSuccessEffect(SUCCESS_MESSAGES.SUCCESS_EMOJI_UPDATE)],
        };
      } catch (error) {
        return {
          effects: [createErrorEffect(ERROR_MESSAGES.ERROR_EMOJI_UPDATE_FAILED)],
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
          effects: [createSuccessEffect(SUCCESS_MESSAGES.SUCCESS_QUANTITY_UPDATE)],
        };
      } catch (error) {
        return {
          effects: [createErrorEffect(ERROR_MESSAGES.ERROR_QUANTITY_UPDATE_FAILED)],
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
          effects: [createSuccessEffect(SUCCESS_MESSAGES.SUCCESS_STORAGE_UPDATE)],
        };
      } catch (error) {
        return {
          effects: [createErrorEffect(ERROR_MESSAGES.ERROR_STORAGE_UPDATE_FAILED)],
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
          effects: [createSuccessEffect(SUCCESS_MESSAGES.SUCCESS_EXPIRY_DATE_UPDATE)],
        };
      } catch (error) {
        return {
          effects: [createErrorEffect(ERROR_MESSAGES.ERROR_EXPIRY_DATE_UPDATE_FAILED)],
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
          effects: [createSuccessEffect(SUCCESS_MESSAGES.SUCCESS_MEMO_UPDATE)],
        };
      } catch (error) {
        return {
          effects: [createErrorEffect(ERROR_MESSAGES.ERROR_MEMO_UPDATE_FAILED)],
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
          effects: [createErrorEffect(ERROR_MESSAGES.ERROR_INGREDIENT_CREATE_ERROR)],
        };
      }
    }

    case 'NAVIGATE_TO_ADD':
      return {
        effects: [createNavigateEffect('/add')],
      };

    default:
      return {};
  }
};
