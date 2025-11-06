/**
 * 재료 상태 상수
 */

export interface StatusItem {
  id: StatusType;
  value: string;
  krLabel: string;
  enLabel: string;
}

export const ITEM_STATUSES = [
  { id: 'valid', value: 'valid', krLabel: '유효', enLabel: 'Valid' },
  { id: 'expired', value: 'expired', krLabel: '만료', enLabel: 'Expired' },
  { id: 'not_set', value: 'not_set', krLabel: '미설정', enLabel: 'Not Set' },
] as const;

// ✅ 타입 자동 추론 (‘any’ 방지)
export type StatusType = (typeof ITEM_STATUSES)[number]['id'];

// ✅ undefined 불가 (항상 존재하므로 ‘!’ 사용)
export const findStatusById = (id: StatusType): StatusItem =>
  ITEM_STATUSES.find((status) => status.id === id)!;
