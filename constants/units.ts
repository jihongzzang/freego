/**
 * 재료 단위 상수
 */

export interface UnitItem {
  id: UnitType;
  krLabel: string;
  enLabel: string;
  value: string;
}

export const UNITS = [
  { id: 'piece', krLabel: '개', enLabel: 'piece', value: 'piece' },
  { id: 'gram', krLabel: 'g', enLabel: 'g', value: 'gram' },
  { id: 'kilogram', krLabel: 'kg', enLabel: 'kg', value: 'kilogram' },
  { id: 'milliliter', krLabel: 'ml', enLabel: 'ml', value: 'milliliter' },
  { id: 'liter', krLabel: 'L', enLabel: 'L', value: 'liter' },
  { id: 'pack', krLabel: '팩', enLabel: 'pack', value: 'pack' },
  { id: 'bunch', krLabel: '묶음', enLabel: 'bunch', value: 'bunch' },
  { id: 'whole', krLabel: '마리', enLabel: 'whole', value: 'whole' },
  { id: 'egg', krLabel: '알', enLabel: 'egg', value: 'egg' },
  { id: 'slice', krLabel: '조각', enLabel: 'slice', value: 'slice' },
  { id: 'head', krLabel: '포기', enLabel: 'head', value: 'head' },
  { id: 'sheet', krLabel: '장', enLabel: 'sheet', value: 'sheet' },
  { id: 'cluster', krLabel: '송이', enLabel: 'cluster', value: 'cluster' },
  { id: 'can', krLabel: '캔', enLabel: 'can', value: 'can' },
  { id: 'plant', krLabel: '모', enLabel: 'plant', value: 'plant' },
] as const;

export type UnitType = (typeof UNITS)[number]['id'];

export const findUnitById = (id: UnitType): UnitItem => UNITS.find((u) => u.id === id)!;
