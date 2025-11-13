/**
 * Add Ingredient Reducer
 *
 * Intent를 받아서 새로운 State를 반환 (동기)
 */

import { Reducer } from '@/mvi/base';
import { AddState, AddIntent } from './types';

export const addReducer: Reducer<AddState, AddIntent> = (state, intent): AddState => {
  switch (intent.type) {
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

    case 'SUBMIT_FORM':
      // SUBMIT_FORM은 미들웨어에서 처리하므로 리듀서에서는 상태 변경 없음
      return state;

    default:
      return state;
  }
};
