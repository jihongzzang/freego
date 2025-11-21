/**
 * Ingredients Reducer Tests
 */

import { ingredientsReducer } from '@/mvi/features/ingredients/reducer';
import { IngredientsState, IngredientsIntent } from '@/mvi/features/ingredients/types';
import { StorageLocation } from '@/data/enums/storage_location';
import { Category } from '@/data/enums/category';
import { EnrichedIngredient } from '@/mvi/shared';

const mockIngredient: EnrichedIngredient = {
  id: 'test-id-1',
  name: '우유',
  category: Category.DAIRY,
  emoji: '🥛',
  quantity: 1,
  unit: null,
  storage_location: StorageLocation.REFRIGERATOR,
  purchased_date_time: null,
  expired_date_time: '2024-12-31T00:00:00.000Z',
  consumed_date_time: null,
  memo: null,
  created_date_time: '2024-01-01T00:00:00.000Z',
  last_modified_date_time: null,
  deleted_date_time: null,
  status: 'valid',
  daysRemaining: 10,
};

const createMockState = (overrides?: Partial<IngredientsState>): IngredientsState => ({
  ingredients: [],
  loading: false,
  error: null,
  ...overrides,
});

describe('ingredientsReducer', () => {
  describe('LOAD_INGREDIENTS_SUCCESS', () => {
    it('재료 목록을 성공적으로 로드한다', () => {
      const state = createMockState({ loading: true });
      const intent = {
        type: 'LOAD_INGREDIENTS_SUCCESS' as const,
        payload: [mockIngredient],
      };

      const result = ingredientsReducer(state, intent as any);

      expect(result.ingredients).toEqual([mockIngredient]);
      expect(result.loading).toBe(false);
      expect(result.error).toBeNull();
    });

    it('빈 배열도 정상 처리한다', () => {
      const state = createMockState({ loading: true, ingredients: [mockIngredient] });
      const intent = {
        type: 'LOAD_INGREDIENTS_SUCCESS' as const,
        payload: [],
      };

      const result = ingredientsReducer(state, intent as any);

      expect(result.ingredients).toEqual([]);
      expect(result.loading).toBe(false);
    });
  });

  describe('LOAD_INGREDIENTS_ERROR', () => {
    it('에러 상태를 설정한다', () => {
      const state = createMockState({ loading: true });
      const intent = {
        type: 'LOAD_INGREDIENTS_ERROR' as const,
        payload: '재료를 불러오는데 실패했습니다.',
      };

      const result = ingredientsReducer(state, intent as any);

      expect(result.error).toBe('재료를 불러오는데 실패했습니다.');
      expect(result.loading).toBe(false);
    });
  });

  describe('LOAD_INGREDIENTS', () => {
    it('로딩 시작 시 상태를 유지한다', () => {
      const state = createMockState({ ingredients: [mockIngredient] });
      const intent: IngredientsIntent = {
        type: 'LOAD_INGREDIENTS',
      };

      const result = ingredientsReducer(state, intent);

      expect(result).toEqual(state);
    });
  });

  describe('DELETE_INGREDIENT', () => {
    it('상태를 변경하지 않는다 (미들웨어에서 처리)', () => {
      const state = createMockState({ ingredients: [mockIngredient] });
      const intent: IngredientsIntent = {
        type: 'DELETE_INGREDIENT',
        payload: 'test-id-1',
      };

      const result = ingredientsReducer(state, intent);

      expect(result).toEqual(state);
    });
  });

  describe('ADD_TO_SHOPPING_LIST_INGREDIENT', () => {
    it('상태를 변경하지 않는다 (미들웨어에서 처리)', () => {
      const state = createMockState({ ingredients: [mockIngredient] });
      const intent: IngredientsIntent = {
        type: 'ADD_TO_SHOPPING_LIST_INGREDIENT',
        payload: 'test-id-1',
      };

      const result = ingredientsReducer(state, intent);

      expect(result).toEqual(state);
    });
  });

  describe('NAVIGATE_TO_ADD', () => {
    it('상태를 변경하지 않는다 (미들웨어에서 처리)', () => {
      const state = createMockState();
      const intent: IngredientsIntent = {
        type: 'NAVIGATE_TO_ADD',
      };

      const result = ingredientsReducer(state, intent);

      expect(result).toEqual(state);
    });
  });

  describe('NAVIGATE_TO_DETAIL', () => {
    it('상태를 변경하지 않는다 (미들웨어에서 처리)', () => {
      const state = createMockState();
      const intent: IngredientsIntent = {
        type: 'NAVIGATE_TO_DETAIL',
        payload: 'test-id-1',
      };

      const result = ingredientsReducer(state, intent);

      expect(result).toEqual(state);
    });
  });

  describe('unknown intent', () => {
    it('알 수 없는 intent는 상태를 변경하지 않는다', () => {
      const state = createMockState({ ingredients: [mockIngredient] });
      const intent = { type: 'UNKNOWN_INTENT' } as any;

      const result = ingredientsReducer(state, intent);

      expect(result).toEqual(state);
    });
  });
});
