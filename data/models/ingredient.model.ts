import { Category } from '../enums/category';
import { StorageLocation } from '../enums/storage_location';
import { Unit } from '../enums/unit';

/**
 * 📦 냉장고 재고 아이템
 */
export interface Ingredient {
  id: string; // 유저 재료 ID

  name: string; // 재료 이름
  category: Category; // 카테고리 ID (enum)
  emoji: string | null; // 이모지 (optional)
  memo: string | null; // 메모 (optional)
  quantity: number | null; // 수량 (optional)
  unit: Unit | null; // 단위 ID (enum) (optional)
  storage_location: StorageLocation | null; // 보관 위치 ID (enum) (optional)
  purchased_date_time: string | null; // 구매 일시 (ISO, 00:00:00 기준) (optional)
  expired_date_time: string | null; // 유통기한 (ISO, 00:00:00 기준)  (optional)
  deleted_date_time: string | null; // 삭제 일시 (ISO) (optional)
  consumed_date_time: string | null; // 소비 일시 (ISO) (optional)

  created_date_time: string | null; // 생성 일시 (ISO)
  last_modifed_date_time: string | null; // 수정 일시 (ISO) (optional)
}
