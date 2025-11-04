/**
 * Cooking Screen MVI Types
 */

import { Intent, State, Effect } from '@/mvi/base';
import { Recipe } from '@/lib/recipes';

/**
 * Cooking State
 */
export interface CookingState extends State {
  ingredients: any[];
  availableRecipes: Recipe[];
  selectedRecipe: Recipe | null;
  loading: boolean;
  error: string | null;
}

/**
 * Cooking Intent (사용자 액션)
 */
export type CookingIntent =
  | { type: 'LOAD_INGREDIENTS' }
  | { type: 'SELECT_RECIPE'; payload: Recipe | null }
  | { type: 'COOK_RECIPE'; payload: Recipe };

/**
 * Cooking Effect (부수 효과)
 */
export type CookingEffect =
  | { type: 'SHOW_ALERT'; payload: { title: string; message: string; variant: 'success' | 'warning' | 'error' } }
  | { type: 'SHOW_CONFIRM'; payload: { title: string; message: string; onConfirm: () => void } }
  | { type: 'NAVIGATE_BACK' };
