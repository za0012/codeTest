import { supabase } from "@/lib/supabase";

// 난이도 통합 매핑
const DIFFICULTY_MAP: Record<string, string> = {
  // 백준 (BOJ)
  Bronze: "아이언",
  Silver: "브론즈",
  Gold: "실버",
  Platinum: "골드",
  Diamond: "플래티넘",
  Ruby: "다이아몬드",

  // 프로그래머스 (Programmers)
  "Lv.0": "아이언",
  "Lv.1": "아이언",
  "Lv.2": "브론즈",
  "Lv.3": "실버",
  "Lv.4": "골드",
  "Lv.5": "플래티넘",

  // 리트코드 (LeetCode)
  Easy: "아이언",
  Medium: "실버",
  Hard: "골드",

  // 코드포스 (Codeforces) - 찐 매운맛 반영
  "Div.4": "아이언",
  Newbie: "브론즈", // 뉴비가 백준 실버(브론즈 티어) 수준입니다.
  Pupil: "실버", // 퓨필부터 이미 백준 골드(실버 티어)를 홥니다.
  "Div.3": "실버",
  Specialist: "골드", // 스페셜리스트면 백준 플래티넘(골드 티어) 수준입니다.
  "Div.2": "골드",
  Expert: "플래티넘", // 엑스퍼트(블루)는 백준 다이아(플래티넘 티어)급 천상계입니다.
  "Candidate Master": "플래티넘",
  "Div.1": "플래티넘",
  Master: "다이아몬드", // 마스터 이상은 백준 루비~측정불가(다이아몬드 티어)입니다.
  Grandmaster: "다이아몬드",

  // SWEA (Samsung Expert Academy)
  D1: "아이언",
  D2: "아이언",
  D3: "브론즈",
  D4: "실버",
  D5: "골드",
  D6: "플래티넘",
  D7: "다이아몬드",
  D8: "다이아몬드",
};

export const getDifficultyStatsCount = async (memberId: number) => {
  const { data, error } = await supabase
    .from("problems")
    .select("difficulty")
    .eq("member_id", memberId);
  if (error) throw error;

  const counts = data.reduce(
    (acc, { difficulty }) => {
      const unified = DIFFICULTY_MAP[difficulty] ?? difficulty;
      acc[unified] = (acc[unified] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  // recharts용 배열로 변환
  return Object.entries(counts).map(([difficulty, count]) => ({
    difficulty,
    count,
  }));
};
