/**
 * Ingredient Detail Middleware Tests
 */

import { ingredientDetailMiddleware } from '@/mvi/features/ingredient-detail/middleware';
import { IngredientDetailState, IngredientDetailIntent } from '@/mvi/features/ingredient-detail/types';
import { ingredientService } from '@/services/ingredient.service';
import { shoppingService } from '@/services/shopping.service';
import { Category } from '@/data/enums/category';
import { StorageLocation } from '@/data/enums/storage_location';
import { Ingredient } from '@/data/models/ingredient.model';
import i18n from '@/locales';

jest.mock('@/services/ingredient.service', () => ({
  ingredientService: {
    getIngredients: jest.fn(),
    deleteIngredient: jest.fn(),
    consumeIngredient: jest.fn(),
  },
}));

jest.mock('@/services/shopping.service', () => ({
  shoppingService: {
    addToShoppingList: jest.fn(),
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
const mockShoppingService = shoppingService as jest.Mocked<typeof shoppingService>;

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

describe('ingredientDetailMiddleware', () => {
  const originalConsoleError = console.error;

  beforeEach(() => {
    jest.clearAllMocks();
    console.error = jest.fn();
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  describe('LOAD_INGREDIENT', () => {
    it('식재료를 성공적으로 로드한다', async () => {
      const state = createMockState();
      const intent: IngredientDetailIntent = {
        type: 'LOAD_INGREDIENT',
        payload: 'test-id-1',
      };

      mockIngredientService.getIngredients.mockResolvedValue([mockIngredient]);

      const result = await ingredientDetailMiddleware(state, intent);

      expect(mockIngredientService.getIngredients).toHaveBeenCalled();
      expect(result.state?.ingredient).toEqual(mockIngredient);
      expect(result.state?.loading).toBe(false);
      expect(result.state?.error).toBeNull();
    });

    it('존재하지 않는 식재료면 에러를 반환한다', async () => {
      const state = createMockState();
      const intent: IngredientDetailIntent = {
        type: 'LOAD_INGREDIENT',
        payload: 'non-existent-id',
      };

      mockIngredientService.getIngredients.mockResolvedValue([mockIngredient]);

      const result = await ingredientDetailMiddleware(state, intent);

      expect(result.state?.loading).toBe(false);
      expect(result.state?.error).toBe(i18n.t('ingredientDetail.notFound'));
    });

    it('로드 실패 시 에러 토스트를 표시한다', async () => {
      const state = createMockState();
      const intent: IngredientDetailIntent = {
        type: 'LOAD_INGREDIENT',
        payload: 'test-id-1',
      };

      mockIngredientService.getIngredients.mockRejectedValue(new Error('Load failed'));

      const result = await ingredientDetailMiddleware(state, intent);

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
      const intent: IngredientDetailIntent = {
        type: 'LOAD_INGREDIENT',
        payload: 'test-id-1',
      };

      mockIngredientService.getIngredients.mockRejectedValue('string error');

      const result = await ingredientDetailMiddleware(state, intent);

      expect(result.state?.error).toBe(i18n.t('ingredientDetail.loadFailed'));
    });
  });

  describe('DELETE_INGREDIENT', () => {
    it('식재료가 없으면 아무것도 하지 않는다', async () => {
      const state = createMockState({ ingredient: null });
      const intent: IngredientDetailIntent = { type: 'DELETE_INGREDIENT' };

      const result = await ingredientDetailMiddleware(state, intent);

      expect(result).toEqual({});
    });

    it('삭제 확인 다이얼로그를 표시한다', async () => {
      const state = createMockState({ ingredient: mockIngredient });
      const intent: IngredientDetailIntent = { type: 'DELETE_INGREDIENT' };

      const result = await ingredientDetailMiddleware(state, intent);

      expect(result.effects).toContainEqual(
        expect.objectContaining({
          type: 'SHOW_CONFIRM',
          payload: expect.objectContaining({
            title: i18n.t('ingredientDetail.deleteTitle'),
            isDanger: true,
          }),
        }),
      );
    });

    it('삭제 확인 시 ingredientService.deleteIngredient를 호출한다', async () => {
      const state = createMockState({ ingredient: mockIngredient });
      const intent: IngredientDetailIntent = { type: 'DELETE_INGREDIENT' };

      mockIngredientService.deleteIngredient.mockResolvedValue(undefined);

      const result = await ingredientDetailMiddleware(state, intent);

      const confirmEffect = result.effects?.find((e) => e.type === 'SHOW_CONFIRM') as any;
      const confirmResult = await confirmEffect.payload.onConfirm();

      expect(mockIngredientService.deleteIngredient).toHaveBeenCalledWith('test-id-1');
      expect(confirmResult).toEqual({ success: true });
    });

    it('삭제 실패 시 success: false를 반환한다', async () => {
      const state = createMockState({ ingredient: mockIngredient });
      const intent: IngredientDetailIntent = { type: 'DELETE_INGREDIENT' };

      mockIngredientService.deleteIngredient.mockRejectedValue(new Error('Delete failed'));

      const result = await ingredientDetailMiddleware(state, intent);

      const confirmEffect = result.effects?.find((e) => e.type === 'SHOW_CONFIRM') as any;
      const confirmResult = await confirmEffect.payload.onConfirm();

      expect(confirmResult).toEqual({ success: false });
    });
  });

  describe('DELETE_SUCCESS', () => {
    it('성공 토스트와 NAVIGATE_BACK 이펙트를 반환한다', async () => {
      const state = createMockState({ ingredient: mockIngredient });
      const intent: IngredientDetailIntent = { type: 'DELETE_SUCCESS' };

      const result = await ingredientDetailMiddleware(state, intent);

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
  });

  describe('CONSUME_INGREDIENT', () => {
    it('식재료가 없으면 아무것도 하지 않는다', async () => {
      const state = createMockState({ ingredient: null });
      const intent: IngredientDetailIntent = { type: 'CONSUME_INGREDIENT' };

      const result = await ingredientDetailMiddleware(state, intent);

      expect(result).toEqual({});
    });

    it('소모 확인 다이얼로그를 표시한다', async () => {
      const state = createMockState({ ingredient: mockIngredient });
      const intent: IngredientDetailIntent = { type: 'CONSUME_INGREDIENT' };

      const result = await ingredientDetailMiddleware(state, intent);

      expect(result.effects).toContainEqual(
        expect.objectContaining({
          type: 'SHOW_CONFIRM',
          payload: expect.objectContaining({
            title: i18n.t('ingredientDetail.consumeTitle'),
          }),
        }),
      );
    });

    it('소모 확인 시 서비스를 호출하고 장보기 목록에 추가한다', async () => {
      const state = createMockState({ ingredient: mockIngredient });
      const intent: IngredientDetailIntent = { type: 'CONSUME_INGREDIENT' };

      mockIngredientService.consumeIngredient.mockResolvedValue(undefined);
      mockShoppingService.addToShoppingList.mockResolvedValue(undefined);

      const result = await ingredientDetailMiddleware(state, intent);

      const confirmEffect = result.effects?.find((e) => e.type === 'SHOW_CONFIRM') as any;
      const confirmResult = await confirmEffect.payload.onConfirm();

      expect(mockIngredientService.consumeIngredient).toHaveBeenCalledWith('test-id-1');
      expect(mockShoppingService.addToShoppingList).toHaveBeenCalledWith({
        name: '우유',
        category: Category.DAIRY,
        emoji: '🥛',
        memo: null,
        last_modified_date_time: null,
        deleted_date_time: null,
      });
      expect(confirmResult).toEqual({ success: true, ingredientName: '우유' });
    });

    it('소모 실패 시 success: false를 반환한다', async () => {
      const state = createMockState({ ingredient: mockIngredient });
      const intent: IngredientDetailIntent = { type: 'CONSUME_INGREDIENT' };

      mockIngredientService.consumeIngredient.mockRejectedValue(new Error('Consume failed'));

      const result = await ingredientDetailMiddleware(state, intent);

      const confirmEffect = result.effects?.find((e) => e.type === 'SHOW_CONFIRM') as any;
      const confirmResult = await confirmEffect.payload.onConfirm();

      expect(confirmResult).toEqual({ success: false });
    });
  });

  describe('CONSUME_SUCCESS', () => {
    it('성공 토스트와 NAVIGATE_BACK 이펙트를 반환한다', async () => {
      const state = createMockState({ ingredient: mockIngredient });
      const intent: IngredientDetailIntent = {
        type: 'CONSUME_SUCCESS',
        payload: { name: '우유' },
      };

      const result = await ingredientDetailMiddleware(state, intent);

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
  });

  describe('NAVIGATE_TO_EDIT', () => {
    it('식재료가 없으면 아무것도 하지 않는다', async () => {
      const state = createMockState({ ingredient: null });
      const intent: IngredientDetailIntent = { type: 'NAVIGATE_TO_EDIT' };

      const result = await ingredientDetailMiddleware(state, intent);

      expect(result).toEqual({});
    });

    it('NAVIGATE_TO_EDIT 이펙트를 반환한다', async () => {
      const state = createMockState({ ingredient: mockIngredient });
      const intent: IngredientDetailIntent = { type: 'NAVIGATE_TO_EDIT' };

      const result = await ingredientDetailMiddleware(state, intent);

      expect(result.effects).toContainEqual(
        expect.objectContaining({
          type: 'NAVIGATE_TO_EDIT',
          payload: { id: 'test-id-1' },
        }),
      );
    });
  });

  describe('NAVIGATE_BACK', () => {
    it('NAVIGATE_BACK 이펙트를 반환한다', async () => {
      const state = createMockState();
      const intent: IngredientDetailIntent = { type: 'NAVIGATE_BACK' };

      const result = await ingredientDetailMiddleware(state, intent);

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

      const result = await ingredientDetailMiddleware(state, intent);

      expect(result).toEqual({});
    });
  });
});
