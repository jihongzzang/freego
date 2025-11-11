import { Category } from '../enums/category';

/**
 * 장보기 아이템 인터페이스
 */
export interface ShoppingItem {
  id: number; // 장보기 항목 ID
  name: string; // 항목 이름
  category: Category; // 카테고리 ID (enum)
  is_purchased: boolean; // 구매 여부
  emoji?: string; // 이모지
  memo?: string; // 메모
  created_at: string; // 생성 일시 (ISO)
  updated_at?: string; // 수정 일시 (ISO)
  deleted_at?: string; // 삭제 일시 (ISO)
}
