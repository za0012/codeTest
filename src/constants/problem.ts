export const PLATFORM_TAGS = {
  // 1. 백준: 칙칙한 네이비 삭제! 아주 밝고 선명한 스카이 블루 (Pocari Blue)
  백준: {
    bg: "#E0F2FE", // 매우 밝은 하늘색
    text: "#0EA5E9", // 채도 높은 사이언 블루
  },
  // 2. 프로그래머스: 형광빛 도는 민트 (Spring Green)
  프로그래머스: {
    bg: "#DCFCE7",
    text: "#22C55E",
  },
  // 3. LeetCode: 쨍한 망고 옐로우 (Bright Amber)
  LeetCode: {
    bg: "#FEF3C7",
    text: "#F59E0B",
  },
  // 4. Codeforces: 화사한 라벤더 퍼플 (Electric Violet)
  Codeforces: {
    bg: "#F5F3FF",
    text: "#8B5CF6",
  },
  // 5. SWEA: 팝한 느낌의 핫핑크/로즈 (Vibrant Pink)
  SWEA: {
    bg: "#FFF1F2",
    text: "#FB7185",
  },
} as const;

export const DIFFICULT_TAGS = {
  백준: ["Bronze", "Silver", "Gold", "Platinum", "Diamond", "Ruby"],

  프로그래머스: ["Lv.0", "Lv.1", "Lv.2", "Lv.3", "Lv.4", "Lv.5"],

  LeetCode: ["Easy", "Medium", "Hard"],

  Codeforces: [
    "Newbie",
    "Pupil",
    "Specialist",
    "Expert",
    "Candidate Master",
    "Master",
    "International Master", // [추가] Master와 Grandmaster 사이 등급
    "Grandmaster",
    "International Grandmaster", // [추가] 천상계 등급 1
    "Legendary Grandmaster", // [추가] 코드포스 최고 존엄 등급 (적색/흑색)
    "Headquarters", // [추가] 간혹 관리자/출제자 계정 난이도로 잡히는 태그
  ],

  SWEA: ["D1", "D2", "D3", "D4", "D5", "D6", "D7"], // [수정] 공식 최고 등급은 D7(혹은 D6)까지입니다.
} as const;

export const ALGORITHM_TAGS = [
  "all",
  "DP",
  "BFS",
  "DFS",
  "그리디",
  "정렬",
  "이분탐색",
  "그래프",
  "문자열",
  "스택/큐",
  "완전탐색",
  "투포인터",
  "해시맵",
  "수학",
  "시뮬레이션",
  "트리",
  "입출력",
  "다익스트라",
]; // as const 를 붙이기 위해서는 problems page의 71번줄을 수정해야함...

export const PROBLEM_TAGS = [] as const;

// 타입 추출 (TypeScript 에러 방지용)
export type AlgorithmTag = (typeof ALGORITHM_TAGS)[number];
export type PlatformType = keyof typeof DIFFICULT_TAGS;
