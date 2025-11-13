/**
 * Ingredients Screen MVI Types
 */

import { StorageLocation } from '@/data/enums/storage_location';
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
 * Ingredients State
 */
export interface IngredientsState extends IngredientListState {}

/**
 * Ingredients Intent (사용자 액션)
 */
export type IngredientsIntent =
  | LoadIngredientsIntent
  | { type: 'ADD_TO_SHOPPING_LIST_INGREDIENT'; payload: string }
  | { type: 'NAVIGATE_TO_DETAIL_EDIT'; payload: string }
  | { type: 'NAVIGATE_TO_DETAIL'; payload: string }
  | { type: 'DELETE_INGREDIENT'; payload: string }
  | { type: 'NAVIGATE_TO_ADD' }
  | { type: 'BULK_ADD_INGREDIENTS'; payload: BulkAddIngredientsPayload[] }
  | { type: 'UPDATE_INGREDIENT_EXPIRY'; payload: { id: string; expired_date_time: string } }
  | { type: 'UPDATE_INGREDIENT_QUANTITY'; payload: { id: string; quantity: string } }
  | { type: 'UPDATE_INGREDIENT_STORAGE'; payload: { id: string; storage_location: StorageLocation } }
  | { type: 'UPDATE_INGREDIENT_EMOJI'; payload: { id: string; emoji: string } }
  | { type: 'UPDATE_MEMO'; payload: { id: string; memo: string | null } };

/**
 * Ingredients Effect (부수 효과)
 */
export type IngredientsEffect = CommonEffect;
