import { Unit } from '@/data/enums/unit';

export function getUnitLabel({ unit, lang = 'kr' }: { unit: Unit; lang?: 'kr' | 'en' }): string {
  const map: Record<Unit, { kr: string; en: string }> = {
    [Unit.PIECE]: { kr: '개', en: 'piece' },
    [Unit.GRAM]: { kr: 'g', en: 'gram' },
    [Unit.KILOGRAM]: { kr: 'kg', en: 'kilogram' },
    [Unit.MILLILITER]: { kr: 'ml', en: 'milliliter' },
    [Unit.LITER]: { kr: 'L', en: 'liter' },
    [Unit.PACK]: { kr: '팩', en: 'pack' },
    [Unit.BUNCH]: { kr: '묶음', en: 'bunch' },
    [Unit.WHOLE]: { kr: '마리', en: 'whole' },
    [Unit.EGG]: { kr: '알', en: 'egg' },
    [Unit.SLICE]: { kr: '조각', en: 'slice' },
    [Unit.HEAD]: { kr: '포기', en: 'head' },
    [Unit.SHEET]: { kr: '장', en: 'sheet' },
    [Unit.CLUSTER]: { kr: '송이', en: 'cluster' },
    [Unit.CAN]: { kr: '캔', en: 'can' },
    [Unit.PLANT]: { kr: '모', en: 'plant' },
  };

  return map[unit][lang];
}
