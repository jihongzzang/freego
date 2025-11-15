/**
 * Ingredient Detail Screen MVI Types
 */

import { Intent, State, Effect } from '@/mvi/base';
import { Category } from '@/data/enums/category';
import { StorageLocation } from '@/data/enums/storage_location';
import { Ingredient } from '@/data/models/ingredient.model';
import { Unit } from '@/data/enums/unit';
import { CommonEffect } from '@/mvi/shared';

/**
 * Ingredient Detail State
 */
export interface IngredientDetailState extends State {
  ingredient: Ingredient | null;
  loading: boolean;
  error: string | null;
}

/**
 * Ingredient Detail Intent (사용자 액션)
 */
export type IngredientDetailIntent =
  | { type: 'LOAD_INGREDIENT'; payload: string }
  | { type: 'DELETE_INGREDIENT' }
  | { type: 'CONSUME_INGREDIENT' }
  | { type: 'DELETE_SUCCESS' }
  | { type: 'CONSUME_SUCCESS'; payload: { name: string } }
  | { type: 'NAVIGATE_TO_EDIT' }
  | { type: 'NAVIGATE_BACK' };

/**
 * Ingredient Detail Effect (부수 효과)
 */
export type IngredientDetailEffect = CommonEffect | { type: 'NAVIGATE_TO_EDIT'; payload: { id: string } };
