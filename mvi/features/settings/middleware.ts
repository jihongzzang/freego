/**
 * Settings Middleware
 */

import { Middleware, MiddlewareResult } from '@/mvi/base';
import { SettingsState, SettingsIntent, SettingsEffect } from './types';
import { saveNotificationDays, getNotificationDays } from '@/services/notification.service';
import { createErrorEffect, createSuccessEffect } from '@/mvi/shared';
import * as WebBrowser from 'expo-web-browser';
import * as StoreReview from 'expo-store-review';
import { getLegalUrls } from '@/constants/legal';
import { ingredientService } from '@/services/ingredient.service';
import { shoppingService } from '@/services/shopping.service';
import { achievementService } from '@/services/achievement.service';
import i18n from '@/locales';

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
        effects: [createSuccessEffect(i18n.t('settings.messages.notificationDaysChanged', { days: intent.payload }))],
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
          effects: [createSuccessEffect(i18n.t('settings.messages.deleteDataSuccess'))],
        };
      } catch (error) {
        console.error('Error deleting all data:', error);
        return {
          state: {
            ...state,
            isClearing: false,
          },
          effects: [createErrorEffect(i18n.t('settings.messages.deleteDataFailed'))],
        };
      }
    }

    case 'OPEN_PRIVACY_POLICY': {
      try {
        const legalUrls = getLegalUrls();
        await WebBrowser.openBrowserAsync(legalUrls.PRIVACY_POLICY);
        return {};
      } catch (error) {
        console.error('Privacy policy browser error:', error);
        return {
          effects: [createErrorEffect(i18n.t('settings.messages.privacyPolicyError'))],
        };
      }
    }

    case 'OPEN_TERMS_OF_SERVICE': {
      try {
        const legalUrls = getLegalUrls();
        await WebBrowser.openBrowserAsync(legalUrls.TERMS_OF_SERVICE);
        return {};
      } catch (error) {
        console.error('Terms of service browser error:', error);
        return {
          effects: [createErrorEffect(i18n.t('settings.messages.termsOfServiceError'))],
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
          return {
            effects: [
              {
                type: 'SHOW_TOAST',
                payload: { message: i18n.t('settings.messages.rateAppFallback'), variant: 'info' },
              },
            ],
          };
        }
      } catch (error) {
        console.error('Store review error:', error);
        return {
          effects: [createErrorEffect(i18n.t('settings.messages.rateAppError'))],
        };
      }
    }

    default:
      return {};
  }
};
