/**
 * Home Screen MVI Types
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
  | { type: 'DELETE_INGREDIENT'; payload: number }
  | { type: 'UPDATE_EXPIRY_DATE'; payload: { id: number; expiryDate: string } }
  | { type: 'NAVIGATE_TO_ADD'; payload?: number }
  | { type: 'NAVIGATE_TO_INGREDIENTS'; payload?: number }
  | { type: 'NAVIGATE_TO_EXPIRING' }
  | { type: 'NAVIGATE_TO_DETAIL'; payload: number };

/**
 * Home Effect (부수 효과)
 */
export type HomeEffect = { type: 'NAVIGATE'; payload: string } | { type: 'SHOW_TOAST'; payload: string };
