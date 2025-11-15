/**
 * Settings Screen MVI Types
 */

import { Intent, State, Effect } from '@/mvi/base';
import { CommonEffect } from '@/mvi/shared';

/**
 * Settings State
 */
export interface SettingsState extends State {
  notificationDays: number;
  isClearing: boolean;
}

/**
 * Settings Intent
 */
export type SettingsIntent =
  | { type: 'LOAD_NOTIFICATION_DAYS' }
  | { type: 'SET_NOTIFICATION_DAYS'; payload: number }
  | { type: 'DELETE_ALL_DATA' }
  | { type: 'OPEN_PRIVACY_POLICY' }
  | { type: 'OPEN_TERMS_OF_SERVICE' }
  | { type: 'RATE_APP' };

/**
 * Settings Effect
 */
export type SettingsEffect = CommonEffect;
