// @testing-library/react-native v12.4+ 에서는 matchers가 내장되어 있습니다
// import가 필요하지 않습니다

// AsyncStorage 모킹
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// expo-notifications 모킹
jest.mock('expo-notifications', () => ({
  setNotificationHandler: jest.fn(),
  getPermissionsAsync: jest.fn(() =>
    Promise.resolve({
      status: 'granted',
      granted: true,
      canAskAgain: false,
      expires: 'never',
    })
  ),
  requestPermissionsAsync: jest.fn(() =>
    Promise.resolve({
      status: 'granted',
      granted: true,
      canAskAgain: false,
      expires: 'never',
    })
  ),
  scheduleNotificationAsync: jest.fn(() => Promise.resolve('notification-id')),
  cancelAllScheduledNotificationsAsync: jest.fn(() => Promise.resolve()),
  getAllScheduledNotificationsAsync: jest.fn(() => Promise.resolve([])),
}));

// expo-router 모킹
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    canGoBack: jest.fn(() => true),
  }),
  useSegments: () => [],
  usePathname: () => '/',
  Tabs: 'Tabs',
  Stack: 'Stack',
  Slot: 'Slot',
}));

// react-native-reanimated 모킹 (애니메이션 관련)
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Console warning/error 필터링 (선택사항)
const originalWarn = console.warn;
const originalError = console.error;

beforeAll(() => {
  console.warn = (...args) => {
    // 특정 경고 메시지 무시
    const warningMessage = args[0];
    if (
      typeof warningMessage === 'string' &&
      (warningMessage.includes('Warning: ReactDOM.render') ||
        warningMessage.includes('Not implemented: HTMLFormElement.prototype.submit'))
    ) {
      return;
    }
    originalWarn.call(console, ...args);
  };

  console.error = (...args) => {
    // 특정 에러 메시지 무시
    const errorMessage = args[0];
    if (
      typeof errorMessage === 'string' &&
      errorMessage.includes('Warning: An update to')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.warn = originalWarn;
  console.error = originalError;
});

// 글로벌 타임아웃 설정 (긴 비동기 작업이 있을 경우)
jest.setTimeout(10000);
