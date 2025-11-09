import { Unit } from '@/data/enums/unit';
import { getUnitLabel } from './getUnitLabel';

export interface MakeUnitListOptions {
  lang?: 'kr' | 'en';
}

export function makeUnitList({ lang = 'kr' }: MakeUnitListOptions = {}) {
  const units = Object.values(Unit)
    .filter((v) => typeof v === 'number')
    .map((unit) => ({
      id: unit as Unit,
      label: getUnitLabel({ unit: unit as Unit, lang }),
    }));

  return units;
}
