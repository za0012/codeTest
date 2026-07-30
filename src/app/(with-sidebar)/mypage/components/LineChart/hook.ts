import { format } from "date-fns";

interface lineDataType {
  date: string;
  value: number;
}

export function createSixMonthObject(lineData: lineDataType[] | undefined) {
  const result: lineDataType[] = [];
  const today = new Date();
  const startMonth = new Date(today.getFullYear(), today.getMonth() - 5);
  const endMonth = new Date(today.getFullYear(), today.getMonth());
  const curMonth = new Date(startMonth);

  while (curMonth <= endMonth) {
    // const key = curMonth.toISOString().slice(0, 7);
    const key = format(curMonth, "yyyy-MM");
    const lineValue = lineData?.find((item) => item.date === key)?.value ?? 0;
    const newKey = new Date(key);
    const changeKey =
      newKey.getFullYear() === today.getFullYear()
        ? `${newKey.getMonth() + 1}월`
        : `${newKey.getFullYear()}년 ${newKey.getMonth() + 1}월`;
    result.push({ date: changeKey, value: lineValue });

    curMonth.setMonth(curMonth.getMonth() + 1);
  }

  return result;
}
