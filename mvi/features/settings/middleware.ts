/**
 * Settings Middleware
 */

import { Middleware, MiddlewareResult } from '@/mvi/base';
import { SettingsState, SettingsIntent, SettingsEffect } from './types';
import { saveNotificationDays, getNotificationDays } from '@/services/notification.service';
import { createErrorEffect, createSuccessEffect } from '@/mvi/shared';
import ERROR_MESSAGES from '@/constants/toast/errorMessages';
import SUCCESS_MESSAGES from '@/constants/toast/successMessages';

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
        effects: [createSuccessEffect(`알림 주기가 ${intent.payload}일로 변경됐어요.`)],
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
          effects: [createSuccessEffect(SUCCESS_MESSAGES.SUCCESS_DELETE_DATA)],
        };
      } catch (error) {
        console.error('Error deleting all data:', error);
        return {
          state: {
            ...state,
            isClearing: false,
          },
          effects: [createErrorEffect(ERROR_MESSAGES.ERROR_DELETE_DATA_FAILED)],
        };
      }
    }

    default:
      return {};
  }
};
