/**
 * Ingredient Edit Middleware
 *
 * 비동기 작업 및 부수 효과 처리
 */

import { Middleware, MiddlewareResult } from '@/mvi/base';
import { IngredientEditState, IngredientEditIntent, IngredientEditEffect } from './types';
import { ingredientService } from '@/services/ingredient.service';
import { Ingredient } from '@/data/models/ingredient.model';
import { createErrorEffect, createSuccessEffect } from '@/mvi/shared';
import i18n from '@/locales';

/**
 * 폼 유효성 검사
 */
function validateForm(form: IngredientEditState['editForm']): {
  isValid: boolean;
  errors: IngredientEditState['errors'];
} {
  const errors: IngredientEditState['errors'] = {};

  // 이름 검증 (필수)
  if (!form.name.trim()) {
    errors.name = i18n.t('ingredientEdit.missingName');
  }

  // 수량 검증 (선택적 - 안 쓰거나 양수만)
  if (form.quantity) {
    const trimmedQuantity = form.quantity.trim();

    // 빈 문자열이 아닌 경우에만 검증
    if (trimmedQuantity !== '') {
      // 숫자가 아닌 경우
      if (isNaN(Number(trimmedQuantity))) {
        errors.quantity = i18n.t('ingredientEdit.invalidQuantity');
      }
      // 0 이하인 경우 (0 포함, 음수 포함)
      else if (Number(trimmedQuantity) <= 0) {
        errors.quantity = i18n.t('ingredientEdit.quantityMustBePositive');
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Ingredient Edit Middleware
 */
export const ingredientEditMiddleware: Middleware<
  IngredientEditState,
  IngredientEditIntent,
  IngredientEditEffect
> = async (state, intent): Promise<MiddlewareResult<IngredientEditState, IngredientEditEffect>> => {
  switch (intent.type) {
    case 'LOAD_INGREDIENT': {
      try {
        const ingredients = await ingredientService.getIngredients();
        const data = ingredients.find((item) => item.id === intent.payload);

        if (!data) {
          return {
            state: { ...state, loading: false, error: i18n.t('ingredientEdit.notFound') },
          };
        }

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
      } catch (error) {
        console.error('Error fetching ingredient:', JSON.stringify(error, null, 2));
        return {
          state: {
            ...state,
            loading: false,
            error: error instanceof Error ? error.message : i18n.t('ingredientEdit.loadFailed'),
          },
          effects: [createErrorEffect(i18n.t('ingredientEdit.loadFailed'))],
        };
      }
    }

    case 'UPDATE_INGREDIENT': {
      if (!state.ingredient) return {};

      // 폼 유효성 검사
      const { isValid, errors } = validateForm(state.editForm);

      if (!isValid) {
        const firstError = Object.values(errors)[0];
        return {
          state: {
            ...state,
            errors,
          },
          effects: [
            {
              type: 'SHOW_TOAST',
              payload: {
                message: firstError || i18n.t('ingredientEdit.invalidInput'),
                variant: 'error',
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

        return {
          state: {
            ...state,
            errors: {},
          },
          effects: [createSuccessEffect(i18n.t('ingredientEdit.updateSuccess')), { type: 'NAVIGATE_BACK' }],
        };
      } catch (error) {
        console.error('Error updating ingredient:', JSON.stringify(error, null, 2));
        return {
          effects: [createErrorEffect(i18n.t('ingredientEdit.updateFailed'))],
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
