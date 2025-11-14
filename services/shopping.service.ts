import { ShoppingItem } from '@/data/models/shopping.model';
import { shoppingRepository } from '@/data/repositories/shopping.repository';
import { achievementService } from './achievement.service';

/**
 * 장보기 리스트 관련 서비스
 * 비즈니스 로직을 처리하고 repository에 위임
 */
export const shoppingService = {
  async getShoppingList(): Promise<ShoppingItem[]> {
    return shoppingRepository.getShoppingList();
  },

  async addToShoppingList(
    item: Omit<ShoppingItem, 'id' | 'created_date_time' | 'is_purchased' | 'purchased_date_time'>,
  ): Promise<void> {
    try {
      await shoppingRepository.addToShoppingList(item);
    } catch (error) {
      console.error('Error adding to shopping list:', error);
      throw error;
    }
  },

  async updateShoppingItem(id: string, updates: Partial<ShoppingItem>): Promise<void> {
    try {
      await shoppingRepository.updateShoppingItem(id, updates);

      // 장보기 완료 시 업적 업데이트
      if (updates.is_purchased === true) {
        await achievementService.onShoppingCompleted();
      }
    } catch (error) {
      console.error('Error updating shopping item:', error);
      throw error;
    }
  },

  async deleteShoppingItem(id: string): Promise<void> {
    try {
      await shoppingRepository.deleteShoppingItem(id);
    } catch (error) {
      console.error('Error deleting shopping item:', error);
      throw error;
    }
  },

  async clearAll(): Promise<void> {
    return shoppingRepository.clearAll();
  },
};
