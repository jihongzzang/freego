/**
 * Ingredients Middleware Tests
 */

import { ingredientsMiddleware } from '@/mvi/features/ingredients/middleware';
import { IngredientsState, IngredientsIntent } from '@/mvi/features/ingredients/types';
import { ingredientService } from '@/services/ingredient.service';
import { shoppingService } from '@/services/shopping.service';
import { StorageLocation } from '@/data/enums/storage_location';
import { Category } from '@/data/enums/category';
import { EnrichedIngredient } from '@/mvi/shared';

jest.mock('@/services/ingredient.service', () => ({
  ingredientService: {
    getIngredients: jest.fn(),
    deleteIngredient: jest.fn(),
    consumeIngredient: jest.fn(),
    updateIngredient: jest.fn(),
    addMultipleIngredients: jest.fn(),
  },
}));

jest.mock('@/services/shopping.service', () => ({
  shoppingService: {
    addToShoppingList: jest.fn(),
  },
}));

jest.mock('@/mvi/shared', () => ({
  handleLoadIngredients: jest.fn(),
  enrichIngredients: jest.fn((data) => data),
  createSuccessEffect: jest.fn((message) => ({
    type: 'SHOW_TOAST',
    payload: { message, variant: 'success' },
  })),
  createErrorEffect: jest.fn((message) => ({
    type: 'SHOW_TOAST',
    payload: { message, variant: 'error' },
  })),
  createNavigateEffect: jest.fn((path) => ({
    type: 'NAVIGATE',
    payload: path,
  })),
}));

const mockIngredientService = ingredientService as jest.Mocked<typeof ingredientService>;
const mockShoppingService = shoppingService as jest.Mocked<typeof shoppingService>;

const createMockState = (overrides?: Partial<IngredientsState>): IngredientsState => ({
  ingredients: [],
  loading: false,
  error: null,
  ...overrides,
});

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

