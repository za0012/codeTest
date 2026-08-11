import { format } from "date-fns";

interface lineDataType {
  date: string;
  value: number;
}

// 날짜 문자열 목록을 [{ date: 'YYYY-MM', value: 개수 }]로 집계한다.
// 'YYYY-MM-DD'에서 앞 7자를 자르면 되므로 Date로 변환했다 되돌리지 않는다.
export function countByMonth(dates: string[]): lineDataType[] {
  const counts = dates.reduce(
    (acc, date) => {
      const month = date.slice(0, 7);
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );
  return Object.entries(counts).map(([date, value]) => ({ date, value }));
}

export function createSixMonthObject(
  lineData: lineDataType[] | undefined,
  today = new Date(),
) {
  const result: lineDataType[] = [];
  // 기준월(0)에서 5개월 전까지, 마지막 항목이 기준월이 되도록 정확히 6개를 만든다.
  const startMonth = new Date(today.getFullYear(), today.getMonth() - 5, 1);

  for (let i = 0; i < 6; i++) {
    const cur = new Date(
      startMonth.getFullYear(),
      startMonth.getMonth() + i,
      1,
    );
    // toISOString()/new Date(key)의 UTC 변환을 피하려고 cur을 그대로 쓰고 로컬 기준으로 포맷한다.
    const key = format(cur, "yyyy-MM");
    const value = lineData?.find((item) => item.date === key)?.value ?? 0;
    const label =
      cur.getFullYear() === today.getFullYear()
        ? `${cur.getMonth() + 1}월`
        : `${cur.getFullYear()}년 ${cur.getMonth() + 1}월`;
    result.push({ date: label, value });
  }

  return result;
}
