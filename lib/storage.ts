import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Ingredient {
  id: string;
  name: string;
  category: string;
  quantity: number | null;
  unit: string | null;
  purchase_date: string;
  expiry_date: string | null;
  storage_location: string;
  memo: string;
  created_at: string;
}

export interface ShoppingItem {
  id: string;
  name: string;
  category: string;
  is_purchased: boolean;
  created_at: string;
}

const STORAGE_KEY = '@ingredients';
const SHOPPING_KEY = '@shopping_list';

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

  async addIngredient(
    ingredient: Omit<Ingredient, 'id' | 'created_at'>,
  ): Promise<void> {
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

  async addMultipleIngredients(
    ingredientList: Omit<Ingredient, 'id' | 'created_at'>[],
  ): Promise<void> {
    try {
      const ingredients = await this.getIngredients();
      const now = Date.now();
      const newIngredients: Ingredient[] = ingredientList.map(
        (ingredient, index) => ({
          ...ingredient,
          id: (now + index).toString(),
          created_at: new Date().toISOString(),
        }),
      );
      ingredients.push(...newIngredients);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(ingredients));
    } catch (error) {
      console.error('Error adding multiple ingredients:', error);
      throw error;
    }
  },

  async updateIngredient(
    id: string,
    updates: Partial<Ingredient>,
  ): Promise<void> {
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

  async getShoppingList(): Promise<ShoppingItem[]> {
    try {
      const data = await AsyncStorage.getItem(SHOPPING_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading shopping list:', error);
      return [];
    }
  },

  async addToShoppingList(
    item: Omit<ShoppingItem, 'id' | 'created_at' | 'is_purchased'>,
  ): Promise<void> {
    try {
      const shoppingList = await this.getShoppingList();
      const existing = shoppingList.find(
        (i) => i.name === item.name && i.category === item.category,
      );

      if (!existing) {
        const newItem: ShoppingItem = {
          ...item,
          id: Date.now().toString(),
          is_purchased: false,
          created_at: new Date().toISOString(),
        };
        shoppingList.push(newItem);
        await AsyncStorage.setItem(SHOPPING_KEY, JSON.stringify(shoppingList));
      }
    } catch (error) {
      console.error('Error adding to shopping list:', error);
      throw error;
    }
  },

  async updateShoppingItem(
    id: string,
    updates: Partial<ShoppingItem>,
  ): Promise<void> {
    try {
      const shoppingList = await this.getShoppingList();
      const index = shoppingList.findIndex((item) => item.id === id);
      if (index !== -1) {
        shoppingList[index] = { ...shoppingList[index], ...updates };
        await AsyncStorage.setItem(SHOPPING_KEY, JSON.stringify(shoppingList));
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
      await AsyncStorage.setItem(SHOPPING_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting shopping item:', error);
      throw error;
    }
  },
};
