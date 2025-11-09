/**
 * UTC 날짜 문자열을 로컬 타임존의 날짜 문자열로 변환
 * @param utcDateString - UTC 날짜 문자열 (ISO 8601 형식)
 * @returns 로컬 타임존 날짜 문자열 (YYYY-MM-DD 형식)
 */
export function toLocalDate(utcDateString: string): string {
  const date = new Date(utcDateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
