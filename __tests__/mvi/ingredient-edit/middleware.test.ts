/**
 * Ingredient Edit Middleware Tests
 */

import { ingredientEditMiddleware } from '@/mvi/features/ingredient-edit/middleware';
import { IngredientEditState, IngredientEditIntent } from '@/mvi/features/ingredient-edit/types';
import { ingredientService } from '@/services/ingredient.service';
import { Category } from '@/data/enums/category';
import { StorageLocation } from '@/data/enums/storage_location';
import { Unit } from '@/data/enums/unit';
import { Ingredient } from '@/data/models/ingredient.model';

jest.mock('@/services/ingredient.service', () => ({
  ingredientService: {
    getIngredients: jest.fn(),
    updateIngredient: jest.fn(),
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
}));

const mockIngredientService = ingredientService as jest.Mocked<typeof ingredientService>;

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

describe('ingredientEditMiddleware', () => {
  const originalConsoleError = console.error;

  beforeEach(() => {
    jest.clearAllMocks();
    console.error = jest.fn();
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  describe('LOAD_INGREDIENT', () => {
    it('식재료를 성공적으로 로드하고 폼을 채운다', async () => {
      const state = createMockState();
      const intent: IngredientEditIntent = {
        type: 'LOAD_INGREDIENT',
        payload: 'test-id-1',
      };

      mockIngredientService.getIngredients.mockResolvedValue([mockIngredient]);

      const result = await ingredientEditMiddleware(state, intent);

      expect(mockIngredientService.getIngredients).toHaveBeenCalled();
      expect(result.state?.ingredient).toEqual(mockIngredient);
      expect(result.state?.editForm).toEqual({
        name: '우유',
        emoji: '🥛',
        category: Category.DAIRY,
        quantity: '2',
        unit: Unit.PIECE,
        purchased_date_time: '2024-01-01T00:00:00.000Z',
        expired_date_time: '2024-12-31T00:00:00.000Z',
        storage_location: StorageLocation.REFRIGERATOR,
        memo: '저지방',
      });
      expect(result.state?.loading).toBe(false);
      expect(result.state?.error).toBeNull();
    });

    it('수량이 null인 식재료도 정상 로드한다', async () => {
      const state = createMockState();
      const intent: IngredientEditIntent = {
        type: 'LOAD_INGREDIENT',
        payload: 'test-id-1',
      };

      const ingredientWithoutQuantity = { ...mockIngredient, quantity: null };
      mockIngredientService.getIngredients.mockResolvedValue([ingredientWithoutQuantity]);

      const result = await ingredientEditMiddleware(state, intent);

      expect(result.state?.editForm.quantity).toBeNull();
    });

    it('존재하지 않는 식재료면 에러를 반환한다', async () => {
      const state = createMockState();
      const intent: IngredientEditIntent = {
        type: 'LOAD_INGREDIENT',
        payload: 'non-existent-id',
      };

      mockIngredientService.getIngredients.mockResolvedValue([mockIngredient]);

      const result = await ingredientEditMiddleware(state, intent);

      expect(result.state?.loading).toBe(false);
      expect(result.state?.error).toBe('식재료를 찾을 수 없어요.');
    });

    it('로드 실패 시 에러 토스트를 표시한다', async () => {
      const state = createMockState();
      const intent: IngredientEditIntent = {
        type: 'LOAD_INGREDIENT',
        payload: 'test-id-1',
      };

      mockIngredientService.getIngredients.mockRejectedValue(new Error('Load failed'));

      const result = await ingredientEditMiddleware(state, intent);

      expect(result.state?.loading).toBe(false);
      expect(result.state?.error).toBe('Load failed');
      expect(result.effects).toContainEqual(
        expect.objectContaining({
          type: 'SHOW_TOAST',
          payload: expect.objectContaining({ variant: 'error' }),
        }),
      );
    });

    it('Error가 아닌 예외 발생 시 기본 메시지를 표시한다', async () => {
      const state = createMockState();
      const intent: IngredientEditIntent = {
        type: 'LOAD_INGREDIENT',
        payload: 'test-id-1',
      };

      mockIngredientService.getIngredients.mockRejectedValue('string error');

      const result = await ingredientEditMiddleware(state, intent);

      expect(result.state?.error).toBe('데이터 로드 실패');
    });
  });

  describe('UPDATE_INGREDIENT', () => {
    it('식재료가 없으면 아무것도 하지 않는다', async () => {
      const state = createMockState({ ingredient: null });
      const intent: IngredientEditIntent = { type: 'UPDATE_INGREDIENT' };

      const result = await ingredientEditMiddleware(state, intent);

      expect(result).toEqual({});
    });

    it('이름이 비어있으면 에러 토스트를 표시한다', async () => {
      const state = createMockState({
        ingredient: mockIngredient,
        editForm: {
          name: '',
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
      const intent: IngredientEditIntent = { type: 'UPDATE_INGREDIENT' };

      const result = await ingredientEditMiddleware(state, intent);

      expect(mockIngredientService.updateIngredient).not.toHaveBeenCalled();
      expect(result.state?.errors.name).toBeDefined();
      expect(result.effects).toContainEqual(
        expect.objectContaining({
          type: 'SHOW_TOAST',
          payload: expect.objectContaining({ variant: 'error' }),
        }),
      );
    });

    it('수량이 숫자가 아니면 에러 토스트를 표시한다', async () => {
      const state = createMockState({
        ingredient: mockIngredient,
        editForm: {
          name: '우유',
          emoji: '🥛',
          category: Category.DAIRY,
          quantity: 'abc',
          unit: null,
          purchased_date_time: null,
          expired_date_time: null,
          storage_location: null,
          memo: null,
        },
      });
      const intent: IngredientEditIntent = { type: 'UPDATE_INGREDIENT' };

      const result = await ingredientEditMiddleware(state, intent);

      expect(result.state?.errors.quantity).toBeDefined();
    });

    it('수량이 0이면 에러를 반환한다', async () => {
      const state = createMockState({
        ingredient: mockIngredient,
        editForm: {
          name: '우유',
          emoji: '🥛',
          category: Category.DAIRY,
          quantity: '0',
          unit: null,
          purchased_date_time: null,
          expired_date_time: null,
          storage_location: null,
          memo: null,
        },
      });
      const intent: IngredientEditIntent = { type: 'UPDATE_INGREDIENT' };

      const result = await ingredientEditMiddleware(state, intent);

      expect(result.state?.errors.quantity).toBeDefined();
    });

    it('수량이 음수면 에러를 반환한다', async () => {
      const state = createMockState({
        ingredient: mockIngredient,
        editForm: {
          name: '우유',
          emoji: '🥛',
          category: Category.DAIRY,
          quantity: '-1',
          unit: null,
          purchased_date_time: null,
          expired_date_time: null,
          storage_location: null,
          memo: null,
        },
      });
      const intent: IngredientEditIntent = { type: 'UPDATE_INGREDIENT' };

      const result = await ingredientEditMiddleware(state, intent);

      expect(result.state?.errors.quantity).toBeDefined();
    });

    it('식재료를 성공적으로 업데이트한다', async () => {
      const state = createMockState({
        ingredient: mockIngredient,
        editForm: {
          name: '저지방 우유',
          emoji: '🥛',
          category: Category.DAIRY,
          quantity: '3',
          unit: Unit.PIECE,
          purchased_date_time: '2024-01-01T00:00:00.000Z',
          expired_date_time: '2024-12-31T00:00:00.000Z',
          storage_location: StorageLocation.REFRIGERATOR,
          memo: '유기농',
        },
      });
      const intent: IngredientEditIntent = { type: 'UPDATE_INGREDIENT' };

      mockIngredientService.updateIngredient.mockResolvedValue(undefined);

      const result = await ingredientEditMiddleware(state, intent);

      expect(mockIngredientService.updateIngredient).toHaveBeenCalledWith('test-id-1', {
        name: '저지방 우유',
        emoji: '🥛',
        category: Category.DAIRY,
        quantity: 3,
        unit: Unit.PIECE,
        purchased_date_time: '2024-01-01T00:00:00.000Z',
        expired_date_time: '2024-12-31T00:00:00.000Z',
        storage_location: StorageLocation.REFRIGERATOR,
        memo: '유기농',
      });
      expect(result.state?.errors).toEqual({});
      expect(result.effects).toContainEqual(
        expect.objectContaining({
          type: 'SHOW_TOAST',
          payload: expect.objectContaining({ variant: 'success' }),
        }),
      );
      expect(result.effects).toContainEqual(
        expect.objectContaining({
          type: 'NAVIGATE_BACK',
        }),
      );
    });

    it('수량이 정수가 아니면 null로 처리한다', async () => {
      const state = createMockState({
        ingredient: mockIngredient,
        editForm: {
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
      const intent: IngredientEditIntent = { type: 'UPDATE_INGREDIENT' };

      mockIngredientService.updateIngredient.mockResolvedValue(undefined);

      await ingredientEditMiddleware(state, intent);

      expect(mockIngredientService.updateIngredient).toHaveBeenCalledWith(
        'test-id-1',
        expect.objectContaining({
          quantity: null,
        }),
      );
    });

    it('업데이트 실패 시 에러 토스트를 표시한다', async () => {
      const state = createMockState({
        ingredient: mockIngredient,
        editForm: {
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
      const intent: IngredientEditIntent = { type: 'UPDATE_INGREDIENT' };

      mockIngredientService.updateIngredient.mockRejectedValue(new Error('Update failed'));

      const result = await ingredientEditMiddleware(state, intent);

      expect(result.effects).toContainEqual(
        expect.objectContaining({
          type: 'SHOW_TOAST',
          payload: expect.objectContaining({ variant: 'error' }),
        }),
      );
    });
  });

  describe('NAVIGATE_BACK', () => {
    it('NAVIGATE_BACK 이펙트를 반환한다', async () => {
      const state = createMockState();
      const intent: IngredientEditIntent = { type: 'NAVIGATE_BACK' };

      const result = await ingredientEditMiddleware(state, intent);

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

      const result = await ingredientEditMiddleware(state, intent);

      expect(result).toEqual({});
    });
  });
});
