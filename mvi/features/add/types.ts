/**
 * Add Ingredient Screen MVI Types
 */

import { State } from '@/mvi/base';
import { Category } from '@/data/enums/category';
import { StorageLocation } from '@/data/enums/storage_location';
import { Unit } from '@/data/enums/unit';
import { CommonEffect } from '@/mvi/shared';

/**
 * Add Form State
 */
export interface AddFormData {
  name: string;
  emoji: string | null;
  category: Category;
  quantity: string | null;
  unit: Unit | null;
  purchased_date_time: string | null;
  expired_date_time: string | null;
  storage_location: StorageLocation | null;
  memo: string | null;
}

/**
 * Validation Errors
 */
export interface ValidationErrors {
  name?: string;
  quantity?: string;
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
export type AddEffect = CommonEffect;
