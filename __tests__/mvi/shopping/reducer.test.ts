/**
 * Shopping Reducer Tests
 */

import { shoppingReducer } from '@/mvi/features/shopping/reducer';
import { ShoppingState, ShoppingIntent } from '@/mvi/features/shopping/types';
import { Category } from '@/data/enums/category';
import { ShoppingItem } from '@/data/models/shopping.model';

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

const mockShoppingItem2: ShoppingItem = {
  id: 'test-id-2',
  name: '계란',
  category: Category.DAIRY,
  is_purchased: false,
  emoji: '🥚',
  memo: null,
  created_date_time: '2024-01-02T00:00:00.000Z',
  last_modified_date_time: null,
  deleted_date_time: null,
  purchased_date_time: null,
};

const purchasedItem: ShoppingItem = {
  id: 'test-id-3',
  name: '버터',
  category: Category.DAIRY,
  is_purchased: true,
  emoji: '🧈',
  memo: null,
  created_date_time: '2024-01-03T00:00:00.000Z',
  last_modified_date_time: null,
  deleted_date_time: null,
  purchased_date_time: '2024-01-04T00:00:00.000Z',
};

describe('shoppingReducer', () => {
  const originalConsoleLog = console.log;

  beforeEach(() => {
    console.log = jest.fn();
  });

  afterEach(() => {
    console.log = originalConsoleLog;
  });

  describe('TOGGLE_SELECT', () => {
    it('선택되지 않은 항목을 선택한다', () => {
      const state = createMockState({
        shoppingList: [mockShoppingItem],
        selectedIds: new Set<string>(),
      });
      const intent: ShoppingIntent = {
        type: 'TOGGLE_SELECT',
        payload: { id: 'test-id-1' },
      };

      const result = shoppingReducer(state, intent);

      expect(result.selectedIds.has('test-id-1')).toBe(true);
      expect(result.selectedIds.size).toBe(1);
    });

    it('이미 선택된 항목을 선택 해제한다', () => {
      const state = createMockState({
        shoppingList: [mockShoppingItem],
        selectedIds: new Set(['test-id-1']),
      });
      const intent: ShoppingIntent = {
        type: 'TOGGLE_SELECT',
        payload: { id: 'test-id-1' },
      };

      const result = shoppingReducer(state, intent);

      expect(result.selectedIds.has('test-id-1')).toBe(false);
      expect(result.selectedIds.size).toBe(0);
    });
  });

  describe('TOGGLE_SELECT_ALL', () => {
    it('구매 예정 항목이 없으면 모두 선택한다', () => {
      const state = createMockState({
        shoppingList: [mockShoppingItem, mockShoppingItem2],
        selectedIds: new Set<string>(),
      });
      const intent: ShoppingIntent = { type: 'TOGGLE_SELECT_ALL' };

      const result = shoppingReducer(state, intent);

      expect(result.selectedIds.size).toBe(2);
      expect(result.selectedIds.has('test-id-1')).toBe(true);
      expect(result.selectedIds.has('test-id-2')).toBe(true);
    });

    it('모든 구매 예정 항목이 선택되어 있으면 모두 해제한다', () => {
      const state = createMockState({
        shoppingList: [mockShoppingItem, mockShoppingItem2],
        selectedIds: new Set(['test-id-1', 'test-id-2']),
      });
      const intent: ShoppingIntent = { type: 'TOGGLE_SELECT_ALL' };

      const result = shoppingReducer(state, intent);

      expect(result.selectedIds.size).toBe(0);
    });

    it('구매 완료된 항목은 선택에서 제외한다', () => {
      const state = createMockState({
        shoppingList: [mockShoppingItem, purchasedItem],
        selectedIds: new Set<string>(),
      });
      const intent: ShoppingIntent = { type: 'TOGGLE_SELECT_ALL' };

      const result = shoppingReducer(state, intent);

      expect(result.selectedIds.size).toBe(1);
      expect(result.selectedIds.has('test-id-1')).toBe(true);
      expect(result.selectedIds.has('test-id-3')).toBe(false);
    });
  });

  describe('CLEAR_SELECTION', () => {
    it('모든 선택을 해제한다', () => {
      const state = createMockState({
        shoppingList: [mockShoppingItem, mockShoppingItem2],
        selectedIds: new Set(['test-id-1', 'test-id-2']),
      });
      const intent: ShoppingIntent = { type: 'CLEAR_SELECTION' };

      const result = shoppingReducer(state, intent);

      expect(result.selectedIds.size).toBe(0);
    });
  });

  describe('SET_SELECTION', () => {
    it('선택 항목을 설정한다', () => {
      const state = createMockState({
        shoppingList: [mockShoppingItem, mockShoppingItem2],
        selectedIds: new Set<string>(),
      });
      const intent: ShoppingIntent = {
        type: 'SET_SELECTION',
        payload: { ids: ['test-id-1', 'test-id-2'] },
      };

      const result = shoppingReducer(state, intent);

      expect(result.selectedIds.size).toBe(2);
      expect(result.selectedIds.has('test-id-1')).toBe(true);
      expect(result.selectedIds.has('test-id-2')).toBe(true);
    });

    it('빈 배열로 설정하면 선택이 해제된다', () => {
      const state = createMockState({
        shoppingList: [mockShoppingItem],
        selectedIds: new Set(['test-id-1']),
      });
      const intent: ShoppingIntent = {
        type: 'SET_SELECTION',
        payload: { ids: [] },
      };

      const result = shoppingReducer(state, intent);

      expect(result.selectedIds.size).toBe(0);
    });
  });

  describe('LOAD_SHOPPING_LIST', () => {
    it('로드 시 선택을 해제한다', () => {
      const state = createMockState({
        shoppingList: [mockShoppingItem],
        selectedIds: new Set(['test-id-1']),
      });
      const intent: ShoppingIntent = { type: 'LOAD_SHOPPING_LIST' };

      const result = shoppingReducer(state, intent);

      expect(result.selectedIds.size).toBe(0);
    });
  });

  describe('unknown intent', () => {
    it('알 수 없는 intent는 상태를 변경하지 않는다', () => {
      const state = createMockState({
        shoppingList: [mockShoppingItem],
        selectedIds: new Set(['test-id-1']),
      });
      const intent = { type: 'UNKNOWN_INTENT' } as any;

      const result = shoppingReducer(state, intent);

      expect(result).toEqual(state);
    });
  });
});
