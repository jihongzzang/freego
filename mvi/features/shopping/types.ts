/**
 * Shopping List Screen MVI Types
 */

import { Intent, State, Effect } from '@/mvi/base';
import { ShoppingItem } from '@/data/models/shopping.model';
import { Category } from '@/data/enums/category';
import { StorageLocation } from '@/data/enums/storage_location';
import { CommonEffect } from '@/mvi/shared';

/**
 * Shopping State
 */
export interface ShoppingState extends State {
  shoppingList: ShoppingItem[];
  selectedIds: Set<string>; // 선택된 항목 ID
  loading: boolean;
  error: string | null;
  isAddingItem: boolean;
  addForm: {
    name: string;
    category: Category;
    emoji: string | null;
  };
}

/**
 * Shopping Intent (사용자 액션)
 */
export type ShoppingIntent =
  | { type: 'LOAD_SHOPPING_LIST' }
  | { type: 'TOGGLE_SELECT'; payload: { id: string } }
  | { type: 'TOGGLE_SELECT_ALL' }
  | { type: 'CLEAR_SELECTION' }
  | { type: 'SET_SELECTION'; payload: { ids: string[] } }
  | { type: 'DELETE_ITEM'; payload: { id: string; name: string } }
  | { type: 'DELETE_SELECTED' }
  | { type: 'DELETE_DATE_ITEMS'; payload: { dateKey: string; itemIds: string[] } }
  | {
      type: 'ADD_ITEM_TO_STORAGE';
      payload: { id: string; name: string; category: Category; storageLocation: StorageLocation };
    }
  | { type: 'ADD_SELECTED_TO_STORAGE' }
  | { type: 'SUBMIT_ADD_ITEM'; payload: { name: string; category: Category; memo?: string; emoji: string } }
  | { type: 'UPDATE_MEMO'; payload: { id: string; memo?: string } }
  | { type: 'UPDATE_EMOJI'; payload: { id: string; emoji: string } }
  | { type: 'CANCEL_PURCHASE'; payload: { id: string; name: string } }
  | { type: 'REPURCHASE'; payload: { id: string; name: string } };

/**
 * Shopping Effect (부수 효과)
 */
export type ShoppingEffect = CommonEffect;
