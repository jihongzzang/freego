import { CategoryType } from '@/constants/categories';

/**
 * 장보기 아이템 인터페이스
 */
export interface ShoppingItem {
  id: string;
  name: string;
  category: CategoryType;
  is_purchased: boolean;
  memo?: string;
  created_at: string;
}
