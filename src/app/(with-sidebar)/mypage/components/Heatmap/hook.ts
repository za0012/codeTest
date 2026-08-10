import { format } from "date-fns";

export function createAndFillHeatmap(
  mySolves: Record<string, number>,
  today = new Date(),
) {
  const yearSolves: Record<string, number> = {}; //Record 가 무엇인지 알아보기
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
