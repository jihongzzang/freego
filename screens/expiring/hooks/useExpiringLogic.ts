import { useEffect, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { useRouter } from '@/hooks/useRouter';
import { useToast } from '@/components/ui';
import { useMVIStore } from '@/mvi/base';
import { createExpiringStore } from '@/mvi/features/expiring';

export function useExpiringLogic() {
  const router = useRouter();
  const { showToast } = useToast();
  const [state, dispatch, effect] = useMVIStore(createExpiringStore);

  // Effect 처리
  useEffect(() => {
    if (effect) {
      switch (effect.type) {
        case 'NAVIGATE':
          if (effect.payload === 'back') {
            router.back();
          } else {
            router.push(effect.payload as any);
          }
          break;
        case 'SHOW_TOAST':
          showToast({
            message: effect.payload.message,
            type: effect.payload.variant,
          });
          break;
      }
    }
  }, [effect, router, showToast]);

  // 화면 포커스 시 데이터 로드
  useFocusEffect(
    useCallback(() => {
      dispatch({ type: 'LOAD_INGREDIENTS' });
    }, [dispatch]),
  );

  const handleNavigateBack = () => {
    dispatch({ type: 'NAVIGATE_BACK' });
  };

  const handleNavigateToDetail = (id: number) => {
    dispatch({ type: 'NAVIGATE_TO_DETAIL', payload: id.toString() });
  };

  const handleQuickDeduct = (id: number) => {
    dispatch({ type: 'DELETE_INGREDIENT', payload: id });
  };

  return {
    ingredients: state.ingredients,
    loading: state.loading,
    handleNavigateBack,
    handleNavigateToDetail,
    handleQuickDeduct,
  };
}
