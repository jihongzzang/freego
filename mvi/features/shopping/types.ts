/**
 * Shopping List Screen MVI Types
 */

import { Intent, State, Effect } from '@/mvi/base';
import { ShoppingItem } from '@/data/models/shopping.model';
import { Category } from '@/data/enums/category';

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
    category: Category;
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
  | { type: 'CLEAR_UNPURCHASED' }
  | { type: 'SUBMIT_ADD_ITEM' };

/**
 * Shopping Effect (부수 효과)
 */
export type ShoppingEffect =
  | {
      type: 'SHOW_CONFIRM';
      payload: {
        title?: string;
        message: string;
        onConfirm: () => Promise<any>;
        isDanger?: boolean;
      };
    }
  | {
      type: 'SHOW_TOAST';
      payload: {
        message: string;
        variant: 'success' | 'info' | 'warning' | 'error';
      };
    };
