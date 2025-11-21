/**
 * Ingredient Edit Reducer Tests
 */

import { ingredientEditReducer } from '@/mvi/features/ingredient-edit/reducer';
import { IngredientEditState, IngredientEditIntent } from '@/mvi/features/ingredient-edit/types';
import { Category } from '@/data/enums/category';
import { StorageLocation } from '@/data/enums/storage_location';
import { Unit } from '@/data/enums/unit';
import { Ingredient } from '@/data/models/ingredient.model';

const mockIngredient: Ingredient = {
  id: 'test-id-1',
  name: '우유',
  category: Category.DAIRY,
  emoji: '🥛',
  quantity: 2,
  unit: Unit.PIECE,
  storage_location: StorageLocation.REFRIGERATOR,
  purchased_date_time: '2024-01-01T00:00:00.000Z',
  expired_date_time: '2024-12-31T00:00:00.000Z',
  consumed_date_time: null,
  memo: '저지방',
  created_date_time: '2024-01-01T00:00:00.000Z',
  last_modified_date_time: null,
  deleted_date_time: null,
};

const createMockState = (overrides?: Partial<IngredientEditState>): IngredientEditState => ({
  ingredient: null,
  editForm: {
    name: '',
    emoji: null,
    category: Category.OTHER,
    quantity: null,
    unit: null,
    purchased_date_time: null,
    expired_date_time: null,
    storage_location: null,
    memo: null,
  },
  loading: false,
  error: null,
  errors: {},
  ...overrides,
});

