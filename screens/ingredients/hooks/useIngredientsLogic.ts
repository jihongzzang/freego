import { useEffect, useCallback, useRef, useState } from 'react';
import { Animated } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useRouter } from '@/hooks/useRouter';
import { useMVIStore } from '@/mvi/base';
import { createIngredientsStore } from '@/mvi/features/ingredients';
import { useBulkAdd } from '@/hooks/useBulkAdd';

export type ViewMode = 'category' | 'storage';

export function useIngredientsLogic() {
  const router = useRouter();
  const [state, dispatch, effect] = useMVIStore(createIngredientsStore);
  const { ingredients, loading } = state;

  // 뷰 모드 상태
  const [viewMode, setViewMode] = useState<ViewMode>('category');

  // 스크롤 애니메이션
  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef(null);

  // BulkAdd 훅
  const bulkAdd = useBulkAdd(() => {
    dispatch({ type: 'LOAD_INGREDIENTS' });
  });

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
          break;
      }
    }
  }, [effect, router]);

  // 화면 포커스 시 데이터 로드
  useFocusEffect(
    useCallback(() => {
      dispatch({ type: 'LOAD_INGREDIENTS' });
    }, [dispatch]),
  );

  function navigateToDetail(id: string) {
    dispatch({ type: 'NAVIGATE_TO_DETAIL', payload: Number(id) });
  }

  function navigateToEdit(id: string) {
    dispatch({ type: 'NAVIGATE_TO_DETAIL_EDIT', payload: Number(id) });
  }

  function quickDeduct(id: string) {
    dispatch({ type: 'DELETE_INGREDIENT', payload: Number(id) });
  }

  function handleAddDirect() {
    router.push('/add');
  }

  return {
    ingredients,
    loading,
    viewMode,
    setViewMode,
    scrollY,
    scrollViewRef,
    bulkAdd,
    navigateToDetail,
    navigateToEdit,
    quickDeduct,
    handleAddDirect,
  };
}
