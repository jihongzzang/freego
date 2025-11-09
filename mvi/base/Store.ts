/**
 * MVI Store
 *
 * Intent를 처리하고 State를 관리하는 중앙 스토어
 */

import { Intent, State, Effect, Reducer, Middleware } from './types';

export interface StoreConfig<S extends State, I extends Intent, E extends Effect> {
  initialState: S;
  reducer: Reducer<S, I>;
  middlewares?: Middleware<S, I, E>[];
}

export class Store<S extends State, I extends Intent, E extends Effect> {
  private state: S;
  private reducer: Reducer<S, I>;
  private middlewares: Middleware<S, I, E>[];
  private listeners: Array<(state: S) => void> = [];
  private effectListeners: Array<(effect: E) => void> = [];

  constructor(config: StoreConfig<S, I, E>) {
    this.state = config.initialState;
    this.reducer = config.reducer;
    this.middlewares = config.middlewares || [];
  }

  /**
   * 현재 상태 반환
   */
  getState(): S {
    return this.state;
  }

  /**
   * Intent 전송
   */
  async dispatch(intent: I): Promise<void> {
    // 1. Middleware 실행 (비동기 작업)
    for (const middleware of this.middlewares) {
      try {
        const result = await middleware(this.state, intent);

        // Middleware에서 상태 변경이 있으면 적용
        if (result.state) {
          this.setState(result.state);
        }

        // Effect가 있으면 발행
        if (result.effects) {
          result.effects.forEach((effect) => this.emitEffect(effect));
        }
      } catch (error) {
        console.error('Middleware error:', error);
      }
    }

    // 2. Reducer 실행 (동기 작업)
    const newState = this.reducer(this.state, intent);
    this.setState(newState);
  }

  /**
   * 상태 변경 및 리스너 알림
   */
  private setState(newState: S): void {
    if (newState !== this.state) {
      this.state = newState;
      this.notifyListeners();
    }
  }

  /**
   * 상태 변경 구독
   */
  subscribe(listener: (state: S) => void): () => void {
    this.listeners.push(listener);

    // 구독 해제 함수 반환
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  /**
   * Effect 구독
   */
  subscribeEffect(listener: (effect: E) => void): () => void {
    this.effectListeners.push(listener);

    // 구독 해제 함수 반환
    return () => {
      this.effectListeners = this.effectListeners.filter((l) => l !== listener);
    };
  }

  /**
   * 모든 리스너에게 상태 변경 알림
   */
  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.state));
  }

  /**
   * Effect 발행
   */
  private emitEffect(effect: E): void {
    this.effectListeners.forEach((listener) => listener(effect));
  }

  /**
   * 스토어 리셋 (테스트용)
   */
  reset(initialState: S): void {
    this.state = initialState;
    this.notifyListeners();
  }
}
