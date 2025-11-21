/**
 * Add Middleware Tests
 */

import { addMiddleware } from '@/mvi/features/add/middleware';
import { AddState, AddIntent } from '@/mvi/features/add/types';
import { ingredientService } from '@/services/ingredient.service';
import { Category } from '@/data/enums/category';
import { StorageLocation } from '@/data/enums/storage_location';
import { Unit } from '@/data/enums/unit';

jest.mock('@/services/ingredient.service', () => ({
  ingredientService: {
    addIngredient: jest.fn(),
  },
}));

jest.mock('@/constants/ingredientTemplates', () => ({
  getRandomEmojiForCategory: jest.fn(() => '🥛'),
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

const mockIngredientService = ingredientService as jest.Mocked<typeof ingredientService>;

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

describe('addMiddleware', () => {
  const originalConsoleError = console.error;

  beforeEach(() => {
    jest.clearAllMocks();
    console.error = jest.fn();
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  describe('VALIDATE_FORM', () => {
    it('이름이 비어있으면 에러를 반환한다', async () => {
      const state = createMockState({
        form: {
          name: '',
          emoji: null,
          category: Category.DAIRY,
          quantity: null,
          unit: null,
          purchased_date_time: null,
          expired_date_time: null,
          storage_location: null,
          memo: null,
        },
      });
      const intent: AddIntent = { type: 'VALIDATE_FORM' };

      const result = await addMiddleware(state, intent);

      expect(result.state?.errors.name).toBeDefined();
    });

    it('이름이 공백만 있으면 에러를 반환한다', async () => {
      const state = createMockState({
        form: {
          name: '   ',
          emoji: null,
          category: Category.DAIRY,
          quantity: null,
          unit: null,
          purchased_date_time: null,
          expired_date_time: null,
          storage_location: null,
          memo: null,
        },
      });
      const intent: AddIntent = { type: 'VALIDATE_FORM' };

      const result = await addMiddleware(state, intent);

      expect(result.state?.errors.name).toBeDefined();
    });

    it('수량이 숫자가 아니면 에러를 반환한다', async () => {
      const state = createMockState({
        form: {
          name: '우유',
          emoji: null,
          category: Category.DAIRY,
          quantity: 'abc',
          unit: null,
          purchased_date_time: null,
          expired_date_time: null,
          storage_location: null,
          memo: null,
        },
      });
      const intent: AddIntent = { type: 'VALIDATE_FORM' };

      const result = await addMiddleware(state, intent);

      expect(result.state?.errors.quantity).toBeDefined();
    });

    it('수량이 0이면 에러를 반환한다', async () => {
      const state = createMockState({
        form: {
          name: '우유',
          emoji: null,
          category: Category.DAIRY,
          quantity: '0',
          unit: null,
          purchased_date_time: null,
          expired_date_time: null,
          storage_location: null,
          memo: null,
        },
      });
      const intent: AddIntent = { type: 'VALIDATE_FORM' };

      const result = await addMiddleware(state, intent);

      expect(result.state?.errors.quantity).toBeDefined();
    });

    it('수량이 음수면 에러를 반환한다', async () => {
      const state = createMockState({
        form: {
          name: '우유',
          emoji: null,
          category: Category.DAIRY,
          quantity: '-1',
          unit: null,
          purchased_date_time: null,
          expired_date_time: null,
          storage_location: null,
          memo: null,
        },
      });
      const intent: AddIntent = { type: 'VALIDATE_FORM' };

      const result = await addMiddleware(state, intent);

      expect(result.state?.errors.quantity).toBeDefined();
    });

    it('유효한 폼이면 에러 없이 반환한다', async () => {
      const state = createMockState({
        form: {
          name: '우유',
          emoji: '🥛',
          category: Category.DAIRY,
          quantity: '1',
          unit: Unit.PIECE,
          purchased_date_time: '2024-01-01T00:00:00.000Z',
          expired_date_time: '2024-01-15T00:00:00.000Z',
          storage_location: StorageLocation.REFRIGERATOR,
          memo: '저지방',
        },
      });
      const intent: AddIntent = { type: 'VALIDATE_FORM' };

      const result = await addMiddleware(state, intent);

      expect(result.state).toBeUndefined();
      expect(result.effects).toBeUndefined();
    });

    it('수량이 빈 문자열이면 유효한 것으로 처리한다', async () => {
      const state = createMockState({
        form: {
          name: '우유',
          emoji: null,
          category: Category.DAIRY,
          quantity: '',
          unit: null,
          purchased_date_time: null,
          expired_date_time: null,
          storage_location: null,
          memo: null,
        },
      });
      const intent: AddIntent = { type: 'VALIDATE_FORM' };

      const result = await addMiddleware(state, intent);

      expect(result.state?.errors?.quantity).toBeUndefined();
    });

    it('수량이 null이면 유효한 것으로 처리한다', async () => {
      const state = createMockState({
        form: {
          name: '우유',
          emoji: null,
          category: Category.DAIRY,
          quantity: null,
          unit: null,
          purchased_date_time: null,
          expired_date_time: null,
          storage_location: null,
          memo: null,
        },
      });
      const intent: AddIntent = { type: 'VALIDATE_FORM' };

      const result = await addMiddleware(state, intent);

      expect(result.state?.errors?.quantity).toBeUndefined();
    });
  });

  describe('SUBMIT_FORM', () => {
    it('유효하지 않은 폼이면 에러 토스트를 표시한다', async () => {
      const state = createMockState({
        form: {
          name: '',
          emoji: null,
          category: Category.DAIRY,
          quantity: null,
          unit: null,
          purchased_date_time: null,
          expired_date_time: null,
          storage_location: null,
          memo: null,
        },
      });
      const intent: AddIntent = { type: 'SUBMIT_FORM' };

      const result = await addMiddleware(state, intent);

      expect(mockIngredientService.addIngredient).not.toHaveBeenCalled();
      expect(result.state?.isSubmitting).toBe(false);
      expect(result.state?.errors.name).toBeDefined();
      expect(result.effects).toContainEqual(
        expect.objectContaining({
          type: 'SHOW_TOAST',
          payload: expect.objectContaining({ variant: 'error' }),
        }),
      );
    });

    it('재료를 성공적으로 추가한다', async () => {
      const state = createMockState({
        form: {
          name: '우유',
          emoji: '🥛',
          category: Category.DAIRY,
          quantity: '2',
          unit: Unit.PIECE,
          purchased_date_time: '2024-01-01T00:00:00.000Z',
          expired_date_time: '2024-01-15T00:00:00.000Z',
          storage_location: StorageLocation.REFRIGERATOR,
          memo: '저지방',
        },
        isSubmitting: true,
      });
      const intent: AddIntent = { type: 'SUBMIT_FORM' };

      mockIngredientService.addIngredient.mockResolvedValue(undefined);

      const result = await addMiddleware(state, intent);

      expect(mockIngredientService.addIngredient).toHaveBeenCalledWith({
        name: '우유',
        category: Category.DAIRY,
        emoji: '🥛',
        quantity: 2,
        unit: Unit.PIECE,
        purchased_date_time: '2024-01-01T00:00:00.000Z',
        expired_date_time: '2024-01-15T00:00:00.000Z',
        storage_location: StorageLocation.REFRIGERATOR,
        memo: '저지방',
        last_modified_date_time: null,
        deleted_date_time: null,
        consumed_date_time: null,
      });
      expect(result.state?.isSubmitting).toBe(false);
      expect(result.state?.form.name).toBe('');
      expect(result.state?.errors).toEqual({});
      expect(result.effects).toContainEqual(
        expect.objectContaining({
          type: 'SHOW_TOAST',
          payload: expect.objectContaining({ variant: 'success' }),
        }),
      );
    });

    it('이모지가 없으면 랜덤 이모지를 사용한다', async () => {
      const state = createMockState({
        form: {
          name: '우유',
          emoji: null,
          category: Category.DAIRY,
          quantity: null,
          unit: null,
          purchased_date_time: null,
          expired_date_time: null,
          storage_location: null,
          memo: null,
        },
      });
      const intent: AddIntent = { type: 'SUBMIT_FORM' };

      mockIngredientService.addIngredient.mockResolvedValue(undefined);

      await addMiddleware(state, intent);

      expect(mockIngredientService.addIngredient).toHaveBeenCalledWith(
        expect.objectContaining({
          emoji: '🥛', // mock에서 반환하는 값
        }),
      );
    });

    it('수량이 정수가 아니면 null로 처리한다', async () => {
      const state = createMockState({
        form: {
          name: '우유',
          emoji: '🥛',
          category: Category.DAIRY,
          quantity: '1.5',
          unit: null,
          purchased_date_time: null,
          expired_date_time: null,
          storage_location: null,
          memo: null,
        },
      });
      const intent: AddIntent = { type: 'SUBMIT_FORM' };

      mockIngredientService.addIngredient.mockResolvedValue(undefined);

      await addMiddleware(state, intent);

      expect(mockIngredientService.addIngredient).toHaveBeenCalledWith(
        expect.objectContaining({
          quantity: null,
        }),
      );
    });

    it('추가 실패 시 에러 토스트를 표시한다', async () => {
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
        isSubmitting: true,
      });
      const intent: AddIntent = { type: 'SUBMIT_FORM' };

      mockIngredientService.addIngredient.mockRejectedValue(new Error('Add failed'));

      const result = await addMiddleware(state, intent);

      expect(result.state?.isSubmitting).toBe(false);
      expect(result.effects).toContainEqual(
        expect.objectContaining({
          type: 'SHOW_TOAST',
          payload: expect.objectContaining({ variant: 'error' }),
        }),
      );
    });

    it('폼 제출 후 카테고리는 유지된다', async () => {
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
      const intent: AddIntent = { type: 'SUBMIT_FORM' };

      mockIngredientService.addIngredient.mockResolvedValue(undefined);

      const result = await addMiddleware(state, intent);

      expect(result.state?.form.category).toBe(Category.DAIRY);
    });
  });

  describe('NAVIGATE_BACK', () => {
    it('NAVIGATE_BACK 이펙트를 반환한다', async () => {
      const state = createMockState();
      const intent: AddIntent = { type: 'NAVIGATE_BACK' };

      const result = await addMiddleware(state, intent);

      expect(result.effects).toContainEqual(
        expect.objectContaining({
          type: 'NAVIGATE_BACK',
        }),
      );
    });
  });

  describe('unknown intent', () => {
    it('알 수 없는 intent는 빈 객체를 반환한다', async () => {
      const state = createMockState();
      const intent = { type: 'UNKNOWN_INTENT' } as any;

      const result = await addMiddleware(state, intent);

      expect(result).toEqual({});
    });
  });
});
