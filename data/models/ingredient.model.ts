import { Category } from '../enums/category';
import { StorageLocation } from '../enums/storage_location';
import { Unit } from '../enums/unit';

/**
 * 📦 냉장고 재고 아이템
 */
export interface Ingredient {
  id: number; // 유저 재료 ID
  name: string; // 재료 이름
  category: Category; // 카테고리 ID (enum)
  emoji?: string; // 이모지
  quantity?: number; // 수량
  unit?: Unit; // 단위 ID (enum)
  storage_location?: StorageLocation; // 보관 위치 ID (enum)
  memo?: string; // 메모
  expiry_date?: string; // 유통기한 (ISO, 00:00:00 기준)
  purchased_date?: string; // 구매 일시 (ISO, 00:00:00 기준)
  created_at: string; // 생성 일시 (ISO)
  updated_at?: string; // 수정 일시 (ISO)
  deleted_at?: string; // 삭제 일시 (ISO)
}