describe('ingredientsMiddleware', () => {
  const originalConsoleError = console.error;

  beforeEach(() => {
    jest.clearAllMocks();
    // 테스트 중 console.error 억제
    console.error = jest.fn();
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  describe('ADD_TO_SHOPPING_LIST_INGREDIENT', () => {
    it('재료를 장보기 목록에 성공적으로 추가한다', async () => {
      const state = createMockState({ ingredients: [mockIngredient] });
      const intent: IngredientsIntent = {
        type: 'ADD_TO_SHOPPING_LIST_INGREDIENT',
        payload: 'test-id-1',
      };

      mockShoppingService.addToShoppingList.mockResolvedValue(undefined);
      mockIngredientService.getIngredients.mockResolvedValue([mockIngredient]);

      const result = await ingredientsMiddleware(state, intent);

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

    it('존재하지 않는 재료 ID인 경우 에러 토스트를 표시한다', async () => {
      const state = createMockState({ ingredients: [mockIngredient] });
      const intent: IngredientsIntent = {
        type: 'ADD_TO_SHOPPING_LIST_INGREDIENT',
        payload: 'non-existent-id',
      };

      const result = await ingredientsMiddleware(state, intent);

      expect(mockShoppingService.addToShoppingList).not.toHaveBeenCalled();
      expect(result.effects).toContainEqual(
        expect.objectContaining({
          type: 'SHOW_TOAST',
          payload: expect.objectContaining({ variant: 'error' }),
        }),
      );
    });

    it('장보기 추가 실패 시 에러 토스트를 표시한다', async () => {
      const state = createMockState({ ingredients: [mockIngredient] });
      const intent: IngredientsIntent = {
        type: 'ADD_TO_SHOPPING_LIST_INGREDIENT',
        payload: 'test-id-1',
      };

      mockShoppingService.addToShoppingList.mockRejectedValue(new Error('API Error'));

      const result = await ingredientsMiddleware(state, intent);

      expect(result.effects).toContainEqual(
        expect.objectContaining({
          type: 'SHOW_TOAST',
          payload: expect.objectContaining({ variant: 'error' }),
        }),
      );
    });
  });

  describe('NAVIGATE_TO_DETAIL', () => {
    it('재료 상세 페이지로 네비게이션한다', async () => {
      const state = createMockState();
      const intent: IngredientsIntent = {
        type: 'NAVIGATE_TO_DETAIL',
        payload: 'test-id-1',
      };

      const result = await ingredientsMiddleware(state, intent);

      expect(result.effects).toContainEqual(
        expect.objectContaining({
          type: 'NAVIGATE',
          payload: '/ingredient/test-id-1',
        }),
      );
    });
  });

  describe('DELETE_INGREDIENT', () => {
    it('재료를 성공적으로 삭제한다', async () => {
      const state = createMockState({ ingredients: [mockIngredient] });
      const intent: IngredientsIntent = {
        type: 'DELETE_INGREDIENT',
        payload: 'test-id-1',
      };

      mockIngredientService.deleteIngredient.mockResolvedValue(undefined);
      mockIngredientService.getIngredients.mockResolvedValue([]);

      const result = await ingredientsMiddleware(state, intent);

      expect(mockIngredientService.deleteIngredient).toHaveBeenCalledWith('test-id-1');
      expect(result.state?.ingredients).toEqual([]);
      expect(result.effects).toContainEqual(
        expect.objectContaining({
          type: 'SHOW_TOAST',
          payload: expect.objectContaining({ variant: 'success' }),
        }),
      );
    });

    it('삭제 실패 시 에러 토스트를 표시한다', async () => {
      const state = createMockState({ ingredients: [mockIngredient] });
      const intent: IngredientsIntent = {
        type: 'DELETE_INGREDIENT',
        payload: 'test-id-1',
      };

      mockIngredientService.deleteIngredient.mockRejectedValue(new Error('Delete failed'));

      const result = await ingredientsMiddleware(state, intent);

      expect(result.effects).toContainEqual(
        expect.objectContaining({
          type: 'SHOW_TOAST',
          payload: expect.objectContaining({ variant: 'error' }),
        }),
      );
    });
  });

  describe('CONSUME_INGREDIENT', () => {
    it('재료를 성공적으로 소모하고 장보기 목록에 추가한다', async () => {
      const state = createMockState({ ingredients: [mockIngredient] });
      const intent: IngredientsIntent = {
        type: 'CONSUME_INGREDIENT',
        payload: 'test-id-1',
      };

      mockIngredientService.consumeIngredient.mockResolvedValue(undefined);
      mockShoppingService.addToShoppingList.mockResolvedValue(undefined);
      mockIngredientService.getIngredients.mockResolvedValue([]);

      const result = await ingredientsMiddleware(state, intent);

      expect(mockIngredientService.consumeIngredient).toHaveBeenCalledWith('test-id-1');
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

    it('존재하지 않는 재료 소모 시 에러 토스트를 표시한다', async () => {
      const state = createMockState({ ingredients: [mockIngredient] });
      const intent: IngredientsIntent = {
        type: 'CONSUME_INGREDIENT',
        payload: 'non-existent-id',
      };

      const result = await ingredientsMiddleware(state, intent);

      expect(mockIngredientService.consumeIngredient).not.toHaveBeenCalled();
      expect(result.effects).toContainEqual(
        expect.objectContaining({
          type: 'SHOW_TOAST',
          payload: expect.objectContaining({ variant: 'error' }),
        }),
      );
    });

    it('소모 실패 시 에러 토스트를 표시한다', async () => {
      const state = createMockState({ ingredients: [mockIngredient] });
      const intent: IngredientsIntent = {
        type: 'CONSUME_INGREDIENT',
        payload: 'test-id-1',
      };

      mockIngredientService.consumeIngredient.mockRejectedValue(new Error('Consume failed'));

      const result = await ingredientsMiddleware(state, intent);

      expect(result.effects).toContainEqual(
        expect.objectContaining({
          type: 'SHOW_TOAST',
          payload: expect.objectContaining({ variant: 'error' }),
        }),
      );
    });
  });

  describe('UPDATE_INGREDIENT_NAME', () => {
    it('재료 이름을 성공적으로 수정한다', async () => {
      const state = createMockState({ ingredients: [mockIngredient] });
      const intent: IngredientsIntent = {
        type: 'UPDATE_INGREDIENT_NAME',
        payload: { id: 'test-id-1', name: '저지방 우유' },
      };

      mockIngredientService.updateIngredient.mockResolvedValue(undefined);
      mockIngredientService.getIngredients.mockResolvedValue([
        { ...mockIngredient, name: '저지방 우유' },
      ]);

      const result = await ingredientsMiddleware(state, intent);

      expect(mockIngredientService.updateIngredient).toHaveBeenCalledWith('test-id-1', {
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
      const state = createMockState({ ingredients: [mockIngredient] });
      const intent: IngredientsIntent = {
        type: 'UPDATE_INGREDIENT_NAME',
        payload: { id: 'test-id-1', name: '저지방 우유' },
      };

      mockIngredientService.updateIngredient.mockRejectedValue(new Error('Update failed'));

      const result = await ingredientsMiddleware(state, intent);

      expect(result.effects).toContainEqual(
        expect.objectContaining({
          type: 'SHOW_TOAST',
          payload: expect.objectContaining({ variant: 'error' }),
        }),
      );
    });
  });

  describe('UPDATE_INGREDIENT_EMOJI', () => {
    it('재료 이모지를 성공적으로 수정한다', async () => {
      const state = createMockState({ ingredients: [mockIngredient] });
      const intent: IngredientsIntent = {
        type: 'UPDATE_INGREDIENT_EMOJI',
        payload: { id: 'test-id-1', emoji: '🥛' },
      };

      mockIngredientService.updateIngredient.mockResolvedValue(undefined);
      mockIngredientService.getIngredients.mockResolvedValue([mockIngredient]);

      const result = await ingredientsMiddleware(state, intent);

      expect(mockIngredientService.updateIngredient).toHaveBeenCalledWith('test-id-1', {
        emoji: '🥛',
      });
      expect(result.effects).toContainEqual(
        expect.objectContaining({
          type: 'SHOW_TOAST',
          payload: expect.objectContaining({ variant: 'success' }),
        }),
      );
    });

    it('이모지 수정 실패 시 에러 토스트를 표시한다', async () => {
      const state = createMockState({ ingredients: [mockIngredient] });
      const intent: IngredientsIntent = {
        type: 'UPDATE_INGREDIENT_EMOJI',
        payload: { id: 'test-id-1', emoji: '🥛' },
      };

      mockIngredientService.updateIngredient.mockRejectedValue(new Error('Update failed'));

      const result = await ingredientsMiddleware(state, intent);

      expect(result.effects).toContainEqual(
        expect.objectContaining({
          type: 'SHOW_TOAST',
          payload: expect.objectContaining({ variant: 'error' }),
        }),
      );
    });
  });

  describe('UPDATE_INGREDIENT_QUANTITY', () => {
    it('재료 수량을 성공적으로 수정한다', async () => {
      const state = createMockState({ ingredients: [mockIngredient] });
      const intent: IngredientsIntent = {
        type: 'UPDATE_INGREDIENT_QUANTITY',
        payload: { id: 'test-id-1', quantity: '5' },
      };

      mockIngredientService.updateIngredient.mockResolvedValue(undefined);
      mockIngredientService.getIngredients.mockResolvedValue([
        { ...mockIngredient, quantity: 5 },
      ]);

      const result = await ingredientsMiddleware(state, intent);

      expect(mockIngredientService.updateIngredient).toHaveBeenCalledWith('test-id-1', {
        quantity: 5,
      });
      expect(result.effects).toContainEqual(
        expect.objectContaining({
          type: 'SHOW_TOAST',
          payload: expect.objectContaining({ variant: 'success' }),
        }),
      );
    });

    it('빈 수량은 null로 설정한다', async () => {
      const state = createMockState({ ingredients: [mockIngredient] });
      const intent: IngredientsIntent = {
        type: 'UPDATE_INGREDIENT_QUANTITY',
        payload: { id: 'test-id-1', quantity: '' },
      };

      mockIngredientService.updateIngredient.mockResolvedValue(undefined);
      mockIngredientService.getIngredients.mockResolvedValue([mockIngredient]);

      await ingredientsMiddleware(state, intent);

      expect(mockIngredientService.updateIngredient).toHaveBeenCalledWith('test-id-1', {
        quantity: null,
      });
    });

    it('수량 수정 실패 시 에러 토스트를 표시한다', async () => {
      const state = createMockState({ ingredients: [mockIngredient] });
      const intent: IngredientsIntent = {
        type: 'UPDATE_INGREDIENT_QUANTITY',
        payload: { id: 'test-id-1', quantity: '5' },
      };

      mockIngredientService.updateIngredient.mockRejectedValue(new Error('Update failed'));

      const result = await ingredientsMiddleware(state, intent);

      expect(result.effects).toContainEqual(
        expect.objectContaining({
          type: 'SHOW_TOAST',
          payload: expect.objectContaining({ variant: 'error' }),
        }),
      );
    });
  });

  describe('UPDATE_INGREDIENT_STORAGE', () => {
    it('보관위치를 성공적으로 수정한다', async () => {
      const state = createMockState({ ingredients: [mockIngredient] });
      const intent: IngredientsIntent = {
        type: 'UPDATE_INGREDIENT_STORAGE',
        payload: { id: 'test-id-1', storage_location: StorageLocation.FREEZER },
      };

      mockIngredientService.updateIngredient.mockResolvedValue(undefined);
      mockIngredientService.getIngredients.mockResolvedValue([
        { ...mockIngredient, storage_location: StorageLocation.FREEZER },
      ]);

      const result = await ingredientsMiddleware(state, intent);

      expect(mockIngredientService.updateIngredient).toHaveBeenCalledWith('test-id-1', {
        storage_location: StorageLocation.FREEZER,
      });
      expect(result.effects).toContainEqual(
        expect.objectContaining({
          type: 'SHOW_TOAST',
          payload: expect.objectContaining({ variant: 'success' }),
        }),
      );
    });

    it('보관위치 수정 실패 시 에러 토스트를 표시한다', async () => {
      const state = createMockState({ ingredients: [mockIngredient] });
      const intent: IngredientsIntent = {
        type: 'UPDATE_INGREDIENT_STORAGE',
        payload: { id: 'test-id-1', storage_location: StorageLocation.FREEZER },
      };

      mockIngredientService.updateIngredient.mockRejectedValue(new Error('Update failed'));

      const result = await ingredientsMiddleware(state, intent);

      expect(result.effects).toContainEqual(
        expect.objectContaining({
          type: 'SHOW_TOAST',
          payload: expect.objectContaining({ variant: 'error' }),
        }),
      );
    });
  });

  describe('UPDATE_INGREDIENT_EXPIRY', () => {
    it('유통기한을 성공적으로 수정한다', async () => {
      const state = createMockState({ ingredients: [mockIngredient] });
      const intent: IngredientsIntent = {
        type: 'UPDATE_INGREDIENT_EXPIRY',
        payload: { id: 'test-id-1', expired_date_time: '2025-01-15T00:00:00.000Z' },
      };

      mockIngredientService.updateIngredient.mockResolvedValue(undefined);
      mockIngredientService.getIngredients.mockResolvedValue([
        { ...mockIngredient, expired_date_time: '2025-01-15' },
      ]);

      const result = await ingredientsMiddleware(state, intent);

      expect(mockIngredientService.updateIngredient).toHaveBeenCalledWith('test-id-1', {
        expired_date_time: '2025-01-15T00:00:00.000Z',
      });
      expect(result.effects).toContainEqual(
        expect.objectContaining({
          type: 'SHOW_TOAST',
          payload: expect.objectContaining({ variant: 'success' }),
        }),
      );
    });

    it('유통기한 수정 실패 시 에러 토스트를 표시한다', async () => {
      const state = createMockState({ ingredients: [mockIngredient] });
      const intent: IngredientsIntent = {
        type: 'UPDATE_INGREDIENT_EXPIRY',
        payload: { id: 'test-id-1', expired_date_time: '2025-01-15T00:00:00.000Z' },
      };

      mockIngredientService.updateIngredient.mockRejectedValue(new Error('Update failed'));

      const result = await ingredientsMiddleware(state, intent);

      expect(result.effects).toContainEqual(
        expect.objectContaining({
          type: 'SHOW_TOAST',
          payload: expect.objectContaining({ variant: 'error' }),
        }),
      );
    });
  });

  describe('UPDATE_MEMO', () => {
    it('메모를 성공적으로 수정한다', async () => {
      const state = createMockState({ ingredients: [mockIngredient] });
      const intent: IngredientsIntent = {
        type: 'UPDATE_MEMO',
        payload: { id: 'test-id-1', memo: '냉장 보관 필수' },
      };

      mockIngredientService.updateIngredient.mockResolvedValue(undefined);
      mockIngredientService.getIngredients.mockResolvedValue([
        { ...mockIngredient, memo: '냉장 보관 필수' },
      ]);

      const result = await ingredientsMiddleware(state, intent);

      expect(mockIngredientService.updateIngredient).toHaveBeenCalledWith('test-id-1', {
        memo: '냉장 보관 필수',
      });
      expect(result.effects).toContainEqual(
        expect.objectContaining({
          type: 'SHOW_TOAST',
          payload: expect.objectContaining({ variant: 'success' }),
        }),
      );
    });

    it('빈 메모는 null로 설정한다', async () => {
      const state = createMockState({ ingredients: [mockIngredient] });
      const intent: IngredientsIntent = {
        type: 'UPDATE_MEMO',
        payload: { id: 'test-id-1', memo: '' },
      };

      mockIngredientService.updateIngredient.mockResolvedValue(undefined);
      mockIngredientService.getIngredients.mockResolvedValue([mockIngredient]);

      await ingredientsMiddleware(state, intent);

      expect(mockIngredientService.updateIngredient).toHaveBeenCalledWith('test-id-1', {
        memo: null,
      });
    });

    it('메모 수정 실패 시 에러 토스트를 표시한다', async () => {
      const state = createMockState({ ingredients: [mockIngredient] });
      const intent: IngredientsIntent = {
        type: 'UPDATE_MEMO',
        payload: { id: 'test-id-1', memo: '냉장 보관 필수' },
      };

      mockIngredientService.updateIngredient.mockRejectedValue(new Error('Update failed'));

      const result = await ingredientsMiddleware(state, intent);

      expect(result.effects).toContainEqual(
        expect.objectContaining({
          type: 'SHOW_TOAST',
          payload: expect.objectContaining({ variant: 'error' }),
        }),
      );
    });
  });

  describe('BULK_ADD_INGREDIENTS', () => {
    it('여러 재료를 성공적으로 추가한다', async () => {
      const state = createMockState();
      const bulkPayload = [
        { name: '우유', category: Category.DAIRY, emoji: '🥛', storage_location: StorageLocation.REFRIGERATOR },
        { name: '계란', category: Category.DAIRY, emoji: '🥚', storage_location: StorageLocation.REFRIGERATOR },
      ];
      const intent: IngredientsIntent = {
        type: 'BULK_ADD_INGREDIENTS',
        payload: bulkPayload as any,
      };

      mockIngredientService.addMultipleIngredients.mockResolvedValue(undefined);
      mockIngredientService.getIngredients.mockResolvedValue([mockIngredient]);

      const result = await ingredientsMiddleware(state, intent);

      expect(mockIngredientService.addMultipleIngredients).toHaveBeenCalledWith(bulkPayload);
      expect(result.effects).toContainEqual(
        expect.objectContaining({
          type: 'SHOW_TOAST',
          payload: expect.objectContaining({ variant: 'success' }),
        }),
      );
    });

    it('일괄 추가 실패 시 에러 토스트를 표시한다', async () => {
      const state = createMockState();
      const intent: IngredientsIntent = {
        type: 'BULK_ADD_INGREDIENTS',
        payload: [],
      };

      mockIngredientService.addMultipleIngredients.mockRejectedValue(new Error('Bulk add failed'));

      const result = await ingredientsMiddleware(state, intent);

      expect(result.effects).toContainEqual(
        expect.objectContaining({
          type: 'SHOW_TOAST',
          payload: expect.objectContaining({ variant: 'error' }),
        }),
      );
    });
  });

  describe('NAVIGATE_TO_ADD', () => {
    it('재료 추가 페이지로 네비게이션한다', async () => {
      const state = createMockState();
      const intent: IngredientsIntent = {
        type: 'NAVIGATE_TO_ADD',
      };

      const result = await ingredientsMiddleware(state, intent);

      expect(result.effects).toContainEqual(
        expect.objectContaining({
          type: 'NAVIGATE',
          payload: '/add',
        }),
      );
    });
  });
});
