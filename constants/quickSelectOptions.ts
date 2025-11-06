/**
 * 유통기한 빠른 선택 옵션 상수
 */

export interface QuickSelectOption {
  id: string;
  days: number;
  krLabel: string;
  enLabel: string;
}

export const QUICK_SELECT_OPTIONS: readonly QuickSelectOption[] = [
  { id: '3_days', days: 3, krLabel: '3일', enLabel: '3 days' },
  { id: '7_days', days: 7, krLabel: '7일', enLabel: '7 days' },
  { id: '2_weeks', days: 14, krLabel: '2주', enLabel: '2 weeks' },
  { id: '1_month', days: 30, krLabel: '한달', enLabel: '1 month' },
] as const;

export const findQuickSelectById = (id: string): QuickSelectOption | undefined =>
  QUICK_SELECT_OPTIONS.find((option) => option.id === id);

export type QuickSelectType = (typeof QUICK_SELECT_OPTIONS)[number]['id'];
