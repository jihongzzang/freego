/**
 * Add Ingredient Reducer
 *
 * Intent를 받아서 새로운 State를 반환 (동기)
 */

import { Reducer } from '@/mvi/base';
import { AddState, AddIntent } from './types';

/**
 * 초기 폼 데이터
 */
const initialFormData = {
  name: '',
  category: '채소',
  quantity: '1',
  unit: '개',
  expiry_date: '',
  storage_location: '냉장실',
  memo: '',
};

export const addReducer: Reducer<AddState, AddIntent> = (
  state,
  intent
): AddState => {
  switch (intent.type) {
    case 'SET_MODE':
      return {
        ...state,
        mode: intent.payload,
      };

    case 'UPDATE_FIELD':
      return {
        ...state,
        form: {
          ...state.form,
          [intent.payload.field]: intent.payload.value,
        },
        // 필드 변경 시 해당 필드의 에러 제거
        errors: {
          ...state.errors,
          [intent.payload.field]: undefined,
        },
      };

    case 'UPDATE_FORM':
      return {
        ...state,
        form: {
          ...state.form,
          ...intent.payload,
        },
      };

    case 'SUBMIT_FORM':
      return {
        ...state,
        isSubmitting: true,
        errors: {},
      };

    case 'SUBMIT_SUCCESS':
      return {
        ...state,
        isSubmitting: false,
        form: initialFormData,
        mode: 'select',
        errors: {},
      };

    case 'SUBMIT_ERROR':
      return {
        ...state,
        isSubmitting: false,
      };

    case 'RESET_FORM':
      return {
        ...state,
        form: initialFormData,
        mode: 'select',
        errors: {},
      };

    default:
      return state;
  }
};
