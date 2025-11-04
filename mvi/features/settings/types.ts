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
  | { type: 'SET_NOTIFICATION_DAYS'; payload: number }
  | { type: 'CLEAR_ALL_DATA' }
  | { type: 'CLEAR_ALL_DATA_SUCCESS' }
  | { type: 'CLEAR_ALL_DATA_ERROR'; payload: string };

/**
 * Settings Effect
 */
export type SettingsEffect =
  | { type: 'SHOW_ALERT'; payload: { title: string; message: string; type: 'success' | 'error' } }
  | { type: 'SHOW_CONFIRM'; payload: { title: string; message: string; onConfirm: () => void } };
