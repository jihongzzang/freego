import AsyncStorage from '@react-native-async-storage/async-storage';
import { CategoryType } from '@/constants/categories';
import { StorageLocationType } from '@/constants/storageLocations';
import { UnitType } from '@/constants/units';

/**
 * 재료 인터페이스
 */
export interface Ingredient {
  id: string;
  name: string;
  category: CategoryType;
  emoji?: string;
  quantity?: number;
  unit?: UnitType;
  registration_date: string;
  purchase_date?: string;
  expiry_date?: string;
  storage_location?: StorageLocationType;
  memo: string;
  created_at: string;
}

/**
 * 장보기 아이템 인터페이스
 */
export interface ShoppingItem {
  id: string;
  name: string;
  category: CategoryType;
  is_purchased: boolean;
  memo?: string;
  created_at: string;
}

/**
 * AsyncStorage 키 상수
 */
const STORAGE_KEYS = {
  INGREDIENTS: '@ingredients',
  SHOPPING_LIST: '@shopping_list',
} as const;

/**
 * 재료 및 장보기 리스트 저장소 유틸리티
 */
export const storage = {
  // ========== 재료 관련 메서드 ==========

  async getIngredients(): Promise<Ingredient[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.INGREDIENTS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading ingredients:', error);
      return [];
    }
  },

  async addIngredient(ingredient: Omit<Ingredient, 'id' | 'created_at'>): Promise<void> {
    try {
      const ingredients = await this.getIngredients();
      const newIngredient: Ingredient = {
        ...ingredient,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
      };
      ingredients.push(newIngredient);
      await AsyncStorage.setItem(STORAGE_KEYS.INGREDIENTS, JSON.stringify(ingredients));
    } catch (error) {
      console.error('Error adding ingredient:', error);
      throw error;
    }
  },

  async addMultipleIngredients(ingredientList: Omit<Ingredient, 'id' | 'created_at'>[]): Promise<void> {
    try {
      const ingredients = await this.getIngredients();
      const now = Date.now();
      const newIngredients: Ingredient[] = ingredientList.map((ingredient, index) => ({
        ...ingredient,
        id: (now + index).toString(),
        created_at: new Date().toISOString(),
      }));
      ingredients.push(...newIngredients);
      await AsyncStorage.setItem(STORAGE_KEYS.INGREDIENTS, JSON.stringify(ingredients));
    } catch (error) {
      console.error('Error adding multiple ingredients:', error);
      throw error;
    }
  },

  async updateIngredient(id: string, updates: Partial<Ingredient>): Promise<void> {
    try {
      const ingredients = await this.getIngredients();
      const index = ingredients.findIndex((item) => item.id === id);
      if (index !== -1) {
        ingredients[index] = { ...ingredients[index], ...updates };
        await AsyncStorage.setItem(STORAGE_KEYS.INGREDIENTS, JSON.stringify(ingredients));
      }
    } catch (error) {
      console.error('Error updating ingredient:', error);
      throw error;
    }
  },

  async deleteIngredient(id: string): Promise<void> {
    try {
      const ingredients = await this.getIngredients();
      const filtered = ingredients.filter((item) => item.id !== id);
      await AsyncStorage.setItem(STORAGE_KEYS.INGREDIENTS, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting ingredient:', error);
      throw error;
    }
  },

  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.INGREDIENTS);
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  },

  // ========== 장보기 리스트 관련 메서드 ==========

  async getShoppingList(): Promise<ShoppingItem[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.SHOPPING_LIST);
      return data ? JSON.parse(data) : [];
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
          id: Date.now().toString(),
          is_purchased: false,
          created_at: new Date().toISOString(),
        };
        shoppingList.push(newItem);
        await AsyncStorage.setItem(STORAGE_KEYS.SHOPPING_LIST, JSON.stringify(shoppingList));
      }
    } catch (error) {
      console.error('Error adding to shopping list:', error);
      throw error;
    }
  },

  async updateShoppingItem(id: string, updates: Partial<ShoppingItem>): Promise<void> {
    try {
      const shoppingList = await this.getShoppingList();
      const index = shoppingList.findIndex((item) => item.id === id);
      if (index !== -1) {
        shoppingList[index] = { ...shoppingList[index], ...updates };
        await AsyncStorage.setItem(STORAGE_KEYS.SHOPPING_LIST, JSON.stringify(shoppingList));
      }
    } catch (error) {
      console.error('Error updating shopping item:', error);
      throw error;
    }
  },

  async deleteShoppingItem(id: string): Promise<void> {
    try {
      const shoppingList = await this.getShoppingList();
      const filtered = shoppingList.filter((item) => item.id !== id);
      await AsyncStorage.setItem(STORAGE_KEYS.SHOPPING_LIST, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting shopping item:', error);
      throw error;
    }
  },
};
