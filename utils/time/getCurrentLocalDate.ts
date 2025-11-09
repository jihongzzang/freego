/**
 * 현재 로컬 타임존의 날짜 문자열 반환
 * @returns 현재 로컬 타임존 날짜 문자열 (YYYY-MM-DD 형식)
 */
export function getCurrentLocalDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
