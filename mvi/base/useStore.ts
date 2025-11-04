/**
 * React Hook for MVI Store
 *
 * Store를 React 컴포넌트에서 사용하기 위한 훅
 */

import { useEffect, useState, useCallback } from 'react';
import { Store } from './Store';
import { Intent, State, Effect } from './types';

/**
 * Store를 React 컴포넌트에서 사용하기 위한 Hook
 *
 * @param store - MVI Store 인스턴스
 * @returns [state, dispatch, effect] 튜플
 */
export function useStore<S extends State, I extends Intent, E extends Effect>(
  store: Store<S, I, E>
): [S, (intent: I) => Promise<void>, E | null] {
  const [state, setState] = useState<S>(store.getState());
  const [effect, setEffect] = useState<E | null>(null);

  useEffect(() => {
    // 상태 구독
    const unsubscribeState = store.subscribe((newState) => {
      setState(newState);
    });

    // Effect 구독
    const unsubscribeEffect = store.subscribeEffect((newEffect) => {
      setEffect(newEffect);
      // Effect는 일회성이므로 곧바로 null로 리셋
      setTimeout(() => setEffect(null), 0);
    });

    return () => {
      unsubscribeState();
      unsubscribeEffect();
    };
  }, [store]);

  const dispatch = useCallback(
    async (intent: I) => {
      await store.dispatch(intent);
    },
    [store]
  );

  return [state, dispatch, effect];
}

/**
 * Store를 생성하고 사용하기 위한 Hook (싱글톤)
 *
 * @param createStore - Store 생성 함수
 * @returns [state, dispatch, effect] 튜플
 */
export function useMVIStore<S extends State, I extends Intent, E extends Effect>(
  createStore: () => Store<S, I, E>
): [S, (intent: I) => Promise<void>, E | null] {
  const [store] = useState(createStore);
  return useStore(store);
}
