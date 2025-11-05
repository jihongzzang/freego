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
    case 'TOGGLE_ADD_MODAL':
      return {
        ...state,
        isAddingItem: intent.payload,
        addForm: intent.payload ? state.addForm : { name: '', category: '채소' },
      };

    case 'UPDATE_ADD_FORM':
      return {
        ...state,
        addForm: {
          ...state.addForm,
          [intent.payload.field]: intent.payload.value,
        },
      };

    default:
      return state;
  }
};
