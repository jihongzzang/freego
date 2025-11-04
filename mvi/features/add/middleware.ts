/**
 * Add Ingredient Middleware
 *
 * 비동기 작업 및 부수 효과 처리
 */

import { Middleware, MiddlewareResult } from '@/mvi/base';
import { AddState, AddIntent, AddEffect } from './types';
import { storage } from '@/lib/storage';

/**
 * 폼 유효성 검사
 */
function validateForm(form: AddState['form']): { isValid: boolean; errors: AddState['errors'] } {
  const errors: AddState['errors'] = {};

  // 이름 검증 (필수)
  if (!form.name.trim()) {
    errors.name = '재료 이름을 입력해주세요.';
  }

  // 수량 검증 (선택적)
  if (form.quantity.trim()) {
    const quantity = parseInt(form.quantity);
    if (isNaN(quantity) || quantity <= 0) {
      errors.quantity = '올바른 수량을 입력해주세요.';
    }
  }

  // 유통기한 검증 (선택적)
  if (form.expiry_date.trim()) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(form.expiry_date)) {
      errors.expiry_date = '날짜 형식이 올바르지 않습니다. (YYYY-MM-DD)';
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
  intent
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
              type: 'SHOW_ALERT',
              payload: {
                title: '알림',
                message: firstError || '입력 항목을 확인해주세요.',
                variant: 'warning',
              },
            },
          ],
        };
      }

      try {
        // 스토리지에 저장
        await storage.addIngredient({
          name: state.form.name,
          category: state.form.category,
          quantity: state.form.quantity.trim() ? parseInt(state.form.quantity) : null,
          unit: state.form.unit.trim() || null,
          purchase_date: new Date().toISOString().split('T')[0],
          expiry_date: state.form.expiry_date.trim() || null,
          storage_location: state.form.storage_location,
          memo: state.form.memo,
        });

        return {
          state: {
            ...state,
            isSubmitting: false,
            form: {
              name: '',
              category: '채소',
              quantity: '',
              unit: '',
              expiry_date: '',
              storage_location: '냉장실',
              memo: '',
            },
            mode: 'select',
            errors: {},
          },
          effects: [
            {
              type: 'SHOW_ALERT',
              payload: {
                title: '성공',
                message: '식재료가 등록되었습니다.',
                variant: 'success',
              },
            },
            {
              type: 'NAVIGATE_HOME',
            },
          ],
        };
      } catch (error) {
        console.error('Error adding ingredient:', error);
        return {
          state: {
            ...state,
            isSubmitting: false,
          },
          effects: [
            {
              type: 'SHOW_ALERT',
              payload: {
                title: '오류',
                message: '식재료 등록에 실패했습니다.',
                variant: 'error',
              },
            },
          ],
        };
      }
    }

    default:
      return {};
  }
};
