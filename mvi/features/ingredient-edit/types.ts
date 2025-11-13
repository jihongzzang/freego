/**
 * Ingredient Edit Screen MVI Types
 */

import { Intent, State, Effect } from '@/mvi/base';
import { Category } from '@/data/enums/category';
import { StorageLocation } from '@/data/enums/storage_location';
import { Ingredient } from '@/data/models/ingredient.model';
import { Unit } from '@/data/enums/unit';
import { CommonEffect } from '@/mvi/shared';

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
 * Ingredient Edit State
 */
export interface IngredientEditState extends State {
  ingredient: Ingredient | null;
  editForm: EditFormData;
  loading: boolean;
  error: string | null;
  errors: Partial<Record<keyof EditFormData, string>>;
}

/**
 * Ingredient Edit Intent (사용자 액션)
 */
export type IngredientEditIntent =
  | { type: 'LOAD_INGREDIENT'; payload: string }
  | {
      type: 'UPDATE_FORM_FIELD';
      payload: { field: keyof EditFormData; value: any };
    }
  | { type: 'UPDATE_INGREDIENT' }
  | { type: 'NAVIGATE_BACK' };

/**
 * Ingredient Edit Effect (부수 효과)
 */
export type IngredientEditEffect = CommonEffect;
