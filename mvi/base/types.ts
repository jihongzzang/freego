/**
 * MVI Architecture Base Types
 *
 * Model-View-Intent 패턴의 핵심 타입 정의
 */

/**
 * Intent: 사용자의 의도/액션을 나타냄
 */
export interface Intent {
  type: string;
}

/**
 * State: 화면의 상태를 나타냄
 */
export interface State {}

/**
 * Effect: 부수 효과 (네비게이션, 토스트, 알림 등)
 */
export interface Effect {
  type: string;
}

/**
 * ViewState: 화면 렌더링을 위한 상태
 * - Idle: 초기 상태
 * - Loading: 로딩 중
 * - Success: 성공
 * - Error: 에러
 */
export type ViewState<T = any> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string };

/**
 * Reducer: Intent를 받아 새로운 State를 반환
 */
export type Reducer<S extends State, I extends Intent> = (
  state: S,
  intent: I
) => S;

/**
 * MiddlewareResult: Middleware의 결과
 * - state: 새로운 상태 (선택적)
 * - effects: 발생할 부수 효과 배열
 */
export interface MiddlewareResult<S extends State, E extends Effect> {
  state?: S;
  effects?: E[];
}

/**
 * Middleware: Intent를 처리하고 비동기 작업 수행
 */
export type Middleware<S extends State, I extends Intent, E extends Effect> = (
  state: S,
  intent: I
) => Promise<MiddlewareResult<S, E>>;
