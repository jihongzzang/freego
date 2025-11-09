/**
 * Settings Middleware
 */

import { Middleware, MiddlewareResult } from '@/mvi/base';
import { SettingsState, SettingsIntent, SettingsEffect } from './types';
import { saveNotificationDays, getNotificationDays } from '@/services/notification.service';

export const settingsMiddleware: Middleware<SettingsState, SettingsIntent, SettingsEffect> = async (
  state,
  intent,
): Promise<MiddlewareResult<SettingsState, SettingsEffect>> => {
  switch (intent.type) {
    case 'LOAD_NOTIFICATION_DAYS': {
      const days = await getNotificationDays();
      return {
        state: {
          ...state,
          notificationDays: days,
        },
      };
    }

    case 'SET_NOTIFICATION_DAYS':
      // AsyncStorage에 저장
      await saveNotificationDays(intent.payload);

      return {
        effects: [
          {
            type: 'SHOW_TOAST',
            payload: {
              message: `알림 주기가 ${intent.payload}일로 변경됐어요.`,
              variant: 'success',
            },
          },
        ],
      };

    default:
      return {};
  }
};
