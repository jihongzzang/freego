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

    default:
      return state;
  }
};
