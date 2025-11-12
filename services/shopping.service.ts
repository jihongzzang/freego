import { ShoppingItem } from '@/data/models/shopping.model';
import { shoppingRepository } from '@/data/repositories/shopping.repository';

/**
 * 장보기 리스트 관련 서비스
 * 비즈니스 로직을 처리하고 repository에 위임
 */
export const shoppingService = {
  async getShoppingList(): Promise<ShoppingItem[]> {
    return shoppingRepository.getShoppingList();
  },

  async addToShoppingList(item: Omit<ShoppingItem, 'id' | 'created_at' | 'is_purchased'>): Promise<void> {
    try {
      await shoppingRepository.addToShoppingList(item);
    } catch (error) {
      console.error('Error adding to shopping list:', error);
      throw error;
    }
  },

  async updateShoppingItem(id: number, updates: Partial<ShoppingItem>): Promise<void> {
    try {
      await shoppingRepository.updateShoppingItem(id, updates);
    } catch (error) {
      console.error('Error updating shopping item:', error);
      throw error;
    }
  },

  async deleteShoppingItem(id: number): Promise<void> {
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
