/**
 * Settings Reducer
 */

import { Reducer } from '@/mvi/base';
import { SettingsState, SettingsIntent } from './types';

export const settingsReducer: Reducer<SettingsState, SettingsIntent> = (
  state,
  intent
): SettingsState => {
  switch (intent.type) {
    case 'SET_NOTIFICATION_DAYS':
      return {
        ...state,
        notificationDays: intent.payload,
      };

    case 'CLEAR_ALL_DATA':
      return {
        ...state,
        isClearing: true,
      };

    case 'CLEAR_ALL_DATA_SUCCESS':
      return {
        ...state,
        isClearing: false,
      };

    case 'CLEAR_ALL_DATA_ERROR':
      return {
        ...state,
        isClearing: false,
      };

    default:
      return state;
  }
};
