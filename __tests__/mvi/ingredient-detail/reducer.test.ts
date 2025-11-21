/**
 * Ingredient Detail Reducer Tests
 */

import { ingredientDetailReducer } from '@/mvi/features/ingredient-detail/reducer';
import { IngredientDetailState, IngredientDetailIntent } from '@/mvi/features/ingredient-detail/types';
import { Category } from '@/data/enums/category';
import { StorageLocation } from '@/data/enums/storage_location';
import { Ingredient } from '@/data/models/ingredient.model';

const mockIngredient: Ingredient = {
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
};

const createMockState = (overrides?: Partial<IngredientDetailState>): IngredientDetailState => ({
  ingredient: null,
  loading: false,
  error: null,
  ...overrides,
});

describe('ingredientDetailReducer', () => {
  describe('LOAD_INGREDIENT', () => {
    it('로딩 상태를 true로 설정하고 에러를 초기화한다', () => {
      const state = createMockState({ loading: false, error: '이전 에러' });
      const intent: IngredientDetailIntent = {
        type: 'LOAD_INGREDIENT',
        payload: 'test-id-1',
      };

      const result = ingredientDetailReducer(state, intent);

      expect(result.loading).toBe(true);
      expect(result.error).toBeNull();
    });

    it('기존 ingredient는 유지한다', () => {
      const state = createMockState({ ingredient: mockIngredient });
      const intent: IngredientDetailIntent = {
        type: 'LOAD_INGREDIENT',
        payload: 'test-id-2',
      };

      const result = ingredientDetailReducer(state, intent);

      expect(result.ingredient).toEqual(mockIngredient);
    });
  });

  describe('unknown intent', () => {
    it('알 수 없는 intent는 상태를 변경하지 않는다', () => {
      const state = createMockState({ ingredient: mockIngredient });
      const intent = { type: 'UNKNOWN_INTENT' } as any;

      const result = ingredientDetailReducer(state, intent);

      expect(result).toEqual(state);
    });
  });

  describe('DELETE_INGREDIENT', () => {
    it('상태를 변경하지 않는다 (미들웨어에서 처리)', () => {
      const state = createMockState({ ingredient: mockIngredient });
      const intent: IngredientDetailIntent = { type: 'DELETE_INGREDIENT' };

      const result = ingredientDetailReducer(state, intent);

      expect(result).toEqual(state);
    });
  });

  describe('CONSUME_INGREDIENT', () => {
    it('상태를 변경하지 않는다 (미들웨어에서 처리)', () => {
      const state = createMockState({ ingredient: mockIngredient });
      const intent: IngredientDetailIntent = { type: 'CONSUME_INGREDIENT' };

      const result = ingredientDetailReducer(state, intent);

      expect(result).toEqual(state);
    });
  });

  describe('NAVIGATE_TO_EDIT', () => {
    it('상태를 변경하지 않는다 (미들웨어에서 처리)', () => {
      const state = createMockState({ ingredient: mockIngredient });
      const intent: IngredientDetailIntent = { type: 'NAVIGATE_TO_EDIT' };

      const result = ingredientDetailReducer(state, intent);

      expect(result).toEqual(state);
    });
  });

  describe('NAVIGATE_BACK', () => {
    it('상태를 변경하지 않는다 (미들웨어에서 처리)', () => {
      const state = createMockState({ ingredient: mockIngredient });
      const intent: IngredientDetailIntent = { type: 'NAVIGATE_BACK' };

      const result = ingredientDetailReducer(state, intent);

      expect(result).toEqual(state);
    });
  });
});
