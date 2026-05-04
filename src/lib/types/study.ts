export interface Study {
  created_at: string | null;
  description: string | null;
  emoji: string | null;
  id: number | null;
  invite_code: string | null;
  name: string | null;
}

export interface UserProfile {
  user_id: string; // UUID 형식
  id: number; // 내부 식별 ID
  study_id: number; // 소속 스터디 ID
  name: string; // 사용자 이름
  role: string; // 역할 (예: "스터디장")
  bio: string; // 자기소개
  emoji: string; // 프로필 이모지
  favorite_tag: string; // 선호하는 알고리즘 태그 (예: "DP")

  // 티어 및 스타일 관련
  tier: string; // 티어 명칭 (예: "Gold")
  tier_bg: string; // Tailwind CSS 클래스 (예: "bg-yellow-50")
  tier_color: string; // Tailwind CSS 클래스 (예: "text-yellow-600")

  // 통계 및 상태
  solved_count: number; // 해결한 문제 수
  streak: number; // 스트릭 유지 일수
  today_solved: boolean; // 오늘 해결 여부

  // 날짜 관련 (ISO 8601 문자열 또는 null)
  join_date: string;
  last_solved_date: string | null;
}
