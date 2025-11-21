/**
 * Settings Middleware Tests
 */

import { settingsMiddleware } from '@/mvi/features/settings/middleware';
import { SettingsState, SettingsIntent } from '@/mvi/features/settings/types';
import { saveNotificationDays, getNotificationDays } from '@/services/notification.service';
import * as WebBrowser from 'expo-web-browser';
import { WebBrowserResultType } from 'expo-web-browser';
import * as StoreReview from 'expo-store-review';

jest.mock('@/services/notification.service', () => ({
  saveNotificationDays: jest.fn(),
  getNotificationDays: jest.fn(),
}));

jest.mock('@/services/ingredient.service', () => ({
  ingredientService: {
    clearAll: jest.fn(),
  },
}));

jest.mock('@/services/shopping.service', () => ({
  shoppingService: {
    clearAll: jest.fn(),
  },
}));

jest.mock('@/services/achievement.service', () => ({
  achievementService: {
    resetAll: jest.fn(),
  },
}));

import { ingredientService } from '@/services/ingredient.service';
import { shoppingService } from '@/services/shopping.service';
import { achievementService } from '@/services/achievement.service';

const mockIngredientClearAll = ingredientService.clearAll as jest.Mock;
const mockShoppingClearAll = shoppingService.clearAll as jest.Mock;
const mockAchievementResetAll = achievementService.resetAll as jest.Mock;

jest.mock('expo-web-browser', () => ({
  openBrowserAsync: jest.fn(),
  WebBrowserResultType: {
    CANCEL: 'cancel',
    DISMISS: 'dismiss',
    OPENED: 'opened',
    LOCKED: 'locked',
  },
}));

jest.mock('expo-store-review', () => ({
  isAvailableAsync: jest.fn(),
  requestReview: jest.fn(),
}));

jest.mock('@/mvi/shared', () => ({
  createSuccessEffect: jest.fn((message) => ({
    type: 'SHOW_TOAST',
    payload: { message, variant: 'success' },
  })),
  createErrorEffect: jest.fn((message) => ({
    type: 'SHOW_TOAST',
    payload: { message, variant: 'error' },
  })),
}));

const mockGetNotificationDays = getNotificationDays as jest.MockedFunction<typeof getNotificationDays>;
const mockSaveNotificationDays = saveNotificationDays as jest.MockedFunction<typeof saveNotificationDays>;
const mockWebBrowser = WebBrowser as jest.Mocked<typeof WebBrowser>;
const mockStoreReview = StoreReview as jest.Mocked<typeof StoreReview>;

const createMockState = (overrides?: Partial<SettingsState>): SettingsState => ({
  notificationDays: 3,
  isClearing: false,
  ...overrides,
});

