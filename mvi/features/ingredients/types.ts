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
  | { type: 'DELETE_INGREDIENT'; payload: number }
  | { type: 'ADD_TO_SHOPPING_LIST_INGREDIENT'; payload: number }
  | { type: 'BULK_ADD_INGREDIENTS'; payload: BulkAddIngredientsPayload[] }
  | { type: 'UPDATE_INGREDIENT_EXPIRY'; payload: { id: number; expiry_date: string } }
  | { type: 'UPDATE_INGREDIENT_QUANTITY'; payload: { id: number; quantity: string } }
  | { type: 'UPDATE_INGREDIENT_STORAGE'; payload: { id: number; storage_location: StorageLocation } }
  | { type: 'UPDATE_MEMO'; payload: { id: number; memo?: string } }
  | { type: 'NAVIGATE_TO_ADD' }
  | { type: 'NAVIGATE_TO_DETAIL'; payload: number }
  | { type: 'NAVIGATE_TO_DETAIL_EDIT'; payload: number };

/**
 * Ingredients Effect (부수 효과)
 */
export type IngredientsEffect = CommonEffect;
