/**
 * Expiring Screen MVI Types
 */

import { Intent, State, Effect } from '@/mvi/base';
import { Ingredient as StoredIngredient } from '@/lib/storage';

/**
 * Ingredient with status
 */
export interface Ingredient extends StoredIngredient {
  status: '신선' | '주의' | '소모됨';
  daysRemaining: number | null;
}

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
  | { type: 'DELETE_INGREDIENT'; payload: string }
  | { type: 'NAVIGATE_TO_DETAIL'; payload: string }
  | { type: 'NAVIGATE_BACK' };

/**
 * Expiring Effect (부수 효과)
 */
export type ExpiringEffect =
  | { type: 'NAVIGATE'; payload: string }
  | { type: 'SHOW_TOAST'; payload: string };
