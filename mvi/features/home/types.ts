/**
 * Home Screen MVI Types
 */

import {
  IngredientListState,
  LoadIngredientsIntent,
  CommonEffect,
  BulkAddIngredientsPayload,
  EnrichedIngredient,
} from '@/mvi/shared';

/**
 * Ingredient 타입 re-export (하위 호환성)
 */
export type Ingredient = EnrichedIngredient;

/**
 * Home State
 */
export interface HomeState extends IngredientListState {}

/**
 * Home Intent (사용자 액션)
 */
export type HomeIntent =
  | LoadIngredientsIntent
  | { type: 'UPDATE_EXPIRY_DATE'; payload: { id: string; expired_date_time: string } }
  | { type: 'BULK_ADD_INGREDIENTS'; payload: BulkAddIngredientsPayload[] }
  | { type: 'NAVIGATE_TO_ADD'; payload: string | null }
  | { type: 'NAVIGATE_TO_EXPIRING' }
  | { type: 'NAVIGATE_TO_DETAIL'; payload: string };

/**
 * Home Effect (부수 효과)
 */
export type HomeEffect = CommonEffect;
