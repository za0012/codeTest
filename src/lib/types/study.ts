export interface Study {
  created_at: string;
  description: string;
  emoji: string;
  id: number;
  invite_code: string;
  name: string;
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

export interface memberNickname {
  name: string;
  emoji: string;
}

export interface Problem {
  created_at: string;
  date: string;
  difficulty: string;
  id: number;
  member_id: number;
  memo: string;
  platform: string;
  solution: string;
  study_id: number;
  study_members: memberNickname;
  tags: string[];
  time_spent: number;
  title: string;
  url: string;
}

export interface ProblemCardType {
  id: number;
  title: string;
  tags: string[];
  study_members: memberNickname;
  time_spent: number;
  difficulty: string;
  platform: string;
  date: string;
  onClick: () => void;
}

// difficulty: "Medium";
// platform: "LeetCode"; 이렇게 2개 리터럴로 수정
