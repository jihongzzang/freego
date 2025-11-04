/**
 * Ingredient Detail Screen MVI Types
 */

import { Intent, State, Effect } from '@/mvi/base';
import { Ingredient as StoredIngredient } from '@/lib/storage';

/**
 * Ingredient with status
 */
export interface Ingredient extends StoredIngredient {
  status: string;
}

/**
 * Edit Form Data
 */
export interface EditFormData {
  name: string;
  category: string;
  quantity: string;
  unit: string;
  expiry_date: string;
  storage_location: string;
  memo: string;
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
  | { type: 'UPDATE_FORM_FIELD'; payload: { field: keyof EditFormData; value: string } }
  | { type: 'DELETE_INGREDIENT' }
  | { type: 'CONSUME_INGREDIENT' }
  | { type: 'UPDATE_INGREDIENT' };

/**
 * Ingredient Detail Effect (부수 효과)
 */
export type IngredientDetailEffect =
  | { type: 'SHOW_ALERT'; payload: { title: string; message: string; variant: 'success' | 'warning' | 'error' } }
  | { type: 'SHOW_CONFIRM'; payload: { title: string; message: string; onConfirm: () => void; isDanger?: boolean } }
  | { type: 'NAVIGATE_BACK' };
