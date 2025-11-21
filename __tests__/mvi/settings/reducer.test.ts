/**
 * Settings Reducer Tests
 */

import { settingsReducer } from '@/mvi/features/settings/reducer';
import { SettingsState, SettingsIntent } from '@/mvi/features/settings/types';

const createMockState = (overrides?: Partial<SettingsState>): SettingsState => ({
  notificationDays: 3,
  isClearing: false,
  ...overrides,
});

describe('settingsReducer', () => {
  describe('SET_NOTIFICATION_DAYS', () => {
    it('알림 주기를 업데이트한다', () => {
      const state = createMockState({ notificationDays: 3 });
      const intent: SettingsIntent = {
        type: 'SET_NOTIFICATION_DAYS',
        payload: 7,
      };

      const result = settingsReducer(state, intent);

      expect(result.notificationDays).toBe(7);
    });

    it('다른 상태는 변경하지 않는다', () => {
      const state = createMockState({ notificationDays: 3, isClearing: true });
      const intent: SettingsIntent = {
        type: 'SET_NOTIFICATION_DAYS',
        payload: 5,
      };

      const result = settingsReducer(state, intent);

      expect(result.notificationDays).toBe(5);
      expect(result.isClearing).toBe(true);
    });
  });

  describe('LOAD_NOTIFICATION_DAYS', () => {
    it('상태를 변경하지 않는다 (미들웨어에서 처리)', () => {
      const state = createMockState();
      const intent: SettingsIntent = { type: 'LOAD_NOTIFICATION_DAYS' };

      const result = settingsReducer(state, intent);

      expect(result).toEqual(state);
    });
  });

  describe('DELETE_ALL_DATA', () => {
    it('상태를 변경하지 않는다 (미들웨어에서 처리)', () => {
      const state = createMockState();
      const intent: SettingsIntent = { type: 'DELETE_ALL_DATA' };

      const result = settingsReducer(state, intent);

      expect(result).toEqual(state);
    });
  });

  describe('OPEN_PRIVACY_POLICY', () => {
    it('상태를 변경하지 않는다 (미들웨어에서 처리)', () => {
      const state = createMockState();
      const intent: SettingsIntent = { type: 'OPEN_PRIVACY_POLICY' };

      const result = settingsReducer(state, intent);

      expect(result).toEqual(state);
    });
  });

  describe('OPEN_TERMS_OF_SERVICE', () => {
    it('상태를 변경하지 않는다 (미들웨어에서 처리)', () => {
      const state = createMockState();
      const intent: SettingsIntent = { type: 'OPEN_TERMS_OF_SERVICE' };

      const result = settingsReducer(state, intent);

      expect(result).toEqual(state);
    });
  });

  describe('RATE_APP', () => {
    it('상태를 변경하지 않는다 (미들웨어에서 처리)', () => {
      const state = createMockState();
      const intent: SettingsIntent = { type: 'RATE_APP' };

      const result = settingsReducer(state, intent);

      expect(result).toEqual(state);
    });
  });

  describe('unknown intent', () => {
    it('알 수 없는 intent는 상태를 변경하지 않는다', () => {
      const state = createMockState();
      const intent = { type: 'UNKNOWN_INTENT' } as any;

      const result = settingsReducer(state, intent);

      expect(result).toEqual(state);
    });
  });
});
