/**
 * Add Ingredient Screen MVI Types
 */

import { Intent, State, Effect } from '@/mvi/base';
import { CategoryType } from '@/constants/categories';
import { StorageLocationType } from '@/constants/storageLocations';
import { UnitType } from '@/constants/units';

/**
 * Add Form State
 */
export interface AddFormData {
  name: string;
  emoji?: string;
  category: CategoryType;
  quantity?: string;
  unit?: UnitType;
  purchase_date?: string;
  expiry_date: string;
  storage_location?: StorageLocationType;
  memo: string;
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
  mode: 'select' | 'manual';
  isSubmitting: boolean;
  errors: ValidationErrors;
}

/**
 * Add Intent (사용자 액션)
 */
export type AddIntent =
  | { type: 'SET_MODE'; payload: 'select' | 'manual' }
  | {
      type: 'UPDATE_FIELD';
      payload: { field: keyof AddFormData; value: string };
    }
  | { type: 'UPDATE_FORM'; payload: Partial<AddFormData> }
  | { type: 'SUBMIT_FORM' }
  | { type: 'SUBMIT_SUCCESS' }
  | { type: 'SUBMIT_ERROR'; payload: string }
  | { type: 'RESET_FORM' }
  | { type: 'VALIDATE_FORM' }
  | { type: 'NAVIGATE_BACK' };

/**
 * Add Effect (부수 효과)
 */
export type AddEffect =
  | {
      type: 'SHOW_ALERT';
      payload: {
        title: string;
        message: string;
        variant: 'success' | 'warning' | 'error';
      };
    }
  | { type: 'NAVIGATE_HOME' }
  | { type: 'NAVIGATE_BACK' };
