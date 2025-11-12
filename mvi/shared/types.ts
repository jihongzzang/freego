/**
 * MVI Shared Types
 *
 * 여러 feature에서 공통으로 사용하는 타입 정의
 */

import { State } from '@/mvi/base';
import { Ingredient as StoredIngredient } from '@/data/models/ingredient.model';
import { StatusType } from '@/data/enums/status';

/**
 * 상태가 추가된 재료 (status, daysRemaining)
 */
export interface EnrichedIngredient extends StoredIngredient {
  status: StatusType;
  daysRemaining: number | null;
}

/**
 * 재료 리스트를 가진 공통 State
 */
export interface IngredientListState extends State {
  ingredients: EnrichedIngredient[];
  loading: boolean;
  error: string | null;
}

/**
 * Toast 메시지 Payload
 */
export interface ToastPayload {
  message: string;
  variant: 'success' | 'error' | 'info' | 'warning';
}

/**
 * Confirm 다이얼로그 Payload
 */
export interface ConfirmPayload {
  title: string;
  message: string;
  onConfirm: () => Promise<{ success: boolean; count?: number }>;
  isDanger?: boolean;
}

/**
 * 공통 Effect 타입
 */
export type CommonEffect =
  | { type: 'NAVIGATE'; payload: string }
  | { type: 'NAVIGATE_BACK' }
  | { type: 'SHOW_TOAST'; payload: ToastPayload }
  | { type: 'SHOW_CONFIRM'; payload: ConfirmPayload };

/**
 * 재료 로딩 관련 공통 Intent
 */
export type LoadIngredientsIntent =
  | { type: 'LOAD_INGREDIENTS' }
  | { type: 'LOAD_INGREDIENTS_SUCCESS'; payload: EnrichedIngredient[] }
  | { type: 'LOAD_INGREDIENTS_ERROR'; payload: string };

/**
 * 대량 재료 추가 Payload
 */
export interface BulkAddIngredientsPayload {
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
}
