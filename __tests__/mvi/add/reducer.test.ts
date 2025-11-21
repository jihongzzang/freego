/**
 * Add Reducer Tests
 */

import { addReducer } from '@/mvi/features/add/reducer';
import { AddState, AddIntent } from '@/mvi/features/add/types';
import { Category } from '@/data/enums/category';
import { StorageLocation } from '@/data/enums/storage_location';
import { Unit } from '@/data/enums/unit';

const createMockState = (overrides?: Partial<AddState>): AddState => ({
  form: {
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
  isSubmitting: false,
  errors: {},
  ...overrides,
});

describe('addReducer', () => {
  describe('UPDATE_FIELD', () => {
    it('name 필드를 업데이트한다', () => {
      const state = createMockState();
      const intent: AddIntent = {
        type: 'UPDATE_FIELD',
        payload: { field: 'name', value: '우유' },
      };

      const result = addReducer(state, intent);

      expect(result.form.name).toBe('우유');
    });

    it('category 필드를 업데이트한다', () => {
      const state = createMockState();
      const intent: AddIntent = {
        type: 'UPDATE_FIELD',
        payload: { field: 'category', value: Category.DAIRY as unknown as string },
      };

      const result = addReducer(state, intent);

      expect(result.form.category).toBe(Category.DAIRY);
    });

    it('emoji 필드를 업데이트한다', () => {
      const state = createMockState();
      const intent: AddIntent = {
        type: 'UPDATE_FIELD',
        payload: { field: 'emoji', value: '🥛' },
      };

      const result = addReducer(state, intent);

      expect(result.form.emoji).toBe('🥛');
    });

    it('quantity 필드를 업데이트한다', () => {
      const state = createMockState();
      const intent: AddIntent = {
        type: 'UPDATE_FIELD',
        payload: { field: 'quantity', value: '2' },
      };

      const result = addReducer(state, intent);

      expect(result.form.quantity).toBe('2');
    });

    it('unit 필드를 업데이트한다', () => {
      const state = createMockState();
      const intent: AddIntent = {
        type: 'UPDATE_FIELD',
        payload: { field: 'unit', value: Unit.PIECE as unknown as string },
      };

      const result = addReducer(state, intent);

      expect(result.form.unit).toBe(Unit.PIECE);
    });

    it('storage_location 필드를 업데이트한다', () => {
      const state = createMockState();
      const intent: AddIntent = {
        type: 'UPDATE_FIELD',
        payload: { field: 'storage_location', value: StorageLocation.REFRIGERATOR as unknown as string },
      };

      const result = addReducer(state, intent);

      expect(result.form.storage_location).toBe(StorageLocation.REFRIGERATOR);
    });

    it('memo 필드를 업데이트한다', () => {
      const state = createMockState();
      const intent: AddIntent = {
        type: 'UPDATE_FIELD',
        payload: { field: 'memo', value: '저지방 우유로' },
      };

      const result = addReducer(state, intent);

      expect(result.form.memo).toBe('저지방 우유로');
    });

    it('purchased_date_time 필드를 업데이트한다', () => {
      const state = createMockState();
      const intent: AddIntent = {
        type: 'UPDATE_FIELD',
        payload: { field: 'purchased_date_time', value: '2024-01-01T00:00:00.000Z' },
      };

      const result = addReducer(state, intent);

      expect(result.form.purchased_date_time).toBe('2024-01-01T00:00:00.000Z');
    });

    it('expired_date_time 필드를 업데이트한다', () => {
      const state = createMockState();
      const intent: AddIntent = {
        type: 'UPDATE_FIELD',
        payload: { field: 'expired_date_time', value: '2024-01-15T00:00:00.000Z' },
      };

      const result = addReducer(state, intent);

      expect(result.form.expired_date_time).toBe('2024-01-15T00:00:00.000Z');
    });

    it('필드 업데이트 시 해당 필드의 에러를 제거한다', () => {
      const state = createMockState({
        errors: {
          name: '이름을 입력해주세요',
          quantity: '올바른 수량을 입력해주세요',
        },
      });
      const intent: AddIntent = {
        type: 'UPDATE_FIELD',
        payload: { field: 'name', value: '우유' },
      };

      const result = addReducer(state, intent);

      expect(result.errors.name).toBeUndefined();
      expect(result.errors.quantity).toBe('올바른 수량을 입력해주세요');
    });

    it('다른 필드는 변경하지 않는다', () => {
      const state = createMockState({
        form: {
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
      const intent: AddIntent = {
        type: 'UPDATE_FIELD',
        payload: { field: 'name', value: '새이름' },
      };

      const result = addReducer(state, intent);

      expect(result.form.name).toBe('새이름');
      expect(result.form.emoji).toBe('🥛');
      expect(result.form.category).toBe(Category.DAIRY);
      expect(result.form.quantity).toBe('1');
      expect(result.form.unit).toBe(Unit.PIECE);
      expect(result.form.storage_location).toBe(StorageLocation.REFRIGERATOR);
      expect(result.form.memo).toBe('기존 메모');
    });
  });

  describe('SUBMIT_FORM', () => {
    it('상태를 변경하지 않는다 (미들웨어에서 처리)', () => {
      const state = createMockState({
        form: {
          name: '우유',
          emoji: '🥛',
          category: Category.DAIRY,
          quantity: '1',
          unit: null,
          purchased_date_time: null,
          expired_date_time: null,
          storage_location: null,
          memo: null,
        },
      });
      const intent: AddIntent = { type: 'SUBMIT_FORM' };

      const result = addReducer(state, intent);

      expect(result).toEqual(state);
    });
  });

  describe('unknown intent', () => {
    it('알 수 없는 intent는 상태를 변경하지 않는다', () => {
      const state = createMockState({
        form: {
          name: '우유',
          emoji: '🥛',
          category: Category.DAIRY,
          quantity: null,
          unit: null,
          purchased_date_time: null,
          expired_date_time: null,
          storage_location: null,
          memo: null,
        },
      });
      const intent = { type: 'UNKNOWN_INTENT' } as any;

      const result = addReducer(state, intent);

      expect(result).toEqual(state);
    });
  });
});
