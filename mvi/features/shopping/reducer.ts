/**
 * Shopping List Reducer
 *
 * Intent를 받아서 새로운 State를 반환 (동기)
 */

import { Reducer } from '@/mvi/base';
import { ShoppingState, ShoppingIntent } from './types';

export const shoppingReducer: Reducer<ShoppingState, ShoppingIntent> = (
  state,
  intent
): ShoppingState => {
  switch (intent.type) {
    case 'LOAD_SHOPPING_LIST':
      return {
        ...state,
        loading: true,
        error: null,
      };

    default:
      return state;
  }
};
