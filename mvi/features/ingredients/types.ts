/**
 * Ingredients Screen MVI Types
 */

import { Intent, State, Effect } from '@/mvi/base';
import { Ingredient as StoredIngredient } from '@/data/models/ingredient.model';
import { StatusType } from '@/data/enums/status';

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
  | { type: 'DELETE_INGREDIENT'; payload: number }
  | { type: 'ADD_TO_SHOPPING_LIST_INGREDIENT'; payload: number }
  | {
      type: 'BULK_ADD_INGREDIENTS';
      payload: Array<{
        name: string;
        category: number;
        emoji?: string;
        storage_location?: number;
        quantity?: number;
        unit?: number;
        registration_date?: string;
        purchase_date?: string;
        expiry_date?: string;
        memo?: string;
      }>;
    }
  | { type: 'NAVIGATE_TO_ADD' }
  | { type: 'NAVIGATE_TO_DETAIL'; payload: number }
  | { type: 'NAVIGATE_TO_DETAIL_EDIT'; payload: number };

/**
 * Ingredients Effect (부수 효과)
 */
export type IngredientsEffect =
  | { type: 'NAVIGATE'; payload: string }
  | {
      type: 'SHOW_TOAST';
      payload: {
        message: string;
        variant: 'success' | 'error' | 'info' | 'warning';
      };
    };
