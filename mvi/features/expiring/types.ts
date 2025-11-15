/**
 * Expiring Screen MVI Types
 */

import { IngredientListState, LoadIngredientsIntent, CommonEffect, EnrichedIngredient } from '@/mvi/shared';

/**
 * Ingredient 타입 re-export (하위 호환성)
 */
export type Ingredient = EnrichedIngredient;

/**
 * Expiring State
 */
export interface ExpiringState extends IngredientListState {}

/**
 * Expiring Intent (사용자 액션)
 */
export type ExpiringIntent =
  | LoadIngredientsIntent
  | { type: 'DELETE_INGREDIENT'; payload: string }
  | { type: 'ADD_TO_SHOPPING_LIST_INGREDIENT'; payload: string }
  | { type: 'NAVIGATE_TO_DETAIL'; payload: string }
  | { type: 'NAVIGATE_BACK' };

/**
 * Expiring Effect (부수 효과)
 */
export type ExpiringEffect = CommonEffect;
