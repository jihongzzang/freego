/**
 * Settings Middleware
 */

import { Middleware, MiddlewareResult } from '@/mvi/base';
import { SettingsState, SettingsIntent, SettingsEffect } from './types';
import { saveNotificationDays, getNotificationDays } from '@/services/notification.service';
import { createErrorEffect, createSuccessEffect } from '@/mvi/shared';
import ERROR_MESSAGES from '@/constants/toast/errorMessages';
import SUCCESS_MESSAGES from '@/constants/toast/successMessages';
import * as WebBrowser from 'expo-web-browser';
import * as StoreReview from 'expo-store-review';
import { LEGAL_URLS } from '@/constants/legal';
import { ingredientService } from '@/services/ingredient.service';
import { shoppingService } from '@/services/shopping.service';
import { achievementService } from '@/services/achievement.service';

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
        await ingredientService.clearAll();
        await shoppingService.clearAll();
        await achievementService.resetAll();

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

    case 'OPEN_PRIVACY_POLICY': {
      try {
        await WebBrowser.openBrowserAsync(LEGAL_URLS.PRIVACY_POLICY);
        return {};
      } catch (error) {
        console.error('Privacy policy browser error:', error);
        return {
          effects: [createErrorEffect('개인정보처리방침을 열 수 없습니다')],
        };
      }
    }

    case 'OPEN_TERMS_OF_SERVICE': {
      try {
        await WebBrowser.openBrowserAsync(LEGAL_URLS.TERMS_OF_SERVICE);
        return {};
      } catch (error) {
        console.error('Terms of service browser error:', error);
        return {
          effects: [createErrorEffect('이용약관을 열 수 없습니다')],
        };
      }
    }

    case 'RATE_APP': {
      try {
        const isAvailable = await StoreReview.isAvailableAsync();
        if (isAvailable) {
          await StoreReview.requestReview();
          return {};
        } else {
          // 스토어 리뷰가 불가능한 경우 (예: 시뮬레이터)
          return {
            effects: [
              {
                type: 'SHOW_TOAST',
                payload: { message: '앱 스토어에서 직접 평가해주세요', variant: 'info' },
              },
            ],
          };
        }
      } catch (error) {
        console.error('Store review error:', error);
        return {
          effects: [createErrorEffect('평가 화면을 열 수 없습니다')],
        };
      }
    }

    default:
      return {};
  }
};
