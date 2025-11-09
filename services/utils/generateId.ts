export function generateId(): number {
  // React Native 환경에서 고유 ID 생성
  // Date.now()로 시간 기반 고유성 보장 + Math.random()으로 추가 랜덤성
  return Date.now() + Math.floor(Math.random() * 1000000);
}
