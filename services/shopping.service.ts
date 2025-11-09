import AsyncStorage from '@react-native-async-storage/async-storage';
import { ShoppingItem } from '@/data/models/shopping.model';
import { generateId } from './utils/generateId';

/**
 * AsyncStorage 키 상수
 */
const STORAGE_KEY = '@shopping_list';

/**
 * 장보기 리스트 관련 서비스
 */
export const shoppingService = {
  async getShoppingList(): Promise<ShoppingItem[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      const list = data ? JSON.parse(data) : [];
      return list.filter((item: ShoppingItem) => !item.deleted_at);
    } catch (error) {
      console.error('Error reading shopping list:', error);
      return [];
    }
  },

  async addToShoppingList(item: Omit<ShoppingItem, 'id' | 'created_at' | 'is_purchased'>): Promise<void> {
    try {
      const shoppingList = await this.getShoppingList();
      const existing = shoppingList.find((i) => i.name === item.name && i.category === item.category);

      if (!existing) {
        const newItem: ShoppingItem = {
          ...item,
          id: generateId(),
          is_purchased: false,
          created_at: new Date().toISOString(),
        };
        shoppingList.push(newItem);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(shoppingList));
      }
    } catch (error) {
      console.error('Error adding to shopping list:', error);
      throw error;
    }
  },

  async updateShoppingItem(id: number, updates: Partial<ShoppingItem>): Promise<void> {
    try {
      const shoppingList = await this.getShoppingList();
      const index = shoppingList.findIndex((item) => item.id === id);

      if (index !== -1) {
        shoppingList[index] = {
          ...shoppingList[index],
          ...updates,
          updated_at: new Date().toISOString(),
        };
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(shoppingList));
      }
    } catch (error) {
      console.error('Error updating shopping item:', error);
      throw error;
    }
  },

  async deleteShoppingItem(id: number): Promise<void> {
    try {
      const shoppingList = await this.getShoppingList();
      const index = shoppingList.findIndex((item) => item.id === id);
      if (index !== -1) {
        shoppingList[index] = {
          ...shoppingList[index],
          deleted_at: new Date().toISOString(), // 삭제 시각 기록
        };
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(shoppingList));
      }
    } catch (error) {
      console.error('Error deleting shopping item:', error);
      throw error;
    }
  },

  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  },
};
