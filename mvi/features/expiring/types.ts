/**
 * Expiring Screen MVI Types
 */

import { Intent, State, Effect } from '@/mvi/base';
import { Ingredient } from '@/data/models/ingredient.model';

/**
 * Expiring State
 */
export interface ExpiringState extends State {
  ingredients: Ingredient[];
  loading: boolean;
  error: string | null;
}

/**
 * Expiring Intent (사용자 액션)
 */
export type ExpiringIntent =
  | { type: 'LOAD_INGREDIENTS' }
  | { type: 'LOAD_INGREDIENTS_SUCCESS'; payload: Ingredient[] }
  | { type: 'LOAD_INGREDIENTS_ERROR'; payload: string }
  | { type: 'DELETE_INGREDIENT'; payload: number }
  | { type: 'NAVIGATE_TO_DETAIL'; payload: string }
  | { type: 'NAVIGATE_BACK' };

/**
 * Expiring Effect (부수 효과)
 */
export type ExpiringEffect = { type: 'NAVIGATE'; payload: string } | { type: 'SHOW_TOAST'; message: string };
