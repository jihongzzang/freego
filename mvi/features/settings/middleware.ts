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
> = async (state, intent): Promise<MiddlewareResult<SettingsState, SettingsEffect>> => {
  switch (intent.type) {
    case 'SET_NOTIFICATION_DAYS':
      return {
        effects: [
          {
            type: 'SHOW_ALERT',
            payload: {
              title: '성공',
              message: `알림 주기가 ${intent.payload}일로 변경되었습니다.`,
              type: 'success',
            },
          },
        ],
      };

    case 'CLEAR_ALL_DATA':
      try {
        const ingredients = await storage.getIngredients();
        for (const ingredient of ingredients) {
          await storage.deleteIngredient(ingredient.id);
        }

        return {
          state: {
            ...state,
            isClearing: false,
          },
          effects: [
            {
              type: 'SHOW_ALERT',
              payload: {
                title: '완료',
                message: '모든 데이터가 삭제되었습니다.',
                type: 'success',
              },
            },
          ],
        };
      } catch (error) {
        return {
          state: {
            ...state,
            isClearing: false,
          },
          effects: [
            {
              type: 'SHOW_ALERT',
              payload: {
                title: '오류',
                message: '데이터 삭제에 실패했습니다.',
                type: 'error',
              },
            },
          ],
        };
      }

    default:
      return {};
  }
};
