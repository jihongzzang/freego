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
  };
}

/**
 * Shopping Intent (사용자 액션)
 */
export type ShoppingIntent =
  | { type: 'LOAD_SHOPPING_LIST' }
  | { type: 'TOGGLE_SELECT'; payload: { id: string } }
  | { type: 'TOGGLE_SELECT_ALL' }
  | { type: 'DELETE_ITEM'; payload: { id: string; name: string } }
  | { type: 'DELETE_SELECTED' }
  | {
      type: 'ADD_ITEM_TO_STORAGE';
      payload: { id: string; name: string; category: Category; storageLocation: StorageLocation };
    }
  | { type: 'ADD_SELECTED_TO_STORAGE' }
  | { type: 'SUBMIT_ADD_ITEM'; payload: { name: string; category: Category; memo?: string } }
  | { type: 'UPDATE_MEMO'; payload: { id: string; memo?: string } };

/**
 * Shopping Effect (부수 효과)
 */
export type ShoppingEffect = CommonEffect;
