/**
 * Shopping List Screen MVI Types
 */

import { Intent, State, Effect } from '@/mvi/base';
import { ShoppingItem } from '@/lib/storage';

/**
 * Shopping State
 */
export interface ShoppingState extends State {
  shoppingList: ShoppingItem[];
  loading: boolean;
  error: string | null;
  isAddingItem: boolean;
  addForm: {
    name: string;
    category: string;
  };
}

/**
 * Shopping Intent (사용자 액션)
 */
export type ShoppingIntent =
  | { type: 'LOAD_SHOPPING_LIST' }
  | {
      type: 'TOGGLE_PURCHASED';
      payload: { id: string; currentStatus: boolean };
    }
  | { type: 'DELETE_ITEM'; payload: { id: string; name: string } }
  | { type: 'CLEAR_PURCHASED' }
  | { type: 'TOGGLE_ADD_MODAL'; payload: boolean }
  | {
      type: 'UPDATE_ADD_FORM';
      payload: { field: 'name' | 'category'; value: string };
    }
  | { type: 'SUBMIT_ADD_ITEM' };

/**
 * Shopping Effect (부수 효과)
 */
export type ShoppingEffect =
  | {
      type: 'SHOW_ALERT';
      payload: {
        title: string;
        message: string;
        variant: 'success' | 'info' | 'warning' | 'error';
      };
    }
  | {
      type: 'SHOW_CONFIRM';
      payload: {
        title?: string;
        message: string;
        onConfirm: () => void;
        isDanger?: boolean;
      };
    };
