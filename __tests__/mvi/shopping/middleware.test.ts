/**
 * Shopping Middleware Tests
 */

import { shoppingMiddleware } from '@/mvi/features/shopping/middleware';
import { ShoppingState, ShoppingIntent } from '@/mvi/features/shopping/types';
import { shoppingService } from '@/services/shopping.service';
import { ingredientService } from '@/services/ingredient.service';
import { Category } from '@/data/enums/category';
import { StorageLocation } from '@/data/enums/storage_location';
import { ShoppingItem } from '@/data/models/shopping.model';
import i18n from '@/locales';

jest.mock('@/services/shopping.service', () => ({
  shoppingService: {
    getShoppingList: jest.fn(),
    addToShoppingList: jest.fn(),
    updateShoppingItem: jest.fn(),
    deleteShoppingItem: jest.fn(),
  },
}));

jest.mock('@/services/ingredient.service', () => ({
  ingredientService: {
    addIngredient: jest.fn(),
  },
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
  createWarningEffect: jest.fn((message) => ({
    type: 'SHOW_TOAST',
    payload: { message, variant: 'warning' },
  })),
  createInfoEffect: jest.fn((message) => ({
    type: 'SHOW_TOAST',
    payload: { message, variant: 'info' },
  })),
}));

const mockShoppingService = shoppingService as jest.Mocked<typeof shoppingService>;
const mockIngredientService = ingredientService as jest.Mocked<typeof ingredientService>;

const createMockState = (overrides?: Partial<ShoppingState>): ShoppingState => ({
  shoppingList: [],
  selectedIds: new Set<string>(),
  loading: false,
  error: null,
  isAddingItem: false,
  addForm: {
    name: '',
    category: Category.OTHER,
    emoji: null,
  },
  ...overrides,
});

const mockShoppingItem: ShoppingItem = {
  id: 'test-id-1',
  name: '우유',
  category: Category.DAIRY,
  is_purchased: false,
  emoji: '🥛',
  memo: null,
  created_date_time: '2024-01-01T00:00:00.000Z',
  last_modified_date_time: null,
  deleted_date_time: null,
  purchased_date_time: null,
};

