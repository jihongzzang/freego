import { AchievementType } from '../enums/achievement-type';

/**
 * 🏆 업적/챌린지
 */
export interface Achievement {
  id: string; // 업적 ID (AchievementType과 동일)
  type: AchievementType; // 업적 타입
  title: string; // 업적 제목
  description: string; // 업적 설명
  icon: string; // 이모지 아이콘
  category: 'streak' | 'consume' | 'register' | 'shopping'; // 카테고리
  target: number; // 목표 값
  current: number; // 현재 값
  completed: boolean; // 달성 여부
  claimed: boolean; // 뱃지 받기 완료 여부
  completed_date_time: string | null; // 달성 일시 (ISO)
  badge_image: any; // 뱃지 이미지 (require)
}

/**
 * 연속 기록 추적
 */
export interface StreakRecord {
  current_streak: number; // 현재 연속 일수
  longest_streak: number; // 최장 연속 일수
  last_consume_date: string | null; // 마지막 소비 날짜 (YYYY-MM-DD)
}

/**
 * 통계 데이터
 */
export interface Statistics {
  total_consumed: number; // 총 소비 재료 수
  total_registered: number; // 총 등록 재료 수
  total_shopping_completed: number; // 장보기 완료 횟수
  streak_record: StreakRecord; // 연속 기록
}
