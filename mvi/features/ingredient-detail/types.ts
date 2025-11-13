/**
 * Ingredient Detail Screen MVI Types
 */

import { Intent, State, Effect } from '@/mvi/base';
import { Category } from '@/data/enums/category';
import { StorageLocation } from '@/data/enums/storage_location';
import { Ingredient } from '@/data/models/ingredient.model';
import { Unit } from '@/data/enums/unit';

/**
 * Edit Form Data
 */
export interface EditFormData {
  name: string;
  emoji: string | null;
  category: Category;
  quantity: string | null;
  unit: Unit | null;
  purchased_date_time: string | null;
  expired_date_time: string | null;
  storage_location: StorageLocation | null;
  memo: string | null;
}

/**
 * Ingredient Detail State
 */
export interface IngredientDetailState extends State {
  ingredient: Ingredient | null;
  editForm: EditFormData;
  isEditing: boolean;
  loading: boolean;
  error: string | null;
}

/**
 * Ingredient Detail Intent (사용자 액션)
 */
export type IngredientDetailIntent =
  | { type: 'LOAD_INGREDIENT'; payload: string }
  | { type: 'SET_EDITING'; payload: boolean }
  | {
      type: 'UPDATE_FORM_FIELD';
      payload: { field: keyof EditFormData; value: any };
    }
  | { type: 'DELETE_INGREDIENT' }
  | { type: 'CONSUME_INGREDIENT' }
  | { type: 'UPDATE_INGREDIENT' }
  | { type: 'DELETE_SUCCESS' }
  | { type: 'CONSUME_SUCCESS'; payload: { name: string } }
  | { type: 'NAVIGATE_BACK' };

/**
 * Ingredient Detail Effect (부수 효과)
 */
export type IngredientDetailEffect =
  | {
      type: 'SHOW_TOAST';
      payload: {
        message: string;
        variant: 'success' | 'error' | 'info' | 'warning';
      };
    }
  | {
      type: 'SHOW_CONFIRM';
      payload: {
        title?: string;
        message: string;
        onConfirm: () => void | Promise<void | { success: boolean; ingredientName?: string }>;
        isDanger?: boolean;
      };
    }
  | { type: 'NAVIGATE_BACK' };