describe('ingredientEditReducer', () => {
  describe('LOAD_INGREDIENT', () => {
    it('로딩 상태를 true로 설정하고 에러를 초기화한다', () => {
      const state = createMockState({ loading: false, error: '이전 에러' });
      const intent: IngredientEditIntent = {
        type: 'LOAD_INGREDIENT',
        payload: 'test-id-1',
      };

      const result = ingredientEditReducer(state, intent);

      expect(result.loading).toBe(true);
      expect(result.error).toBeNull();
    });
  });

  describe('UPDATE_FORM_FIELD', () => {
    it('name 필드를 업데이트한다', () => {
      const state = createMockState();
      const intent: IngredientEditIntent = {
        type: 'UPDATE_FORM_FIELD',
        payload: { field: 'name', value: '저지방 우유' },
      };

      const result = ingredientEditReducer(state, intent);

      expect(result.editForm.name).toBe('저지방 우유');
    });

    it('emoji 필드를 업데이트한다', () => {
      const state = createMockState();
      const intent: IngredientEditIntent = {
        type: 'UPDATE_FORM_FIELD',
        payload: { field: 'emoji', value: '🧈' },
      };

      const result = ingredientEditReducer(state, intent);

      expect(result.editForm.emoji).toBe('🧈');
    });

    it('category 필드를 업데이트한다', () => {
      const state = createMockState();
      const intent: IngredientEditIntent = {
        type: 'UPDATE_FORM_FIELD',
        payload: { field: 'category', value: Category.VEGETABLE },
      };

      const result = ingredientEditReducer(state, intent);

      expect(result.editForm.category).toBe(Category.VEGETABLE);
    });

    it('quantity 필드를 업데이트한다', () => {
      const state = createMockState();
      const intent: IngredientEditIntent = {
        type: 'UPDATE_FORM_FIELD',
        payload: { field: 'quantity', value: '5' },
      };

      const result = ingredientEditReducer(state, intent);

      expect(result.editForm.quantity).toBe('5');
    });

    it('unit 필드를 업데이트한다', () => {
      const state = createMockState();
      const intent: IngredientEditIntent = {
        type: 'UPDATE_FORM_FIELD',
        payload: { field: 'unit', value: Unit.GRAM },
      };

      const result = ingredientEditReducer(state, intent);

      expect(result.editForm.unit).toBe(Unit.GRAM);
    });

    it('storage_location 필드를 업데이트한다', () => {
      const state = createMockState();
      const intent: IngredientEditIntent = {
        type: 'UPDATE_FORM_FIELD',
        payload: { field: 'storage_location', value: StorageLocation.FREEZER },
      };

      const result = ingredientEditReducer(state, intent);

      expect(result.editForm.storage_location).toBe(StorageLocation.FREEZER);
    });

    it('memo 필드를 업데이트한다', () => {
      const state = createMockState();
      const intent: IngredientEditIntent = {
        type: 'UPDATE_FORM_FIELD',
        payload: { field: 'memo', value: '유기농 제품' },
      };

      const result = ingredientEditReducer(state, intent);

      expect(result.editForm.memo).toBe('유기농 제품');
    });

    it('purchased_date_time 필드를 업데이트한다', () => {
      const state = createMockState();
      const intent: IngredientEditIntent = {
        type: 'UPDATE_FORM_FIELD',
        payload: { field: 'purchased_date_time', value: '2024-02-01T00:00:00.000Z' },
      };

      const result = ingredientEditReducer(state, intent);

      expect(result.editForm.purchased_date_time).toBe('2024-02-01T00:00:00.000Z');
    });

    it('expired_date_time 필드를 업데이트한다', () => {
      const state = createMockState();
      const intent: IngredientEditIntent = {
        type: 'UPDATE_FORM_FIELD',
        payload: { field: 'expired_date_time', value: '2024-03-01T00:00:00.000Z' },
      };

      const result = ingredientEditReducer(state, intent);

      expect(result.editForm.expired_date_time).toBe('2024-03-01T00:00:00.000Z');
    });

    it('필드 업데이트 시 해당 필드의 에러를 제거한다', () => {
      const state = createMockState({
        errors: {
          name: '이름을 입력해주세요',
          quantity: '올바른 수량을 입력해주세요',
        },
      });
      const intent: IngredientEditIntent = {
        type: 'UPDATE_FORM_FIELD',
        payload: { field: 'name', value: '우유' },
      };

      const result = ingredientEditReducer(state, intent);

      expect(result.errors.name).toBeUndefined();
      expect(result.errors.quantity).toBe('올바른 수량을 입력해주세요');
    });

    it('다른 필드는 변경하지 않는다', () => {
      const state = createMockState({
        editForm: {
          name: '기존이름',
          emoji: '🥛',
          category: Category.DAIRY,
          quantity: '1',
          unit: Unit.PIECE,
          purchased_date_time: '2024-01-01T00:00:00.000Z',
          expired_date_time: '2024-01-15T00:00:00.000Z',
          storage_location: StorageLocation.REFRIGERATOR,
          memo: '기존 메모',
        },
      });
      const intent: IngredientEditIntent = {
        type: 'UPDATE_FORM_FIELD',
        payload: { field: 'name', value: '새이름' },
      };

      const result = ingredientEditReducer(state, intent);

      expect(result.editForm.name).toBe('새이름');
      expect(result.editForm.emoji).toBe('🥛');
      expect(result.editForm.category).toBe(Category.DAIRY);
      expect(result.editForm.quantity).toBe('1');
      expect(result.editForm.unit).toBe(Unit.PIECE);
      expect(result.editForm.storage_location).toBe(StorageLocation.REFRIGERATOR);
      expect(result.editForm.memo).toBe('기존 메모');
    });
  });

  describe('UPDATE_INGREDIENT', () => {
    it('상태를 변경하지 않는다 (미들웨어에서 처리)', () => {
      const state = createMockState({ ingredient: mockIngredient });
      const intent: IngredientEditIntent = { type: 'UPDATE_INGREDIENT' };

      const result = ingredientEditReducer(state, intent);

      expect(result).toEqual(state);
    });
  });

  describe('NAVIGATE_BACK', () => {
    it('상태를 변경하지 않는다 (미들웨어에서 처리)', () => {
      const state = createMockState({ ingredient: mockIngredient });
      const intent: IngredientEditIntent = { type: 'NAVIGATE_BACK' };

      const result = ingredientEditReducer(state, intent);

      expect(result).toEqual(state);
    });
  });

  describe('unknown intent', () => {
    it('알 수 없는 intent는 상태를 변경하지 않는다', () => {
      const state = createMockState({ ingredient: mockIngredient });
      const intent = { type: 'UNKNOWN_INTENT' } as any;

      const result = ingredientEditReducer(state, intent);

      expect(result).toEqual(state);
    });
  });
});
