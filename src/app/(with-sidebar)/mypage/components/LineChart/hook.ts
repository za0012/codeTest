import { format } from "date-fns";

interface lineDataType {
  date: string;
  value: number;
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
