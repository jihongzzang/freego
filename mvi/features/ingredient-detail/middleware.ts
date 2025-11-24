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
import i18n from '@/locales';

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
            state: { ...state, loading: false, error: i18n.t('ingredientDetail.notFound') },
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
            error: error instanceof Error ? error.message : i18n.t('ingredientDetail.loadFailed'),
          },
          effects: [createErrorEffect(i18n.t('ingredientDetail.loadFailed'))],
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
              title: i18n.t('ingredientDetail.deleteTitle'),
              message: i18n.t('ingredientDetail.deleteConfirm'),
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
        effects: [createSuccessEffect(i18n.t('ingredientDetail.deleteSuccess')), { type: 'NAVIGATE_BACK' }],
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
              title: i18n.t('ingredientDetail.consumeTitle'),
              message: i18n.t('ingredientDetail.consumeConfirm', { name: ingredient.name }),
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
          createSuccessEffect(i18n.t('ingredientDetail.consumeSuccess', { name: intent.payload.name })),
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
