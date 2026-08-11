import { format } from "date-fns";

// 날짜 문자열 목록을 { 'YYYY-MM-DD': 개수 }로 집계한다.
// DB의 date 컬럼이 이미 'YYYY-MM-DD'라 Date로 변환하지 않고 그대로 키로 쓴다.
export function countByDate(dates: string[]) {
  return dates.reduce(
    (acc, date) => {
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );
}

export function createAndFillHeatmap(
  mySolves: Record<string, number>,
  today = new Date(),
) {
  const yearSolves: Record<string, number> = {};
  const start = new Date(today.getFullYear(), today.getMonth() - 11, 1);
  const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const cur = new Date(start);
  while (cur <= end) {
    // toISOString()은 UTC로 변환돼 KST에서 하루가 밀리고 말일이 누락된다.
    // DB의 date(YYYY-MM-DD)와 맞추려면 로컬 기준으로 포맷해야 한다.
    const key = format(cur, "yyyy-MM-dd");
    yearSolves[key] = mySolves[key] ?? 0;
    cur.setDate(cur.getDate() + 1);
  }
  return yearSolves;
}

export function getColor(value: number) {
  if (value === 0) return "#F2F4F6";
  if (value === 1 || value === 2) return "#D4E4FF";
  if (value === 3) return "#689FFF";
  else return "#1B64FA";
}
