/**
 * Ingredients Reducer
 *
 * Intent를 받아서 새로운 State를 반환 (동기)
 */

import { Reducer } from '@/mvi/base';
import { IngredientsState, IngredientsIntent } from './types';

export const ingredientsReducer: Reducer<IngredientsState, IngredientsIntent> = (
  state,
  intent
): IngredientsState => {
  switch (intent.type) {
    // LOAD_INGREDIENTS는 미들웨어에서 처리하므로 리듀서에서는 상태 변경 없음
    case 'LOAD_INGREDIENTS':
      return state;

    case 'LOAD_INGREDIENTS_SUCCESS':
      return {
        ...state,
        ingredients: intent.payload,
        loading: false,
        error: null,
      };

    case 'LOAD_INGREDIENTS_ERROR':
      return {
        ...state,
        loading: false,
        error: intent.payload,
      };

    default:
      return state;
  }
};
