/**
 * Home Screen MVI Types
 */

import { Intent, State, Effect } from '@/mvi/base';
import { Ingredient as StoredIngredient } from '@/data/models/ingredient.model';
import { StatusType } from '@/constants/itemStatus';

/**
 * Ingredient with status
 */
export interface Ingredient extends StoredIngredient {
  status: StatusType;
  daysRemaining: number | null;
}

/**
 * Home State
 */
export interface HomeState extends State {
  ingredients: Ingredient[];
  loading: boolean;
  error: string | null;
}

/**
 * Home Intent (사용자 액션)
 */
export type HomeIntent =
  | { type: 'LOAD_INGREDIENTS' }
  | { type: 'LOAD_INGREDIENTS_SUCCESS'; payload: Ingredient[] }
  | { type: 'LOAD_INGREDIENTS_ERROR'; payload: string }
  | { type: 'DELETE_INGREDIENT'; payload: string }
  | { type: 'UPDATE_EXPIRY_DATE'; payload: { id: string; expiryDate: string } }
  | { type: 'NAVIGATE_TO_ADD'; payload?: string }
  | { type: 'NAVIGATE_TO_INGREDIENTS'; payload?: string }
  | { type: 'NAVIGATE_TO_EXPIRING' }
  | { type: 'NAVIGATE_TO_DETAIL'; payload: string };

/**
 * Home Effect (부수 효과)
 */
export type HomeEffect = { type: 'NAVIGATE'; payload: string } | { type: 'SHOW_TOAST'; payload: string };
