/**
 * Settings Reducer
 */

import { Reducer } from '@/mvi/base';
import { SettingsState, SettingsIntent } from './types';

export const settingsReducer: Reducer<SettingsState, SettingsIntent> = (
  state,
  intent,
): SettingsState => {
  switch (intent.type) {
    case 'SET_NOTIFICATION_DAYS':
      return {
        ...state,
        notificationDays: intent.payload,
      };

    default:
      return state;
  }
};
