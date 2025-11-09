module.exports = {
  preset: 'jest-expo',

  // TypeScript 파일 변환 설정
  transform: {
    '^.+\\.tsx?$': [
      'babel-jest',
      {
        configFile: './babel.config.js',
      },
    ],
  },

  // 테스트 파일 패턴
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],

  // 모듈 경로 alias 설정 (tsconfig.json의 paths와 일치)
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },

  // 테스트 환경 설정
  testEnvironment: 'node',

  // Setup 파일
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  // 커버리지 설정
  collectCoverageFrom: [
    'services/**/*.{ts,tsx}',
    'utils/**/*.{ts,tsx}',
    'hooks/**/*.{ts,tsx}',
    'components/**/*.{ts,tsx}',
    'contexts/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/__tests__/**',
  ],

  // 커버리지 임계값 (선택사항)
  coverageThreshold: {
    global: {
      statements: 0,
      branches: 0,
      functions: 0,
      lines: 0,
    },
  },

  // 무시할 경로
  testPathIgnorePatterns: [
    '/node_modules/',
    '/\.expo/',
  ],

  // 모듈 파일 확장자
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],

  // 변환하지 않을 모듈 (React Native 라이브러리들)
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)',
  ],
};
