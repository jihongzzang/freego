/**
 * Settings Store
 */

import { Store } from '@/mvi/base';
import { SettingsState, SettingsIntent, SettingsEffect } from './types';
import { settingsReducer } from './reducer';
import { settingsMiddleware } from './middleware';

/**
 * 초기 상태
 */
const initialState: SettingsState = {
  notificationDays: 3,
  isClearing: false,
};

/**
 * Settings Store 생성 함수
 */
export function createSettingsStore(): Store<
  SettingsState,
  SettingsIntent,
  SettingsEffect
> {
  return new Store({
    initialState,
    reducer: settingsReducer,
    middlewares: [settingsMiddleware],
  });
}
