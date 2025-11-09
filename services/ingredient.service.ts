import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ingredient } from '@/data/models/ingredient.model';
import { generateId } from './utils/generateId';

/**
 * AsyncStorage 키 상수
 */
const STORAGE_KEY = '@ingredients';

/**
 * 재료 관련 서비스
 */
export const ingredientService = {
  async getIngredients(): Promise<Ingredient[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      const ingredients = data ? JSON.parse(data) : [];
      return ingredients.filter((item: Ingredient) => !item.deleted_at);
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
        id: generateId(),
        created_at: new Date().toISOString(),
      };
      ingredients.push(newIngredient);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(ingredients));
    } catch (error) {
      console.error('Error adding ingredient:', error);
      throw error;
    }
  },

  async addMultipleIngredients(ingredientList: Omit<Ingredient, 'id' | 'created_at'>[]): Promise<void> {
    try {
      const ingredients = await this.getIngredients();
      const newIngredients: Ingredient[] = ingredientList.map((ingredient) => ({
        ...ingredient,
        id: generateId(),
        created_at: new Date().toISOString(),
      }));
      ingredients.push(...newIngredients);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(ingredients));
    } catch (error) {
      console.error('Error adding multiple ingredients:', error);
      throw error;
    }
  },

  async updateIngredient(id: number, updates: Partial<Ingredient>): Promise<void> {
    try {
      const ingredients = await this.getIngredients();
      const index = ingredients.findIndex((item) => item.id === id);
      if (index !== -1) {
        ingredients[index] = {
          ...ingredients[index],
          ...updates,
          updated_at: new Date().toISOString(),
        };
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(ingredients));
      }
    } catch (error) {
      console.error('Error updating ingredient:', error);
      throw error;
    }
  },

  async deleteIngredient(id: number): Promise<void> {
    try {
      const ingredients = await this.getIngredients();
      const index = ingredients.findIndex((item) => item.id === id);

      if (index !== -1) {
        ingredients[index] = {
          ...ingredients[index],
          deleted_at: new Date().toISOString(), // 삭제 시각 기록
        };
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(ingredients));
      }
    } catch (error) {
      console.error('Error marking ingredient as deleted:', error);
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
