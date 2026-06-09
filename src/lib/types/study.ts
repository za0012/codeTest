export interface Study {
  created_at: string;
  description: string;
  emoji: string;
  id: number;
  invite_code: string;
  name: string;
  delete_scheduled_at: string | null; // 또는 Date | null
  deleted_at: string | null;
}

export interface UserProfile {
  id: number;
  user_id: string; // UUID 형태의 문자열
  name: string;
  role: string; // "스터디장" 등
  study_id: number;

  bio: string;
  blog_url: string | null; // null 허용 처리
  github_url: string | null; // null 허용 처리
  emoji: string; // "🦊"

  join_date: string; // "YYYY-MM-DD" 형태의 날짜 문자열
  last_solved_date: string; // "YYYY-MM-DD" 형태의 날짜 문자열

  favorite_tag: string; // "DP"
  tier: string; // "Gold"
  tier_bg: string; // Tailwind CSS 클래스명 등으로 추정 ("bg-yellow-50")
  tier_color: string; // Tailwind CSS 클래스명 등으로 추정 ("text-yellow-600")

  solved_count: number;
  streak: number;
  today_solved: boolean;
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
  study_members?: memberNickname;
  time_spent: number;
  difficulty: string;
  platform: string;
  url?: string;
  date: string;
  onClick: () => void;
}

// difficulty: "Medium";
// platform: "LeetCode"; 이렇게 2개 리터럴로 수정