describe('settingsMiddleware', () => {
  const originalConsoleError = console.error;

  beforeEach(() => {
    jest.clearAllMocks();
    console.error = jest.fn();
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  describe('LOAD_NOTIFICATION_DAYS', () => {
    it('알림 주기를 성공적으로 로드한다', async () => {
      const state = createMockState();
      const intent: SettingsIntent = { type: 'LOAD_NOTIFICATION_DAYS' };

      mockGetNotificationDays.mockResolvedValue(5);

      const result = await settingsMiddleware(state, intent);

      expect(mockGetNotificationDays).toHaveBeenCalled();
      expect(result.state?.notificationDays).toBe(5);
    });
  });

  describe('SET_NOTIFICATION_DAYS', () => {
    it('알림 주기를 성공적으로 저장하고 토스트를 표시한다', async () => {
      const state = createMockState();
      const intent: SettingsIntent = {
        type: 'SET_NOTIFICATION_DAYS',
        payload: 7,
      };

      mockSaveNotificationDays.mockResolvedValue(undefined);

      const result = await settingsMiddleware(state, intent);

      expect(mockSaveNotificationDays).toHaveBeenCalledWith(7);
      expect(result.effects).toContainEqual(
        expect.objectContaining({
          type: 'SHOW_TOAST',
          payload: expect.objectContaining({ variant: 'success' }),
        }),
      );
    });
  });

  describe('DELETE_ALL_DATA', () => {
    it('모든 데이터를 성공적으로 삭제한다', async () => {
      const state = createMockState({ isClearing: true });
      const intent: SettingsIntent = { type: 'DELETE_ALL_DATA' };

      mockIngredientClearAll.mockResolvedValue(undefined);
      mockShoppingClearAll.mockResolvedValue(undefined);
      mockAchievementResetAll.mockResolvedValue(undefined);

      const result = await settingsMiddleware(state, intent);

      expect(mockIngredientClearAll).toHaveBeenCalled();
      expect(mockShoppingClearAll).toHaveBeenCalled();
      expect(mockAchievementResetAll).toHaveBeenCalled();
      expect(result.state?.isClearing).toBe(false);
      expect(result.effects).toContainEqual(
        expect.objectContaining({
          type: 'SHOW_TOAST',
          payload: expect.objectContaining({ variant: 'success' }),
        }),
      );
    });

    it('데이터 삭제 실패 시 에러 토스트를 표시한다', async () => {
      const state = createMockState({ isClearing: true });
      const intent: SettingsIntent = { type: 'DELETE_ALL_DATA' };

      mockIngredientClearAll.mockRejectedValue(new Error('Delete error'));

      const result = await settingsMiddleware(state, intent);

      expect(result.state?.isClearing).toBe(false);
      expect(result.effects).toContainEqual(
        expect.objectContaining({
          type: 'SHOW_TOAST',
          payload: expect.objectContaining({ variant: 'error' }),
        }),
      );
    });
  });

  describe('OPEN_PRIVACY_POLICY', () => {
    it('개인정보처리방침 페이지를 성공적으로 연다', async () => {
      const state = createMockState();
      const intent: SettingsIntent = { type: 'OPEN_PRIVACY_POLICY' };

      mockWebBrowser.openBrowserAsync.mockResolvedValue({
        type: WebBrowserResultType.CANCEL,
      });

      const result = await settingsMiddleware(state, intent);

      expect(mockWebBrowser.openBrowserAsync).toHaveBeenCalled();
      expect(result).toEqual({});
    });

    it('개인정보처리방침 열기 실패 시 에러 토스트를 표시한다', async () => {
      const state = createMockState();
      const intent: SettingsIntent = { type: 'OPEN_PRIVACY_POLICY' };

      mockWebBrowser.openBrowserAsync.mockRejectedValue(new Error('Browser error'));

      const result = await settingsMiddleware(state, intent);

      expect(result.effects).toContainEqual(
        expect.objectContaining({
          type: 'SHOW_TOAST',
          payload: expect.objectContaining({ variant: 'error' }),
        }),
      );
    });
  });

  describe('OPEN_TERMS_OF_SERVICE', () => {
    it('이용약관 페이지를 성공적으로 연다', async () => {
      const state = createMockState();
      const intent: SettingsIntent = { type: 'OPEN_TERMS_OF_SERVICE' };

      mockWebBrowser.openBrowserAsync.mockResolvedValue({
        type: WebBrowserResultType.CANCEL,
      });

      const result = await settingsMiddleware(state, intent);

      expect(mockWebBrowser.openBrowserAsync).toHaveBeenCalled();
      expect(result).toEqual({});
    });

    it('이용약관 열기 실패 시 에러 토스트를 표시한다', async () => {
      const state = createMockState();
      const intent: SettingsIntent = { type: 'OPEN_TERMS_OF_SERVICE' };

      mockWebBrowser.openBrowserAsync.mockRejectedValue(new Error('Browser error'));

      const result = await settingsMiddleware(state, intent);

      expect(result.effects).toContainEqual(
        expect.objectContaining({
          type: 'SHOW_TOAST',
          payload: expect.objectContaining({ variant: 'error' }),
        }),
      );
    });
  });

  describe('RATE_APP', () => {
    it('스토어 리뷰가 가능하면 리뷰를 요청한다', async () => {
      const state = createMockState();
      const intent: SettingsIntent = { type: 'RATE_APP' };

      mockStoreReview.isAvailableAsync.mockResolvedValue(true);
      mockStoreReview.requestReview.mockResolvedValue(undefined);

      const result = await settingsMiddleware(state, intent);

      expect(mockStoreReview.isAvailableAsync).toHaveBeenCalled();
      expect(mockStoreReview.requestReview).toHaveBeenCalled();
      expect(result).toEqual({});
    });

    it('스토어 리뷰가 불가능하면 안내 토스트를 표시한다', async () => {
      const state = createMockState();
      const intent: SettingsIntent = { type: 'RATE_APP' };

      mockStoreReview.isAvailableAsync.mockResolvedValue(false);

      const result = await settingsMiddleware(state, intent);

      expect(mockStoreReview.requestReview).not.toHaveBeenCalled();
      expect(result.effects).toContainEqual(
        expect.objectContaining({
          type: 'SHOW_TOAST',
          payload: expect.objectContaining({ variant: 'info' }),
        }),
      );
    });

    it('스토어 리뷰 에러 시 에러 토스트를 표시한다', async () => {
      const state = createMockState();
      const intent: SettingsIntent = { type: 'RATE_APP' };

      mockStoreReview.isAvailableAsync.mockRejectedValue(new Error('Store review error'));

      const result = await settingsMiddleware(state, intent);

      expect(result.effects).toContainEqual(
        expect.objectContaining({
          type: 'SHOW_TOAST',
          payload: expect.objectContaining({ variant: 'error' }),
        }),
      );
    });
  });

  describe('unknown intent', () => {
    it('알 수 없는 intent는 빈 객체를 반환한다', async () => {
      const state = createMockState();
      const intent = { type: 'UNKNOWN_INTENT' } as any;

      const result = await settingsMiddleware(state, intent);

      expect(result).toEqual({});
    });
  });
});
