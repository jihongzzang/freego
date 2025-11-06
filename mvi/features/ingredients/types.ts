/**
 * Ingredients Screen MVI Types
 */

import { Intent, State, Effect } from '@/mvi/base';
import { Ingredient as StoredIngredient } from '@/lib/storage';
import { StatusType } from '@/constants/itemStatus';

/**
 * Ingredient with status
 */
export interface Ingredient extends StoredIngredient {
  status: StatusType;
  daysRemaining: number | null;
}

/**
 * Ingredients State
 */
export interface IngredientsState extends State {
  ingredients: Ingredient[];
  loading: boolean;
  error: string | null;
}

/**
 * Ingredients Intent (사용자 액션)
 */
export type IngredientsIntent =
  | { type: 'LOAD_INGREDIENTS' }
  | { type: 'LOAD_INGREDIENTS_SUCCESS'; payload: Ingredient[] }
  | { type: 'LOAD_INGREDIENTS_ERROR'; payload: string }
  | { type: 'DELETE_INGREDIENT'; payload: string }
  | { type: 'NAVIGATE_TO_ADD' }
  | { type: 'NAVIGATE_TO_DETAIL'; payload: string }
  | { type: 'NAVIGATE_TO_DETAIL_EDIT'; payload: string }
  | { type: 'NAVIGATE_BACK' };

/**
 * Ingredients Effect (부수 효과)
 */
export type IngredientsEffect =
  | { type: 'NAVIGATE'; payload: string }
  | { type: 'SHOW_TOAST'; payload: string };
