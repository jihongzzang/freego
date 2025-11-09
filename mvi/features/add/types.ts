/**
 * Add Ingredient Screen MVI Types
 */

import { State } from '@/mvi/base';
import { Category } from '@/data/enums/category';
import { StorageLocation } from '@/data/enums/storage_location';
import { Unit } from '@/data/enums/unit';

/**
 * Add Form State
 */
export interface AddFormData {
  name: string;
  emoji?: string;
  category: Category;
  quantity?: string;
  unit?: Unit;
  purchased_date?: string;
  expiry_date?: string;
  storage_location?: StorageLocation;
  memo?: string;
}

/**
 * Validation Errors
 */
export interface ValidationErrors {
  name?: string;
  expiry_date?: string;
}

/**
 * Add State
 */
export interface AddState extends State {
  form: AddFormData;
  isSubmitting: boolean;
  errors: ValidationErrors;
}

/**
 * Add Intent (사용자 액션)
 */
export type AddIntent =
  | {
      type: 'UPDATE_FIELD';
      payload: { field: keyof AddFormData; value: string };
    }
  | { type: 'SUBMIT_FORM' }
  | { type: 'VALIDATE_FORM' }
  | { type: 'NAVIGATE_BACK' };

/**
 * Add Effect (부수 효과)
 */
export type AddEffect =
  | {
      type: 'SHOW_TOAST';
      payload: {
        message: string;
        variant: 'success' | 'error' | 'info' | 'warning';
      };
    }
  | { type: 'NAVIGATE_HOME' }
  | { type: 'NAVIGATE_BACK' };
