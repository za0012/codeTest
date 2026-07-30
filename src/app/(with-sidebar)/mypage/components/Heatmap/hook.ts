import { format } from "date-fns";

export function createAndFillHeatmap(mySolves: Record<string, number>) {
  const yearSolves: Record<string, number> = {}; //Record 가 무엇인지 알아보기
  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth() - 11, 1);
  const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const cur = new Date(start);
  while (cur <= end) {
    // const key = cur.toISOString().slice(0, 10);
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
