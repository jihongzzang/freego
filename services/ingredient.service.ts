import { Ingredient } from '@/data/models/ingredient.model';
import { ingredientRepository } from '@/data/repositories/ingredient.repository';
import { checkExpiryAndNotify } from './notification.service';

/**
 * 재료 관련 서비스
 * 비즈니스 로직 (알림 등)을 처리하고 repository에 위임
 */
export const ingredientService = {
  async getIngredients(): Promise<Ingredient[]> {
    return ingredientRepository.getIngredients();
  },

  async addIngredient(ingredient: Omit<Ingredient, 'id' | 'created_date_time'>): Promise<void> {
    try {
      await ingredientRepository.addIngredient(ingredient);

      // 유통기한 알림 체크 (트리거 2: 재료 등록)
      await checkExpiryAndNotify();
    } catch (error) {
      console.error('Error adding ingredient:', error);
      throw error;
    }
  },

  async addMultipleIngredients(ingredientList: Omit<Ingredient, 'id' | 'created_date_time'>[]): Promise<void> {
    try {
      await ingredientRepository.addMultipleIngredients(ingredientList);

      // 유통기한 알림 체크 (트리거 2: 재료 등록)
      await checkExpiryAndNotify();
    } catch (error) {
      console.error('Error adding multiple ingredients:', error);
      throw error;
    }
  },

  async updateIngredient(id: string, updates: Partial<Ingredient>): Promise<void> {
    try {
      const updated = await ingredientRepository.updateIngredient(id, updates);

      if (updated) {
        // 유통기한 알림 체크 (트리거 3: 재료 수정)
        await checkExpiryAndNotify();
      }
    } catch (error) {
      console.error('Error updating ingredient:', error);
      throw error;
    }
  },

  async deleteIngredient(id: string): Promise<void> {
    try {
      const deleted = await ingredientRepository.deleteIngredient(id);

      if (deleted) {
        // 유통기한 알림 체크 (트리거 4: 재료 삭제)
        await checkExpiryAndNotify();
      }
    } catch (error) {
      console.error('Error marking ingredient as deleted:', error);
      throw error;
    }
  },

  async clearAll(): Promise<void> {
    return ingredientRepository.clearAll();
  },
};
