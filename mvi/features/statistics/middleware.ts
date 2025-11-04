/**
 * Statistics Middleware
 *
 * 비동기 작업 및 부수 효과 처리
 */

import { Middleware, MiddlewareResult } from '@/mvi/base';
import { StatisticsState, StatisticsIntent, StatisticsEffect, Stats } from './types';
import { storage } from '@/lib/storage';

/**
 * Statistics Middleware
 */
export const statisticsMiddleware: Middleware<
  StatisticsState,
  StatisticsIntent,
  StatisticsEffect
> = async (state, intent): Promise<MiddlewareResult<StatisticsState, StatisticsEffect>> => {
  switch (intent.type) {
    case 'LOAD_STATISTICS': {
      try {
        const ingredients = await storage.getIngredients();

        const totalIngredients = ingredients.length;

        // 유통기한 임박 아이템 계산 (3일 이내)
        const expiringItems = ingredients.filter((item) => {
          if (!item.expiry_date) return false;
          const today = new Date();
          const expiry = new Date(item.expiry_date);
          const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          return diffDays >= 0 && diffDays <= 3;
        }).length;

        // 카테고리별 분포
        const categoryDistribution: { [key: string]: number } = {};
        ingredients.forEach((item) => {
          categoryDistribution[item.category] = (categoryDistribution[item.category] || 0) + 1;
        });

        // 보관 위치별 분포
        const storageDistribution: { [key: string]: number } = {};
        ingredients.forEach((item) => {
          storageDistribution[item.storage_location] =
            (storageDistribution[item.storage_location] || 0) + 1;
        });

        const stats: Stats = {
          totalIngredients,
          expiringItems,
          totalConsumed: 0,
          categoryDistribution,
          storageDistribution,
          recentConsumptions: [],
        };

        return {
          state: {
            ...state,
            stats,
            loading: false,
            error: null,
          },
        };
      } catch (error) {
        console.error('Error fetching statistics:', error);
        return {
          state: {
            ...state,
            loading: false,
            error: error instanceof Error ? error.message : '통계 데이터 로드 실패',
          },
          effects: [
            {
              type: 'SHOW_ERROR',
              payload: '통계 데이터를 불러오는데 실패했습니다.',
            },
          ],
        };
      }
    }

    default:
      return {};
  }
};
