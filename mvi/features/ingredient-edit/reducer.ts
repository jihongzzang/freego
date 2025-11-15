/**
 * Ingredient Edit Reducer
 *
 * Intent를 받아서 새로운 State를 반환 (동기)
 */

import { Reducer } from '@/mvi/base';
import { IngredientEditState, IngredientEditIntent } from './types';

export const ingredientEditReducer: Reducer<IngredientEditState, IngredientEditIntent> = (
  state,
  intent,
): IngredientEditState => {
  switch (intent.type) {
    case 'LOAD_INGREDIENT':
      return {
        ...state,
        loading: true,
        error: null,
      };

    case 'UPDATE_FORM_FIELD':
      return {
        ...state,
        editForm: {
          ...state.editForm,
          [intent.payload.field]: intent.payload.value,
        },
        // 필드 변경 시 해당 필드의 에러 제거
        errors: {
          ...state.errors,
          [intent.payload.field]: undefined,
        },
      };

    default:
      return state;
  }
};