describe('shoppingMiddleware', () => {
  const originalConsoleError = console.error;
  const originalConsoleLog = console.log;

  beforeEach(() => {
    jest.clearAllMocks();
    console.error = jest.fn();
    console.log = jest.fn();
  });

  afterEach(() => {
    console.error = originalConsoleError;
    console.log = originalConsoleLog;
  });

  describe('LOAD_SHOPPING_LIST', () => {
    it('장보기 목록을 성공적으로 로드한다', async () => {
      const state = createMockState();
      const intent: ShoppingIntent = { type: 'LOAD_SHOPPING_LIST' };

      mockShoppingService.getShoppingList.mockResolvedValue([mockShoppingItem]);

      const result = await shoppingMiddleware(state, intent);

      expect(mockShoppingService.getShoppingList).toHaveBeenCalled();
      expect(result.state?.shoppingList).toEqual([mockShoppingItem]);
      expect(result.state?.loading).toBe(false);
      expect(result.state?.error).toBeNull();
    });

    it('로드 실패 시 에러 토스트를 표시한다', async () => {
      const state = createMockState();
      const intent: ShoppingIntent = { type: 'LOAD_SHOPPING_LIST' };

      mockShoppingService.getShoppingList.mockRejectedValue(new Error('Load failed'));

      const result = await shoppingMiddleware(state, intent);

      expect(result.state?.loading).toBe(false);
      expect(result.state?.error).toBe('Load failed');
      expect(result.effects).toContainEqual(
        expect.objectContaining({
          type: 'SHOW_TOAST',
          payload: expect.objectContaining({ variant: 'error' }),
        }),
      );
    });
  });

  describe('SUBMIT_ADD_ITEM', () => {
    it('새 항목을 성공적으로 추가한다', async () => {
      const state = createMockState();
      const intent: ShoppingIntent = {
        type: 'SUBMIT_ADD_ITEM',
        payload: { name: '계란', category: Category.DAIRY, emoji: '🥚' },
      };

      mockShoppingService.addToShoppingList.mockResolvedValue(undefined);
      mockShoppingService.getShoppingList.mockResolvedValue([mockShoppingItem]);

      const result = await shoppingMiddleware(state, intent);

      expect(mockShoppingService.addToShoppingList).toHaveBeenCalledWith({
        name: '계란',
        category: Category.DAIRY,
        emoji: '🥚',
        memo: null,
        last_modified_date_time: null,
        deleted_date_time: null,
      });
      expect(result.effects).toContainEqual(
        expect.objectContaining({
          type: 'SHOW_TOAST',
          payload: expect.objectContaining({ variant: 'success' }),
        }),
      );
    });

    it('빈 이름인 경우 에러 토스트를 표시한다', async () => {
      const state = createMockState();
      const intent: ShoppingIntent = {
        type: 'SUBMIT_ADD_ITEM',
        payload: { name: '   ', category: Category.DAIRY, emoji: '🥚' },
      };

      const result = await shoppingMiddleware(state, intent);

      expect(mockShoppingService.addToShoppingList).not.toHaveBeenCalled();
      expect(result.effects).toContainEqual(
        expect.objectContaining({
          type: 'SHOW_TOAST',
          payload: expect.objectContaining({ variant: 'error' }),
        }),
      );
    });

    it('추가 실패 시 에러 토스트를 표시한다', async () => {
      const state = createMockState();
      const intent: ShoppingIntent = {
        type: 'SUBMIT_ADD_ITEM',
        payload: { name: '계란', category: Category.DAIRY, emoji: '🥚' },
      };

      mockShoppingService.addToShoppingList.mockRejectedValue(new Error('Add failed'));

      const result = await shoppingMiddleware(state, intent);

      expect(result.effects).toContainEqual(
        expect.objectContaining({
          type: 'SHOW_TOAST',
          payload: expect.objectContaining({ variant: 'error' }),
        }),
      );
    });
  });

  describe('DELETE_ITEM', () => {
    it('삭제 확인 다이얼로그를 표시한다', async () => {
      const state = createMockState({ shoppingList: [mockShoppingItem] });
      const intent: ShoppingIntent = {
        type: 'DELETE_ITEM',
        payload: { id: 'test-id-1', name: '우유' },
      };

      const result = await shoppingMiddleware(state, intent);

      expect(result.effects).toContainEqual(
        expect.objectContaining({
          type: 'SHOW_CONFIRM',
          payload: expect.objectContaining({
            title: i18n.t('shopping.messages.deleteItemTitle'),
            isDanger: true,
            actionType: 'delete',
          }),
        }),
      );
    });

    it('삭제 확인 시 shoppingService.deleteShoppingItem을 호출한다', async () => {
      const state = createMockState({ shoppingList: [mockShoppingItem] });
      const intent: ShoppingIntent = {
        type: 'DELETE_ITEM',
        payload: { id: 'test-id-1', name: '우유' },
      };

      mockShoppingService.deleteShoppingItem.mockResolvedValue(undefined);

      const result = await shoppingMiddleware(state, intent);

      const confirmEffect = result.effects?.find((e) => e.type === 'SHOW_CONFIRM') as any;
      const confirmResult = await confirmEffect.payload.onConfirm();

      expect(mockShoppingService.deleteShoppingItem).toHaveBeenCalledWith('test-id-1');
      expect(confirmResult).toEqual({ success: true });
    });

    it('삭제 실패 시 success: false를 반환한다', async () => {
      const state = createMockState({ shoppingList: [mockShoppingItem] });
      const intent: ShoppingIntent = {
        type: 'DELETE_ITEM',
        payload: { id: 'test-id-1', name: '우유' },
      };

      mockShoppingService.deleteShoppingItem.mockRejectedValue(new Error('Delete failed'));

      const result = await shoppingMiddleware(state, intent);

      const confirmEffect = result.effects?.find((e) => e.type === 'SHOW_CONFIRM') as any;
      const confirmResult = await confirmEffect.payload.onConfirm();

      expect(confirmResult).toEqual({ success: false });
    });
  });

  describe('DELETE_SELECTED', () => {
    it('선택된 항목이 없으면 경고 토스트를 표시한다', async () => {
      const state = createMockState({ selectedIds: new Set<string>() });
      const intent: ShoppingIntent = { type: 'DELETE_SELECTED' };

      const result = await shoppingMiddleware(state, intent);

      expect(result.effects).toContainEqual(
        expect.objectContaining({
          type: 'SHOW_TOAST',
          payload: expect.objectContaining({ variant: 'warning' }),
        }),
      );
    });

    it('선택된 항목이 있으면 삭제 확인 다이얼로그를 표시한다', async () => {
      const state = createMockState({
        shoppingList: [mockShoppingItem],
        selectedIds: new Set(['test-id-1']),
      });
      const intent: ShoppingIntent = { type: 'DELETE_SELECTED' };

      const result = await shoppingMiddleware(state, intent);

      expect(result.effects).toContainEqual(
        expect.objectContaining({
          type: 'SHOW_CONFIRM',
          payload: expect.objectContaining({
            title: i18n.t('shopping.messages.deleteSelectedTitle'),
            isDanger: true,
            actionType: 'delete',
          }),
        }),
      );
    });

    it('선택 삭제 확인 시 모든 선택 항목을 삭제한다', async () => {
      const state = createMockState({
        shoppingList: [mockShoppingItem],
        selectedIds: new Set(['test-id-1']),
      });
      const intent: ShoppingIntent = { type: 'DELETE_SELECTED' };

      mockShoppingService.deleteShoppingItem.mockResolvedValue(undefined);

      const result = await shoppingMiddleware(state, intent);

      const confirmEffect = result.effects?.find((e) => e.type === 'SHOW_CONFIRM') as any;
      const confirmResult = await confirmEffect.payload.onConfirm();

      expect(mockShoppingService.deleteShoppingItem).toHaveBeenCalledWith('test-id-1');
      expect(confirmResult).toEqual({ success: true, count: 1 });
    });

    it('선택 삭제 실패 시 success: false를 반환한다', async () => {
      const state = createMockState({
        shoppingList: [mockShoppingItem],
        selectedIds: new Set(['test-id-1']),
      });
      const intent: ShoppingIntent = { type: 'DELETE_SELECTED' };

      mockShoppingService.deleteShoppingItem.mockRejectedValue(new Error('Delete failed'));

      const result = await shoppingMiddleware(state, intent);

      const confirmEffect = result.effects?.find((e) => e.type === 'SHOW_CONFIRM') as any;
      const confirmResult = await confirmEffect.payload.onConfirm();

      expect(confirmResult).toEqual({ success: false });
    });
  });

  describe('ADD_ITEM_TO_STORAGE', () => {
    it('존재하지 않는 항목인 경우 에러 토스트를 표시한다', async () => {
      const state = createMockState({ shoppingList: [] });
      const intent: ShoppingIntent = {
        type: 'ADD_ITEM_TO_STORAGE',
        payload: {
          id: 'non-existent-id',
          name: '우유',
          category: Category.DAIRY,
          storageLocation: StorageLocation.REFRIGERATOR,
        },
      };

      const result = await shoppingMiddleware(state, intent);

      expect(result.effects).toContainEqual(
        expect.objectContaining({
          type: 'SHOW_TOAST',
          payload: expect.objectContaining({ variant: 'error' }),
        }),
      );
    });

    it('항목을 냉장고에 성공적으로 추가한다', async () => {
      const state = createMockState({ shoppingList: [mockShoppingItem] });
      const intent: ShoppingIntent = {
        type: 'ADD_ITEM_TO_STORAGE',
        payload: {
          id: 'test-id-1',
          name: '우유',
          category: Category.DAIRY,
          storageLocation: StorageLocation.REFRIGERATOR,
        },
      };

      mockIngredientService.addIngredient.mockResolvedValue(undefined);
      mockShoppingService.updateShoppingItem.mockResolvedValue(undefined);
      mockShoppingService.getShoppingList.mockResolvedValue([
        { ...mockShoppingItem, is_purchased: true },
      ]);

      const result = await shoppingMiddleware(state, intent);

      expect(mockIngredientService.addIngredient).toHaveBeenCalledWith(
        expect.objectContaining({
          name: '우유',
          category: Category.DAIRY,
          emoji: '🥛',
          storage_location: StorageLocation.REFRIGERATOR,
        }),
      );
      expect(mockShoppingService.updateShoppingItem).toHaveBeenCalledWith(
        'test-id-1',
        expect.objectContaining({
          is_purchased: true,
        }),
      );
      expect(result.effects).toContainEqual(
        expect.objectContaining({
          type: 'SHOW_TOAST',
          payload: expect.objectContaining({ variant: 'success' }),
        }),
      );
    });

    it('냉장고 추가 실패 시 에러 토스트를 표시한다', async () => {
      const state = createMockState({ shoppingList: [mockShoppingItem] });
      const intent: ShoppingIntent = {
        type: 'ADD_ITEM_TO_STORAGE',
        payload: {
          id: 'test-id-1',
          name: '우유',
          category: Category.DAIRY,
          storageLocation: StorageLocation.REFRIGERATOR,
        },
      };

      mockIngredientService.addIngredient.mockRejectedValue(new Error('Add failed'));

      const result = await shoppingMiddleware(state, intent);

      expect(result.effects).toContainEqual(
        expect.objectContaining({
          type: 'SHOW_TOAST',
          payload: expect.objectContaining({ variant: 'error' }),
        }),
      );
    });
  });

  describe('ADD_SELECTED_TO_STORAGE', () => {
    it('선택된 항목이 없으면 경고 토스트를 표시한다', async () => {
      const state = createMockState({ selectedIds: new Set<string>() });
      const intent: ShoppingIntent = { type: 'ADD_SELECTED_TO_STORAGE' };

      const result = await shoppingMiddleware(state, intent);

      expect(result.effects).toContainEqual(
        expect.objectContaining({
          type: 'SHOW_TOAST',
          payload: expect.objectContaining({ variant: 'warning' }),
        }),
      );
    });

    it('선택된 항목이 있으면 확인 다이얼로그를 표시한다', async () => {
      const state = createMockState({
        shoppingList: [mockShoppingItem],
        selectedIds: new Set(['test-id-1']),
      });
      const intent: ShoppingIntent = { type: 'ADD_SELECTED_TO_STORAGE' };

      const result = await shoppingMiddleware(state, intent);

      expect(result.effects).toContainEqual(
        expect.objectContaining({
          type: 'SHOW_CONFIRM',
          payload: expect.objectContaining({
            title: i18n.t('shopping.messages.addToFridgeTitle'),
            actionType: 'add_to_storage',
          }),
        }),
      );
    });

    it('선택 항목 냉장고 추가 확인 시 모든 항목을 추가한다', async () => {
      const state = createMockState({
        shoppingList: [mockShoppingItem],
        selectedIds: new Set(['test-id-1']),
      });
      const intent: ShoppingIntent = { type: 'ADD_SELECTED_TO_STORAGE' };

      mockIngredientService.addIngredient.mockResolvedValue(undefined);
      mockShoppingService.updateShoppingItem.mockResolvedValue(undefined);

      const result = await shoppingMiddleware(state, intent);

      const confirmEffect = result.effects?.find((e) => e.type === 'SHOW_CONFIRM') as any;
      const confirmResult = await confirmEffect.payload.onConfirm();

      expect(mockIngredientService.addIngredient).toHaveBeenCalled();
      expect(mockShoppingService.updateShoppingItem).toHaveBeenCalledWith(
        'test-id-1',
        expect.objectContaining({ is_purchased: true }),
      );
      expect(confirmResult).toEqual({ success: true, count: 1 });
    });

    it('선택 항목 냉장고 추가 실패 시 success: false를 반환한다', async () => {
      const state = createMockState({
        shoppingList: [mockShoppingItem],
        selectedIds: new Set(['test-id-1']),
      });
      const intent: ShoppingIntent = { type: 'ADD_SELECTED_TO_STORAGE' };

      mockIngredientService.addIngredient.mockRejectedValue(new Error('Add failed'));

      const result = await shoppingMiddleware(state, intent);

      const confirmEffect = result.effects?.find((e) => e.type === 'SHOW_CONFIRM') as any;
      const confirmResult = await confirmEffect.payload.onConfirm();

      expect(confirmResult).toEqual({ success: false });
    });
  });

  describe('UPDATE_MEMO', () => {
    it('메모를 성공적으로 수정한다', async () => {
      const state = createMockState({ shoppingList: [mockShoppingItem] });
      const intent: ShoppingIntent = {
        type: 'UPDATE_MEMO',
        payload: { id: 'test-id-1', memo: '저지방으로' },
      };

      mockShoppingService.updateShoppingItem.mockResolvedValue(undefined);
      mockShoppingService.getShoppingList.mockResolvedValue([
        { ...mockShoppingItem, memo: '저지방으로' },
      ]);

      const result = await shoppingMiddleware(state, intent);

      expect(mockShoppingService.updateShoppingItem).toHaveBeenCalledWith('test-id-1', {
        memo: '저지방으로',
      });
      expect(result.effects).toContainEqual(
        expect.objectContaining({
          type: 'SHOW_TOAST',
          payload: expect.objectContaining({ variant: 'success' }),
        }),
      );
    });

    it('빈 메모는 null로 설정한다', async () => {
      const state = createMockState({ shoppingList: [mockShoppingItem] });
      const intent: ShoppingIntent = {
        type: 'UPDATE_MEMO',
        payload: { id: 'test-id-1', memo: '' },
      };

      mockShoppingService.updateShoppingItem.mockResolvedValue(undefined);
      mockShoppingService.getShoppingList.mockResolvedValue([mockShoppingItem]);

      await shoppingMiddleware(state, intent);

      expect(mockShoppingService.updateShoppingItem).toHaveBeenCalledWith('test-id-1', {
        memo: null,
      });
    });

    it('메모 수정 실패 시 에러 토스트를 표시한다', async () => {
      const state = createMockState({ shoppingList: [mockShoppingItem] });
      const intent: ShoppingIntent = {
        type: 'UPDATE_MEMO',
        payload: { id: 'test-id-1', memo: '저지방으로' },
      };

      mockShoppingService.updateShoppingItem.mockRejectedValue(new Error('Update failed'));

      const result = await shoppingMiddleware(state, intent);

      expect(result.effects).toContainEqual(
        expect.objectContaining({
          type: 'SHOW_TOAST',
          payload: expect.objectContaining({ variant: 'error' }),
        }),
      );
    });
  });

  describe('UPDATE_NAME', () => {
    it('이름을 성공적으로 수정한다', async () => {
      const state = createMockState({ shoppingList: [mockShoppingItem] });
      const intent: ShoppingIntent = {
        type: 'UPDATE_NAME',
        payload: { id: 'test-id-1', name: '저지방 우유' },
      };

      mockShoppingService.updateShoppingItem.mockResolvedValue(undefined);
      mockShoppingService.getShoppingList.mockResolvedValue([
        { ...mockShoppingItem, name: '저지방 우유' },
      ]);

      const result = await shoppingMiddleware(state, intent);

      expect(mockShoppingService.updateShoppingItem).toHaveBeenCalledWith('test-id-1', {
        name: '저지방 우유',
      });
      expect(result.effects).toContainEqual(
        expect.objectContaining({
          type: 'SHOW_TOAST',
          payload: expect.objectContaining({ variant: 'success' }),
        }),
      );
    });

    it('이름 수정 실패 시 에러 토스트를 표시한다', async () => {
      const state = createMockState({ shoppingList: [mockShoppingItem] });
      const intent: ShoppingIntent = {
        type: 'UPDATE_NAME',
        payload: { id: 'test-id-1', name: '저지방 우유' },
      };

      mockShoppingService.updateShoppingItem.mockRejectedValue(new Error('Update failed'));

      const result = await shoppingMiddleware(state, intent);

      expect(result.effects).toContainEqual(
        expect.objectContaining({
          type: 'SHOW_TOAST',
          payload: expect.objectContaining({ variant: 'error' }),
        }),
      );
    });
  });

  describe('UPDATE_EMOJI', () => {
    it('이모지를 성공적으로 수정한다', async () => {
      const state = createMockState({ shoppingList: [mockShoppingItem] });
      const intent: ShoppingIntent = {
        type: 'UPDATE_EMOJI',
        payload: { id: 'test-id-1', emoji: '🧈' },
      };

      mockShoppingService.updateShoppingItem.mockResolvedValue(undefined);
      mockShoppingService.getShoppingList.mockResolvedValue([
        { ...mockShoppingItem, emoji: '🧈' },
      ]);

      const result = await shoppingMiddleware(state, intent);

      expect(mockShoppingService.updateShoppingItem).toHaveBeenCalledWith('test-id-1', {
        emoji: '🧈',
      });
      expect(result.effects).toContainEqual(
        expect.objectContaining({
          type: 'SHOW_TOAST',
          payload: expect.objectContaining({ variant: 'success' }),
        }),
      );
    });

    it('이모지 수정 실패 시 에러 토스트를 표시한다', async () => {
      const state = createMockState({ shoppingList: [mockShoppingItem] });
      const intent: ShoppingIntent = {
        type: 'UPDATE_EMOJI',
        payload: { id: 'test-id-1', emoji: '🧈' },
      };

      mockShoppingService.updateShoppingItem.mockRejectedValue(new Error('Update failed'));

      const result = await shoppingMiddleware(state, intent);

      expect(result.effects).toContainEqual(
        expect.objectContaining({
          type: 'SHOW_TOAST',
          payload: expect.objectContaining({ variant: 'error' }),
        }),
      );
    });
  });

  describe('CANCEL_PURCHASE', () => {
    it('구매완료 취소 확인 다이얼로그를 표시한다', async () => {
      const state = createMockState({
        shoppingList: [{ ...mockShoppingItem, is_purchased: true }],
      });
      const intent: ShoppingIntent = {
        type: 'CANCEL_PURCHASE',
        payload: { id: 'test-id-1', name: '우유' },
      };

      const result = await shoppingMiddleware(state, intent);

      expect(result.effects).toContainEqual(
        expect.objectContaining({
          type: 'SHOW_CONFIRM',
          payload: expect.objectContaining({
            title: i18n.t('shopping.messages.cancelPurchaseTitle'),
            actionType: 'cancel_purchase',
          }),
        }),
      );
    });

    it('구매완료 취소 확인 시 shoppingService.updateShoppingItem을 호출한다', async () => {
      const state = createMockState({
        shoppingList: [{ ...mockShoppingItem, is_purchased: true }],
      });
      const intent: ShoppingIntent = {
        type: 'CANCEL_PURCHASE',
        payload: { id: 'test-id-1', name: '우유' },
      };

      mockShoppingService.updateShoppingItem.mockResolvedValue(undefined);

      const result = await shoppingMiddleware(state, intent);

      const confirmEffect = result.effects?.find((e) => e.type === 'SHOW_CONFIRM') as any;
      const confirmResult = await confirmEffect.payload.onConfirm();

      expect(mockShoppingService.updateShoppingItem).toHaveBeenCalledWith('test-id-1', {
        is_purchased: false,
        purchased_date_time: null,
      });
      expect(confirmResult).toEqual({ success: true });
    });

    it('구매완료 취소 실패 시 success: false를 반환한다', async () => {
      const state = createMockState({
        shoppingList: [{ ...mockShoppingItem, is_purchased: true }],
      });
      const intent: ShoppingIntent = {
        type: 'CANCEL_PURCHASE',
        payload: { id: 'test-id-1', name: '우유' },
      };

      mockShoppingService.updateShoppingItem.mockRejectedValue(new Error('Update failed'));

      const result = await shoppingMiddleware(state, intent);

      const confirmEffect = result.effects?.find((e) => e.type === 'SHOW_CONFIRM') as any;
      const confirmResult = await confirmEffect.payload.onConfirm();

      expect(confirmResult).toEqual({ success: false });
    });
  });

  describe('REPURCHASE', () => {
    it('재구매 항목을 성공적으로 추가한다', async () => {
      const purchasedItem = { ...mockShoppingItem, is_purchased: true };
      const state = createMockState({ shoppingList: [purchasedItem] });
      const intent: ShoppingIntent = {
        type: 'REPURCHASE',
        payload: { id: 'test-id-1', name: '우유' },
      };

      mockShoppingService.addToShoppingList.mockResolvedValue(undefined);
      mockShoppingService.getShoppingList.mockResolvedValue([purchasedItem, mockShoppingItem]);

      const result = await shoppingMiddleware(state, intent);

      expect(mockShoppingService.addToShoppingList).toHaveBeenCalledWith({
        name: '우유',
        category: Category.DAIRY,
        emoji: '🥛',
        memo: null,
        last_modified_date_time: null,
        deleted_date_time: null,
      });
      expect(result.effects).toContainEqual(
        expect.objectContaining({
          type: 'SHOW_TOAST',
          payload: expect.objectContaining({ variant: 'success' }),
        }),
      );
    });

    it('존재하지 않는 항목인 경우 에러 토스트를 표시한다', async () => {
      const state = createMockState({ shoppingList: [] });
      const intent: ShoppingIntent = {
        type: 'REPURCHASE',
        payload: { id: 'non-existent-id', name: '우유' },
      };

      const result = await shoppingMiddleware(state, intent);

      expect(result.effects).toContainEqual(
        expect.objectContaining({
          type: 'SHOW_TOAST',
          payload: expect.objectContaining({ variant: 'error' }),
        }),
      );
    });

    it('재구매 추가 실패 시 에러 토스트를 표시한다', async () => {
      const purchasedItem = { ...mockShoppingItem, is_purchased: true };
      const state = createMockState({ shoppingList: [purchasedItem] });
      const intent: ShoppingIntent = {
        type: 'REPURCHASE',
        payload: { id: 'test-id-1', name: '우유' },
      };

      mockShoppingService.addToShoppingList.mockRejectedValue(new Error('Add failed'));

      const result = await shoppingMiddleware(state, intent);

      expect(result.effects).toContainEqual(
        expect.objectContaining({
          type: 'SHOW_TOAST',
          payload: expect.objectContaining({ variant: 'error' }),
        }),
      );
    });
  });

  describe('DELETE_DATE_ITEMS', () => {
    it('날짜별 삭제 확인 다이얼로그를 표시한다', async () => {
      const state = createMockState({ shoppingList: [mockShoppingItem] });
      const intent: ShoppingIntent = {
        type: 'DELETE_DATE_ITEMS',
        payload: { dateKey: '2024-01-01', itemIds: ['test-id-1'] },
      };

      const result = await shoppingMiddleware(state, intent);

      expect(result.effects).toContainEqual(
        expect.objectContaining({
          type: 'SHOW_CONFIRM',
          payload: expect.objectContaining({
            title: i18n.t('shopping.messages.deleteDateItemsTitle'),
            isDanger: true,
            actionType: 'delete',
          }),
        }),
      );
    });

    it('날짜별 삭제 확인 시 모든 항목의 deleted_date_time을 업데이트한다', async () => {
      const state = createMockState({ shoppingList: [mockShoppingItem] });
      const intent: ShoppingIntent = {
        type: 'DELETE_DATE_ITEMS',
        payload: { dateKey: '2024-01-01', itemIds: ['test-id-1'] },
      };

      mockShoppingService.updateShoppingItem.mockResolvedValue(undefined);

      const result = await shoppingMiddleware(state, intent);

      const confirmEffect = result.effects?.find((e) => e.type === 'SHOW_CONFIRM') as any;
      const confirmResult = await confirmEffect.payload.onConfirm();

      expect(mockShoppingService.updateShoppingItem).toHaveBeenCalledWith(
        'test-id-1',
        expect.objectContaining({ deleted_date_time: expect.any(String) }),
      );
      expect(confirmResult).toEqual({ success: true, count: 1 });
    });

    it('날짜별 삭제 실패 시 success: false를 반환한다', async () => {
      const state = createMockState({ shoppingList: [mockShoppingItem] });
      const intent: ShoppingIntent = {
        type: 'DELETE_DATE_ITEMS',
        payload: { dateKey: '2024-01-01', itemIds: ['test-id-1'] },
      };

      mockShoppingService.updateShoppingItem.mockRejectedValue(new Error('Update failed'));

      const result = await shoppingMiddleware(state, intent);

      const confirmEffect = result.effects?.find((e) => e.type === 'SHOW_CONFIRM') as any;
      const confirmResult = await confirmEffect.payload.onConfirm();

      expect(confirmResult).toEqual({ success: false });
    });
  });
});
