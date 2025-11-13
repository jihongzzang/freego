/**
 * Home Middleware
 *
 * 비동기 작업 및 부수 효과 처리
 */

import { Middleware, MiddlewareResult } from '@/mvi/base';
import { HomeState, HomeIntent, HomeEffect } from './types';
import { ingredientService } from '@/services/ingredient.service';
import { checkExpiryAndNotify } from '@/services/notification.service';
import {
  handleLoadIngredients,
  enrichIngredients,
  createSuccessEffect,
  createErrorEffect,
  createNavigateEffect,
} from '@/mvi/shared';

/**
 * Home Middleware
 */
export const homeMiddleware: Middleware<HomeState, HomeIntent, HomeEffect> = async (
  state,
  intent,
): Promise<MiddlewareResult<HomeState, HomeEffect>> => {
  switch (intent.type) {
    case 'LOAD_INGREDIENTS': {
      const result = await handleLoadIngredients<HomeState, HomeEffect>();

      // 유통기한 알림 체크 (트리거 1: 앱 접속)
      await checkExpiryAndNotify();

      return result;
    }

    case 'UPDATE_EXPIRY_DATE': {
      try {
        const { id, expired_date_time } = intent.payload;

        await ingredientService.updateIngredient(id, { expired_date_time: expired_date_time });

        // 업데이트 후 다시 로드
        const data = await ingredientService.getIngredients();
        const ingredients = enrichIngredients(data);

        return {
          state: {
            ...state,
            ingredients,
          },
          effects: [createSuccessEffect('유통기한이 수정됐어요.')],
        };
      } catch (error) {
        console.error('Middleware: UPDATE_EXPIRY_DATE 에러', error);
        return {
          effects: [createErrorEffect('유통기한 수정에 실패했어요.')],
        };
      }
    }

    case 'BULK_ADD_INGREDIENTS': {
      try {
        await ingredientService.addMultipleIngredients(intent.payload as any);

        // 추가 후 다시 로드
        const data = await ingredientService.getIngredients();
        const ingredients = enrichIngredients(data);

        return {
          state: {
            ...state,
            ingredients,
          },
          effects: [createSuccessEffect(`${intent.payload.length}개의 재료가 추가됐어요.`)],
        };
      } catch (error) {
        console.error('Error adding templates:', error);
        return {
          effects: [createErrorEffect('재료 추가 중 오류가 발생했어요.')],
        };
      }
    }

    case 'NAVIGATE_TO_ADD': {
      const path = intent.payload ? `/add?category=${intent.payload}` : '/add';
      return {
        effects: [createNavigateEffect(path)],
      };
    }

    case 'NAVIGATE_TO_EXPIRING':
      return {
        effects: [createNavigateEffect('/expiring')],
      };

    case 'NAVIGATE_TO_DETAIL':
      return {
        effects: [createNavigateEffect(`/ingredient/${intent.payload}`)],
      };

    default:
      return {};
  }
};
