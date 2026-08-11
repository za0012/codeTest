import { useQuery } from "@tanstack/react-query";
import { getProblemDates } from "@/lib/api/problems";

// 히트맵과 월별 차트는 같은 원본(내가 푼 날짜 목록)을 쓰고 집계 방식만 다르다.
// 키를 ["heatmap"] / ["lineGraph"]로 나눠 두면 같은 SQL이 두 번 나가므로,
// 하나의 키로 받아 각 화면이 select로 갈라 쓴다.
//
// select는 화면마다 다르므로 인자로 받는다. 호출부에서 useCallback으로 감싸야
// 렌더마다 함수 정체성이 바뀌어 집계가 다시 도는 것을 막을 수 있다.
export const problemDatesKey = (memberId: number) =>
  ["problemDates", memberId] as const;

export function useProblemDates<T>(
  memberId: number,
  select: (dates: string[]) => T,
) {
  return useQuery({
    queryKey: problemDatesKey(memberId),
    queryFn: () => getProblemDates(memberId),
    select,
  });
}
