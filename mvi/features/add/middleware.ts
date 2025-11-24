/**
 * Add Ingredient Middleware
 *
 * 비동기 작업 및 부수 효과 처리
 */

import { Middleware, MiddlewareResult } from '@/mvi/base';
import { AddState, AddIntent, AddEffect } from './types';
import { ingredientService } from '@/services/ingredient.service';
import { getRandomEmojiForCategory } from '@/constants/ingredientTemplates';
import { createSuccessEffect } from '@/mvi/shared';
import i18n from '@/locales';

/**
 * 폼 유효성 검사
 */
function validateForm(form: AddState['form']): {
  isValid: boolean;
  errors: AddState['errors'];
} {
  const errors: AddState['errors'] = {};

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
 * Add Middleware
 */
export const addMiddleware: Middleware<AddState, AddIntent, AddEffect> = async (
  state,
  intent,
): Promise<MiddlewareResult<AddState, AddEffect>> => {
  switch (intent.type) {
    case 'VALIDATE_FORM': {
      const { isValid, errors } = validateForm(state.form);

      if (!isValid) {
        return {
          state: {
            ...state,
            errors,
          },
        };
      }

      return {};
    }

    case 'SUBMIT_FORM': {
      // 폼 유효성 검사
      const { isValid, errors } = validateForm(state.form);

      if (!isValid) {
        const firstError = Object.values(errors)[0];
        return {
          state: {
            ...state,
            isSubmitting: false,
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
        await ingredientService.addIngredient({
          name: state.form.name,
          category: state.form.category,
          emoji: state.form.emoji || getRandomEmojiForCategory(state.form.category) || '🍴',
          quantity: Number.isInteger(Number(state.form.quantity?.trim())) ? Number(state.form.quantity) : null,
          unit: state.form.unit || null,
          purchased_date_time: state.form.purchased_date_time || null,
          expired_date_time: state.form.expired_date_time || null,
          storage_location: state.form.storage_location || null,
          memo: state.form.memo || null,
          last_modified_date_time: null,
          deleted_date_time: null,
          consumed_date_time: null,
        });

        return {
          state: {
            ...state,
            isSubmitting: false,
            form: {
              name: '',
              category: state.form.category,
              quantity: null,
              unit: null,
              emoji: null,
              purchased_date_time: null,
              expired_date_time: null,
              storage_location: null,
              memo: null,
            },
            errors: {},
          },
          effects: [createSuccessEffect(i18n.t('ingredientAdd.addSuccess'))],
        };
      } catch (error) {
        return {
          state: {
            ...state,
            isSubmitting: false,
          },
          effects: [
            {
              type: 'SHOW_TOAST',
              payload: {
                message: i18n.t('ingredientAdd.addFailed'),
                variant: 'error',
              },
            },
          ],
        };
      }
    }

    case 'NAVIGATE_BACK': {
      return {
        effects: [
          {
            type: 'NAVIGATE_BACK',
          },
        ],
      };
    }

    default:
      return {};
  }
};
