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

    case 'DELETE_ALL_DATA': {
      try {
        const { ingredientService } = await import('@/services/ingredient.service');
        const { shoppingService } = await import('@/services/shopping.service');

        await ingredientService.clearAll();
        await shoppingService.clearAll();

        return {
          state: {
            ...state,
            isClearing: false,
          },
          effects: [
            {
              type: 'SHOW_TOAST',
              payload: {
                message: '모든 데이터가 삭제되었어요.',
                variant: 'success',
              },
            },
          ],
        };
      } catch (error) {
        console.error('Error deleting all data:', error);
        return {
          state: {
            ...state,
            isClearing: false,
          },
          effects: [
            {
              type: 'SHOW_TOAST',
              payload: {
                message: '데이터 삭제 중 문제가 발생했어요.',
                variant: 'error',
              },
            },
          ],
        };
      }
    }

    default:
      return {};
  }
};
