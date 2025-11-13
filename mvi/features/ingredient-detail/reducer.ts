/**
 * Ingredient Detail Reducer
 *
 * Intent를 받아서 새로운 State를 반환 (동기)
 */

import { Reducer } from '@/mvi/base';
import { IngredientDetailState, IngredientDetailIntent } from './types';

export const ingredientDetailReducer: Reducer<IngredientDetailState, IngredientDetailIntent> = (
  state,
  intent,
): IngredientDetailState => {
  switch (intent.type) {
    case 'LOAD_INGREDIENT':
      return {
        ...state,
        loading: true,
        error: null,
      };

    case 'SET_EDITING':
      // 편집 모드를 종료할 때(false) editForm을 원본 ingredient 데이터로 초기화
      if (!intent.payload && state.ingredient) {
        return {
          ...state,
          isEditing: false,
          editForm: {
            name: state.ingredient.name,
            emoji: state.ingredient.emoji,
            category: state.ingredient.category,
            quantity: state.ingredient.quantity?.toString() || '',
            unit: state.ingredient.unit,
            purchased_date_time: state.ingredient.purchased_date_time,
            expired_date_time: state.ingredient.expired_date_time,
            storage_location: state.ingredient.storage_location,
            memo: state.ingredient.memo || '',
          },
        };
      }
      return {
        ...state,
        isEditing: intent.payload,
      };

    case 'UPDATE_FORM_FIELD':
      return {
        ...state,
        editForm: {
          ...state.editForm,
          [intent.payload.field]: intent.payload.value,
        },
      };

    default:
      return state;
  }
};
