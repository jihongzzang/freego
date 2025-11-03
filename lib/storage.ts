import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Ingredient {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  purchase_date: string;
  expiry_date: string | null;
  storage_location: string;
  memo: string;
  created_at: string;
}

const STORAGE_KEY = '@ingredients';

export const storage = {
  async getIngredients(): Promise<Ingredient[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
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
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(ingredients));
    } catch (error) {
      console.error('Error adding ingredient:', error);
      throw error;
    }
  },

  async updateIngredient(id: string, updates: Partial<Ingredient>): Promise<void> {
    try {
      const ingredients = await this.getIngredients();
      const index = ingredients.findIndex((item) => item.id === id);
      if (index !== -1) {
        ingredients[index] = { ...ingredients[index], ...updates };
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(ingredients));
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
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting ingredient:', error);
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
