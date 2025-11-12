import AsyncStorage from '@react-native-async-storage/async-storage';
import { ShoppingItem } from '@/data/models/shopping.model';
import { generateId } from '@/services/utils/generateId';

/**
 * AsyncStorage 키 상수
 */
const STORAGE_KEY = '@shopping_list';

/**
 * 장보기 데이터 접근 레포지토리
 * AsyncStorage와의 상호작용만 담당
 */
export const shoppingRepository = {
  /**
   * 모든 장보기 아이템 가져오기 (삭제/구매되지 않은 것만)
   */
  async getShoppingList(): Promise<ShoppingItem[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      const list = data ? JSON.parse(data) : [];
      return list.filter((item: ShoppingItem) => !item.deleted_at && !item.is_purchased);
    } catch (error) {
      console.error('Error reading shopping list:', error);
      return [];
    }
  },

  /**
   * 원본 데이터 가져오기 (삭제/구매된 것 포함)
   */
  async getAllShoppingItemsRaw(): Promise<ShoppingItem[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading all shopping items:', error);
      return [];
    }
  },

  /**
   * 장보기 데이터 저장
   */
  async saveShoppingList(items: ShoppingItem[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Error saving shopping list:', error);
      throw error;
    }
  },

  /**
   * 장보기 아이템 추가
   */
  async addToShoppingList(item: Omit<ShoppingItem, 'id' | 'created_at' | 'is_purchased'>): Promise<ShoppingItem> {
    try {
      const shoppingList = await this.getAllShoppingItemsRaw();
      const newItem: ShoppingItem = {
        ...item,
        id: generateId(),
        is_purchased: false,
        created_at: new Date().toISOString(),
      };
      shoppingList.push(newItem);
      await this.saveShoppingList(shoppingList);
      return newItem;
    } catch (error) {
      console.error('Error adding to shopping list:', error);
      throw error;
    }
  },

  /**
   * 장보기 아이템 업데이트
   */
  async updateShoppingItem(id: number, updates: Partial<ShoppingItem>): Promise<boolean> {
    try {
      const shoppingList = await this.getAllShoppingItemsRaw();
      const index = shoppingList.findIndex((item) => item.id === id);

      if (index !== -1) {
        shoppingList[index] = {
          ...shoppingList[index],
          ...updates,
          updated_at: new Date().toISOString(),
        };
        await this.saveShoppingList(shoppingList);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating shopping item:', error);
      throw error;
    }
  },

  /**
   * 장보기 아이템 삭제 (soft delete)
   */
  async deleteShoppingItem(id: number): Promise<boolean> {
    try {
      const shoppingList = await this.getAllShoppingItemsRaw();
      const index = shoppingList.findIndex((item) => item.id === id);

      if (index !== -1) {
        shoppingList[index] = {
          ...shoppingList[index],
          deleted_at: new Date().toISOString(),
        };
        await this.saveShoppingList(shoppingList);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting shopping item:', error);
      throw error;
    }
  },

  /**
   * 모든 장보기 아이템 삭제
   */
  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  },
};
