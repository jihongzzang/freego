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

      console.log('🔵 TOGGLE_SELECT:', {
        id,
        before: state.selectedIds.size,
        after: newSelectedIds.size,
        selectedIds: Array.from(newSelectedIds),
      });

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

      console.log('🟢 TOGGLE_SELECT_ALL:', {
        unpurchasedCount: unpurchasedItems.length,
        allUnpurchasedSelected,
        before: state.selectedIds.size,
        after: newSelectedIds.size,
        selectedIds: Array.from(newSelectedIds),
      });

      return {
        ...state,
        selectedIds: newSelectedIds,
      };
    }

    case 'CLEAR_SELECTION': {
      console.log('🔴 CLEAR_SELECTION:', {
        before: state.selectedIds.size,
        selectedIds: Array.from(state.selectedIds),
      });

      return {
        ...state,
        selectedIds: new Set<string>(),
      };
    }

    case 'SET_SELECTION': {
      const newSelectedIds = new Set(intent.payload.ids);

      console.log('🟣 SET_SELECTION:', {
        before: state.selectedIds.size,
        after: newSelectedIds.size,
        beforeIds: Array.from(state.selectedIds),
        afterIds: Array.from(newSelectedIds),
      });

      return {
        ...state,
        selectedIds: newSelectedIds,
      };
    }

    case 'LOAD_SHOPPING_LIST': {
      console.log('🟡 LOAD_SHOPPING_LIST (reducer):', {
        before: state.selectedIds.size,
        selectedIds: Array.from(state.selectedIds),
      });

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
