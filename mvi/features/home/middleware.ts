/**
 * Home Middleware
 *
 * 비동기 작업 및 부수 효과 처리
 */

import { Middleware, MiddlewareResult } from '@/mvi/base';
import { HomeState, HomeIntent, HomeEffect, Ingredient } from './types';
import { ingredientService } from '@/services/ingredient.service';
import { checkExpiryAndNotify } from '@/services/notification.service';
import {
  handleLoadIngredients,
  enrichIngredients,
  createSuccessEffect,
  createErrorEffect,
  createNavigateEffect,
} from '@/mvi/shared';
import ERROR_MESSAGES from '@/constants/toast/errorMessages';
import SUCCESS_MESSAGES from '@/constants/toast/successMessages';

/**
 * 재료 정렬 함수
 *
 * 정렬 우선순위:
 * 1. expired_date_time이 있는 재료 → daysRemaining 오름차순 (유통기한 임박 순)
 * 2. expired_date_time이 없는 재료 → last_modified_date_time 내림차순 (최근 수정 순)
 * 3. last_modified_date_time도 없는 재료 → created_date_time 내림차순 (최근 생성 순)
 */
function sortIngredients(ingredients: Ingredient[]): Ingredient[] {
  return [...ingredients].sort((a, b) => {
    // 둘 다 유통기한이 있는 경우
    if (a.daysRemaining !== null && b.daysRemaining !== null) {
      return a.daysRemaining - b.daysRemaining; // 오름차순 (적게 남은 것부터)
    }

    // a만 유통기한이 있는 경우 → a가 먼저
    if (a.daysRemaining !== null && b.daysRemaining === null) {
      return -1;
    }

    // b만 유통기한이 있는 경우 → b가 먼저
    if (a.daysRemaining === null && b.daysRemaining !== null) {
      return 1;
    }

    // 둘 다 유통기한이 없는 경우 → last_modified_date_time 비교
    if (a.last_modified_date_time && b.last_modified_date_time) {
      return new Date(b.last_modified_date_time).getTime() - new Date(a.last_modified_date_time).getTime(); // 내림차순
    }

    // a만 last_modified_date_time이 있는 경우 → a가 먼저
    if (a.last_modified_date_time && !b.last_modified_date_time) {
      return -1;
    }

    // b만 last_modified_date_time이 있는 경우 → b가 먼저
    if (!a.last_modified_date_time && b.last_modified_date_time) {
      return 1;
    }

    // 둘 다 last_modified_date_time이 없는 경우 → created_date_time 비교
    if (a.created_date_time && b.created_date_time) {
      return new Date(b.created_date_time).getTime() - new Date(a.created_date_time).getTime(); // 내림차순
    }

    return 0;
  });
}

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

      // 재료 정렬 적용
      if (result.state?.ingredients) {
        result.state.ingredients = sortIngredients(result.state.ingredients);
      }

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
        const ingredients = sortIngredients(enrichIngredients(data));

        return {
          state: {
            ...state,
            ingredients,
          },
          effects: [createSuccessEffect(SUCCESS_MESSAGES.SUCCESS_EXPIRY_DATE_UPDATE)],
        };
      } catch (error) {
        console.error('Middleware: UPDATE_EXPIRY_DATE 에러', error);
        return {
          effects: [createErrorEffect(ERROR_MESSAGES.ERROR_EXPIRY_DATE_UPDATE_FAILED)],
        };
      }
    }

    case 'BULK_ADD_INGREDIENTS': {
      try {
        await ingredientService.addMultipleIngredients(intent.payload as any);

        // 추가 후 다시 로드
        const data = await ingredientService.getIngredients();
        const ingredients = sortIngredients(enrichIngredients(data));

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
          effects: [createErrorEffect(ERROR_MESSAGES.ERROR_INGREDIENT_CREATE_ERROR)],
        };
      }
    }

    case 'NAVIGATE_TO_ADD': {
      const path = intent.payload ? `/add?category=${intent.payload}` : '/add';
      return {
        effects: [createNavigateEffect(path)],
      };
    }

    // case 'NAVIGATE_TO_EXPIRING':
    //   return {
    //     effects: [createNavigateEffect('/expiring')],
    //   };

    case 'NAVIGATE_TO_DETAIL':
      return {
        effects: [createNavigateEffect(`/ingredient/${intent.payload}`)],
      };

    default:
      return {};
  }
};
