/**
 * Settings Middleware
 */

import { Middleware, MiddlewareResult } from '@/mvi/base';
import { SettingsState, SettingsIntent, SettingsEffect } from './types';
import { storage } from '@/lib/storage';

export const settingsMiddleware: Middleware<
  SettingsState,
  SettingsIntent,
  SettingsEffect
> = async (
  state,
  intent,
): Promise<MiddlewareResult<SettingsState, SettingsEffect>> => {
  switch (intent.type) {
    case 'SET_NOTIFICATION_DAYS':
      return {
        effects: [
          {
            type: 'SHOW_ALERT',
            payload: {
              title: '성공',
              message: `알림 주기가 ${intent.payload}일로 변경됐어요.`,
              type: 'success',
            },
          },
        ],
      };

    default:
      return {};
  }
};
