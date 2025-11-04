/**
 * Add Ingredient Screen MVI Types
 */

import { Intent, State, Effect } from '@/mvi/base';

/**
 * Add Form State
 */
export interface AddFormData {
  name: string;
  category: string;
  quantity: string;
  unit: string;
  expiry_date: string;
  storage_location: string;
  memo: string;
}

/**
 * Validation Errors
 */
export interface ValidationErrors {
  name?: string;
  quantity?: string;
  expiry_date?: string;
}

/**
 * Add State
 */
export interface AddState extends State {
  form: AddFormData;
  mode: 'select' | 'manual';
  isSubmitting: boolean;
  errors: ValidationErrors;
}

/**
 * Add Intent (사용자 액션)
 */
export type AddIntent =
  | { type: 'SET_MODE'; payload: 'select' | 'manual' }
  | { type: 'UPDATE_FIELD'; payload: { field: keyof AddFormData; value: string } }
  | { type: 'UPDATE_FORM'; payload: Partial<AddFormData> }
  | { type: 'SUBMIT_FORM' }
  | { type: 'SUBMIT_SUCCESS' }
  | { type: 'SUBMIT_ERROR'; payload: string }
  | { type: 'RESET_FORM' }
  | { type: 'VALIDATE_FORM' };

/**
 * Add Effect (부수 효과)
 */
export type AddEffect =
  | { type: 'SHOW_ALERT'; payload: { title: string; message: string; variant: 'success' | 'warning' | 'error' } }
  | { type: 'NAVIGATE_HOME' };
