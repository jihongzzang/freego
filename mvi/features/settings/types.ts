/**
 * Settings Screen MVI Types
 */

import { Intent, State, Effect } from '@/mvi/base';

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
  | { type: 'DELETE_ALL_DATA' };

/**
 * Settings Effect
 */
export type SettingsEffect = {
  type: 'SHOW_TOAST';
  payload: {
    message: string;
    variant: 'success' | 'error' | 'info' | 'warning';
  };
};
