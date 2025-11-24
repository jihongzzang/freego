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
      // 구매 예정 항목만 필터링
      const unpurchasedItems = state.shoppingList.filter((item) => !item.is_purchased);
      const unpurchasedIds = unpurchasedItems.map((item) => item.id);

      // 구매 예정 항목이 모두 선택되어 있는지 확인
      const allUnpurchasedSelected = unpurchasedIds.every((id) => state.selectedIds.has(id));

      const newSelectedIds = allUnpurchasedSelected ? new Set<string>() : new Set(unpurchasedIds);

      return {
        ...state,
        selectedIds: newSelectedIds,
      };
    }

    case 'CLEAR_SELECTION': {
      return {
        ...state,
        selectedIds: new Set<string>(),
      };
    }

    case 'SET_SELECTION': {
      const newSelectedIds = new Set(intent.payload.ids);

      return {
        ...state,
        selectedIds: newSelectedIds,
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
