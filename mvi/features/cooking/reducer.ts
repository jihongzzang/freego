/**
 * Cooking Reducer
 *
 * Intent를 받아서 새로운 State를 반환 (동기)
 */

import { Reducer } from '@/mvi/base';
import { CookingState, CookingIntent } from './types';

export const cookingReducer: Reducer<CookingState, CookingIntent> = (
  state,
  intent
): CookingState => {
  switch (intent.type) {
    case 'LOAD_INGREDIENTS':
      return {
        ...state,
        loading: true,
        error: null,
      };

    case 'SELECT_RECIPE':
      return {
        ...state,
        selectedRecipe: intent.payload,
      };

    default:
      return state;
  }
};
