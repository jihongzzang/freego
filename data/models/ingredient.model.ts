import { CategoryType } from '@/constants/categories';
import { StorageLocationType } from '@/constants/storageLocations';
import { UnitType } from '@/constants/units';

/**
 * 재료 인터페이스
 */
export interface Ingredient {
  id: string;
  name: string;
  category: CategoryType;
  emoji?: string;
  quantity?: number;
  unit?: UnitType;
  registration_date: string;
  purchase_date?: string;
  expiry_date?: string;
  storage_location?: StorageLocationType;
  memo: string;
  created_at: string;
}
