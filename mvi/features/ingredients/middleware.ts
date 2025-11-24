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
import i18n from '@/locales';

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
            effects: [createErrorEffect(i18n.t('ingredients.messages.notFound'))],
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
          effects: [createSuccessEffect(i18n.t('ingredients.messages.addedToShoppingList'))],
        };
      } catch (error) {
        return {
          effects: [createErrorEffect(i18n.t('ingredients.messages.shoppingAddFailed'))],
        };
      }
    }

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
          effects: [createSuccessEffect(i18n.t('ingredients.messages.deleted'))],
        };
      } catch (error) {
        return {
          effects: [createErrorEffect(i18n.t('ingredients.messages.deleteFailed'))],
        };
      }
    }

    case 'CONSUME_INGREDIENT': {
      try {
        const ingredient = state.ingredients.find((item) => item.id === intent.payload);

        if (!ingredient) {
          return {
            effects: [createErrorEffect(i18n.t('ingredients.messages.notFound'))],
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
          effects: [createSuccessEffect(i18n.t('ingredients.messages.consumed'))],
        };
      } catch (error) {
        return {
          effects: [createErrorEffect(i18n.t('ingredients.messages.consumeFailed'))],
        };
      }
    }

    case 'UPDATE_INGREDIENT_NAME': {
      try {
        await ingredientService.updateIngredient(intent.payload.id, {
          name: intent.payload.name,
        });

        // 업데이트 후 다시 로드
        const data = await ingredientService.getIngredients();
        const ingredients = enrichIngredients(data);

        return {
          state: {
            ...state,
            ingredients,
          },
          effects: [createSuccessEffect(i18n.t('ingredients.messages.nameUpdated'))],
        };
      } catch (error) {
        return {
          effects: [createErrorEffect(i18n.t('ingredients.messages.nameUpdateFailed'))],
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
          effects: [createSuccessEffect(i18n.t('ingredients.messages.emojiUpdated'))],
        };
      } catch (error) {
        return {
          effects: [createErrorEffect(i18n.t('ingredients.messages.emojiUpdateFailed'))],
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
          effects: [createSuccessEffect(i18n.t('ingredients.messages.quantityUpdated'))],
        };
      } catch (error) {
        return {
          effects: [createErrorEffect(i18n.t('ingredients.messages.quantityUpdateFailed'))],
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
          effects: [createSuccessEffect(i18n.t('ingredients.messages.storageUpdated'))],
        };
      } catch (error) {
        return {
          effects: [createErrorEffect(i18n.t('ingredients.messages.storageUpdateFailed'))],
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
          effects: [createSuccessEffect(i18n.t('ingredients.messages.expiryUpdated'))],
        };
      } catch (error) {
        return {
          effects: [createErrorEffect(i18n.t('ingredients.messages.expiryUpdateFailed'))],
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
          effects: [createSuccessEffect(i18n.t('ingredients.messages.memoUpdated'))],
        };
      } catch (error) {
        return {
          effects: [createErrorEffect(i18n.t('ingredients.messages.memoUpdateFailed'))],
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
          effects: [createSuccessEffect(i18n.t('ingredients.messages.bulkAddSuccess', { count: intent.payload.length }))],
        };
      } catch (error) {
        console.error('Error adding templates:', error);
        return {
          effects: [createErrorEffect(i18n.t('ingredients.messages.bulkAddFailed'))],
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
