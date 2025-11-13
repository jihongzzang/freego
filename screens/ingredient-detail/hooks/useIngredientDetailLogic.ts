import { useEffect, useRef } from 'react';
import { BackHandler } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useRouter } from '@/hooks/useRouter';
import { useDialog } from '@/contexts/DialogContext';
import { useToast } from '@/components/ui';
import { useMVIStore } from '@/mvi/base';
import { createIngredientDetailStore } from '@/mvi/features/ingredient-detail';

export function useIngredientDetailLogic() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { confirm } = useDialog();
  const { showToast } = useToast();
  const [state, dispatch, effect] = useMVIStore(createIngredientDetailStore);
  const processedEffectRef = useRef<typeof effect>(null);

  // 식재료 데이터 로드
  useEffect(() => {
    if (id) {
      dispatch({ type: 'LOAD_INGREDIENT', payload: id as string });
    }
  }, [id, dispatch]);

  // Effect 처리
  useEffect(() => {
    if (!effect) return;

    // 이미 처리한 effect는 다시 처리하지 않음
    if (processedEffectRef.current === effect) return;
    processedEffectRef.current = effect;

    switch (effect.type) {
      case 'SHOW_TOAST':
        showToast({
          message: effect.payload.message,
          type: effect.payload.variant,
        });
        break;

      case 'SHOW_CONFIRM':
        confirm({
          title: effect.payload.title,
          message: effect.payload.message,
          onConfirm: async () => {
            const result = await effect.payload.onConfirm();

            // 삭제 성공
            if (effect.payload.isDanger && result && result.success) {
              dispatch({ type: 'DELETE_SUCCESS' });
            }
            // 소모 성공
            else if (!effect.payload.isDanger && result && result.success && result.ingredientName) {
              dispatch({
                type: 'CONSUME_SUCCESS',
                payload: { name: result.ingredientName },
              });
            }
          },
          onCancel: undefined,
          confirmText: effect.payload.isDanger ? '삭제' : '소모',
          cancelText: '취소',
          isDestructive: effect.payload.isDanger,
        });
        break;

      case 'NAVIGATE_BACK':
        router.back();
        break;
    }
  }, [effect, confirm, showToast, router, dispatch]);

  const handleDelete = () => {
    dispatch({ type: 'DELETE_INGREDIENT' });
  };

  const handleConsume = () => {
    dispatch({ type: 'CONSUME_INGREDIENT' });
  };

  const handleBackPress = () => {
    dispatch({ type: 'NAVIGATE_BACK' });
  };

  const handleEdit = () => {
    router.push(`/ingredient-edit/${id}` as any);
  };

  return {
    state,
    dispatch,
    handleDelete,
    handleConsume,
    handleBackPress,
    handleEdit,
  };
}
