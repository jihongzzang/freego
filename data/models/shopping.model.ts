import { Category } from '../enums/category';

/**
 * 장보기 아이템 인터페이스
 */
export interface ShoppingItem {
  id: string; // 장보기 항목 ID

  name: string; // 항목 이름
  category: Category; // 카테고리 ID (enum)
  is_purchased: boolean; // 구매 여부
  emoji: string | null; // 이모지
  memo: string | null; // 메모

  created_date_time: string | null; // 생성 일시 (ISO)
  last_modified_date_time: string | null; // 수정 일시 (ISO)
  deleted_date_time: string | null; // 삭제 일시 (ISO)
  purchased_date_time: string | null; // 구매 일시 (ISO)
}
