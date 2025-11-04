/**
 * Statistics Screen MVI Types
 */

import { Intent, State, Effect } from '@/mvi/base';

/**
 * Statistics Data
 */
export interface Stats {
  totalIngredients: number;
  expiringItems: number;
  totalConsumed: number;
  categoryDistribution: { [key: string]: number };
  storageDistribution: { [key: string]: number };
  recentConsumptions: Array<{
    ingredient_name: string;
    quantity: number;
    consumed_date: string;
  }>;
}

/**
 * Statistics State
 */
export interface StatisticsState extends State {
  stats: Stats;
  loading: boolean;
  error: string | null;
}

/**
 * Statistics Intent (사용자 액션)
 */
export type StatisticsIntent = { type: 'LOAD_STATISTICS' };

/**
 * Statistics Effect (부수 효과)
 */
export type StatisticsEffect = { type: 'SHOW_ERROR'; payload: string };
