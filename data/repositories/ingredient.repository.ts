import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ingredient } from '@/data/models/ingredient.model';
import { generateId } from '@/services/utils/generateId';

/**
 * AsyncStorage 키 상수
 */
const STORAGE_KEY = '@ingredients';

/**
 * 재료 데이터 접근 레포지토리
 * AsyncStorage와의 상호작용만 담당 (순환 참조 방지)
 */
export const ingredientRepository = {
  /**
   * 모든 재료 가져오기 (삭제되지 않은 것만)
   */
  async getIngredients(): Promise<Ingredient[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      const ingredients = data ? JSON.parse(data) : [];
      const result = ingredients.filter((item: Ingredient) => !item.deleted_date_time && !item.consumed_date_time);
      return result;
    } catch (error) {
      console.error('Error reading ingredients:', error);
      return [];
    }
  },

  /**
   * 원본 데이터 가져오기 (삭제된 것 포함)
   */
  async getAllIngredientsRaw(): Promise<Ingredient[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      const result = data ? JSON.parse(data) : [];
      return result;
    } catch (error) {
      console.error('Error reading all ingredients:', error);
      return [];
    }
  },

  /**
   * 재료 데이터 저장
   */
  async saveIngredients(ingredients: Ingredient[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(ingredients));
    } catch (error) {
      console.error('Error saving ingredients:', error);
      throw error;
    }
  },

  /**
   * 단일 재료 추가
   */
  async addIngredient(ingredient: Omit<Ingredient, 'id' | 'created_date_time'>): Promise<Ingredient> {
    try {
      const ingredients = await this.getAllIngredientsRaw();
      const newIngredient: Ingredient = {
        id: generateId(),
        ...ingredient,
        created_date_time: new Date().toISOString(),
      };
      ingredients.push(newIngredient);
      await this.saveIngredients(ingredients);
      return newIngredient;
    } catch (error) {
      console.error('Error adding ingredient:', error);
      throw error;
    }
  },

  /**
   * 여러 재료 추가
   */
  async addMultipleIngredients(
    ingredientList: Omit<
      Ingredient,
      | 'id'
      | 'created_date_time'
      | 'purchased_date_time'
      | 'expired_date_time'
      | 'last_modified_date_time'
      | 'deleted_date_time'
      | 'consumed_date_time'
    >[],
  ): Promise<Ingredient[]> {
    try {
      const ingredients = await this.getAllIngredientsRaw();
      const newIngredients: Ingredient[] = ingredientList.map((ingredient) => ({
        id: generateId(),
        ...ingredient,
        purchased_date_time: null,
        expired_date_time: null,
        consumed_date_time: null,
        deleted_date_time: null,
        last_modified_date_time: null,
        created_date_time: new Date().toISOString(),
      }));
      ingredients.push(...newIngredients);
      await this.saveIngredients(ingredients);
      return newIngredients;
    } catch (error) {
      console.error('Error adding multiple ingredients:', error);
      throw error;
    }
  },

  /**
   * 재료 업데이트
   */
  async updateIngredient(id: string, updates: Partial<Ingredient>): Promise<boolean> {
    try {
      const ingredients = await this.getAllIngredientsRaw();
      const index = ingredients.findIndex((item) => item.id === id);

      if (index !== -1) {
        ingredients[index] = {
          ...ingredients[index],
          ...updates,
          last_modified_date_time: new Date().toISOString(),
        };
        await this.saveIngredients(ingredients);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating ingredient:', error);
      throw error;
    }
  },

  /**
   * 재료 삭제 (soft delete)
   */
  async deleteIngredient(id: string): Promise<boolean> {
    try {
      const ingredients = await this.getAllIngredientsRaw();
      const index = ingredients.findIndex((item) => item.id === id);

      if (index !== -1) {
        ingredients[index] = {
          ...ingredients[index],
          deleted_date_time: new Date().toISOString(),
        };
        await this.saveIngredients(ingredients);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error marking ingredient as deleted:', error);
      throw error;
    }
  },

  /**
   * 재료 삭제 (soft delete)
   */
  async consumeIngredient(id: string): Promise<boolean> {
    try {
      const ingredients = await this.getAllIngredientsRaw();
      const index = ingredients.findIndex((item) => item.id === id);

      if (index !== -1) {
        ingredients[index] = {
          ...ingredients[index],
          quantity: 0,
          consumed_date_time: new Date().toISOString(),
        };
        await this.saveIngredients(ingredients);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error marking ingredient as consumed:', error);
      throw error;
    }
  },

  /**
   * 모든 재료 삭제
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
