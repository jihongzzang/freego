/**
 * Shopping List Reducer
 *
 * Intent를 받아서 새로운 State를 반환 (동기)
 */

import { Reducer } from '@/mvi/base';
import { ShoppingState, ShoppingIntent } from './types';

export const shoppingReducer: Reducer<ShoppingState, ShoppingIntent> = (state, intent): ShoppingState => {
  switch (intent.type) {
    case 'TOGGLE_SELECT': {
      const newSelectedIds = new Set(state.selectedIds);
      const id = intent.payload.id;

      if (newSelectedIds.has(id)) {
        newSelectedIds.delete(id);
      } else {
        newSelectedIds.add(id);
      }

      return {
        ...state,
        selectedIds: newSelectedIds,
      };
    }

    case 'TOGGLE_SELECT_ALL': {
      const allSelected = state.selectedIds.size === state.shoppingList.length;

      return {
        ...state,
        selectedIds: allSelected ? new Set<string>() : new Set(state.shoppingList.map((item) => item.id)),
      };
    }

    case 'LOAD_SHOPPING_LIST': {
      // 로드 시 선택 해제
      return {
        ...state,
        selectedIds: new Set<string>(),
      };
    }

    default:
      return state;
  }
};
