import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Tooltip from "@/components/ui/Tooltip";
import { getHeatmapData } from "@/lib/api/mypage";
import { Skeleton } from "@/components/ui/skeleton";

const CELL = 12; // 원 지름 느낌
const GAP = 4; // 원 사이 간격
const STEP = CELL + GAP; // 한 칸이 차지하는 거리
const HEATMAP_WIDTH = 53 * STEP; // 53주 * 16 = 848
const HEATMAP_HEIGHT = 8 * STEP; // 7요일 * 16 = 112

// 범위 내 모든 날짜를 0으로 채우고, 실제 데이터로 덮어씀
// 대충 이해해봤는데, result를 반환함... 이건 객체임...
// 오늘 변수 선언 후 가져옴
// 6개월 전 날짜를 가져옴
// end에는 이번달 마지막일을 가져옴 (일쪽에 0을 넣으면 마지막날짜가 되나봄)
// cur로는 시작날짜를 넣음
// while로 돌면서 cur가 end가 될 때까지 돎... cur이 end가 될 때까지 돌기 때문에 cur부터 end까지의 개수만큼 생김.
// key라는 변수에는 날짜를 담아서 base에 해당 날짜가 있으면 값으로 그걸 넣고 없으면 0을 넣음...
// result[key]는 "2025-05-28"이라는 키를 생성해서 base[key]에 값이 있으면 해당 값을, 없으면 0을 넣는 것.
// 그리고 cur.setDate(cur.getDate() + 1)을 해서 지금 날짜에 + 1을 함으로써 날짜를 1일 더 추가하는...

function fillActivityData(base: Record<string, number>) {
  const result: Record<string, number> = {}; //Record 가 무엇인지 알아보기
  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth() - 11, 1);
  const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  // console.log("today ||", today);
  // console.log(" today.getMonth() ||", today.getMonth());
  // console.log("startdate ||", start);
  // console.log("endDate ||", end);

  const cur = new Date(start);
  // console.log("cur ||", cur);
  // console.log("cur ||", cur.getDate());
  // console.log("---------------------------------------");
  while (cur <= end) {
    const key = cur.toISOString().slice(0, 10);
    result[key] = base[key] ?? 0;
    cur.setDate(cur.getDate() + 1);
  }
  return result;
}

// 이건 그냥 value에 따라서 fill 색 달라지는 거
function getColor(value: number) {
  if (value === 0) return "#F2F4F6";
  if (value === 1 || value === 2) return "#D4E4FF";
  if (value === 3) return "#689FFF";
  else return "#1B64FA";
}

function History({ id }: { id: number }) {
  const [hovered, setHovered] = useState<{
    date: string;
    value: number;
    cx: number;
    cy: number;
  } | null>(null);

  const { data: heatmap, isLoading } = useQuery<Record<string, number>>({
    queryKey: ["heatmap"],
    queryFn: () => getHeatmapData(id),
    select: (heatmap) => fillActivityData(heatmap),
  });

  const today = new Date();
  const startDate = new Date(today.getFullYear(), today.getMonth() - 11, 1); //상황에 따라 유동적으로 길이 줄이기와 관련해 고민 해봐야 함. 안에 스크롤바를 두면 될듯 지금은 사이드바까지 침범함.
  const startDayOfWeek = startDate.getDay(); // 첫날 요일 (offset용)

  console.log(heatmap);

  if (isLoading || !heatmap) {
    return <Skeleton className="w-96 h-36" />;
  }

  return (
    // 1. 과한 shadow를 제거하고 토스 특유의 얇고 고급스러운 border 구조로 변경
    <div className="w-full rounded-2xl bg-white px-6 pt-6 pb-2 border border-[#F2F4F6]">
      {/* 2. 상단 헤더 영역 여백 및 타이포그래피 정돈 */}
      <div className="flex flex-row justify-between items-center">
        <p className="font-bold text-[#191F28] text-base tracking-tight mb-2">
          활동 히스토리
        </p>

        {/* 범례 영역의 원 색상도 토스 톤앤매너에 맞게 깔끔하게 통일 */}
        <div className="flex flex-row items-center text-[13px] font-medium text-[#8B95A1] gap-2">
          <span>적음</span>
          <div className="flex flex-row items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-full bg-[#F2F4F6]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#D4E4FF]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#689FFF]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#1B64FA]" />
          </div>
          <span>많음</span>
        </div>
      </div>

      {/* 3. 히트맵 영역: 스크롤바를 숨기고 모바일/데스크톱 모두에서 완벽히 중앙에 배치 */}
      <div className="w-full overflow-x-auto py-1">
        <div
          className="mx-auto box-content"
          style={{
            width: HEATMAP_WIDTH,
            height: HEATMAP_HEIGHT,
          }}
        >
          <div
            className="relative"
            style={{ width: HEATMAP_WIDTH, height: HEATMAP_HEIGHT }}
          >
            <svg
              width={HEATMAP_WIDTH}
              height={HEATMAP_HEIGHT}
              className="block pointer-events-none"
            >
              <title>활동 히스토리 히트맵</title>
              {Object.entries(heatmap).map(([date, value]) => {
                const dateObj = new Date(date);
                const dayOfWeek = dateObj.getDay();
                const diffDays = Math.floor(
                  (dateObj.getTime() - startDate.getTime()) / 86400000,
                );
                const weekIndex = Math.floor((diffDays + startDayOfWeek) / 7);

                const cx = weekIndex * STEP + STEP / 2;
                const cy = dayOfWeek * STEP + STEP / 2;

                return (
                  <circle
                    key={date}
                    cx={cx}
                    cy={cy}
                    r={CELL / 2}
                    fill={getColor(value)}
                  />
                );
              })}
            </svg>
            {Object.entries(heatmap).map(([date, value]) => {
              const dateObj = new Date(date);
              const dayOfWeek = dateObj.getDay();
              const diffDays = Math.floor(
                (dateObj.getTime() - startDate.getTime()) / 86400000,
              );
              const weekIndex = Math.floor((diffDays + startDayOfWeek) / 7);
              const cx = weekIndex * STEP + STEP / 2;
              const cy = dayOfWeek * STEP + STEP / 2;

              return (
                <button
                  //버튼으로 한 이유... 우선 아래에 있는 onMouse이벤트를 circle같은 정적인 svg도형에 넣으면 접근성 규칙에 걸린다.
                  // biome측에서 button에 넣는 것이 좋다고 하여 button안에 넣게 되었다. 구조는 svg위에 button이 올라가있는 구조이다.
                  // 기존에 hover시 툴팁이 굉장히 두꺼워지고 테두리도 블러처리된 것처럼 되었었는데
                  // 이는 hovered && <foreignObject />가 map안에 있어서 hover한 번에 툴팁이 날짜 개수만큼 중복 렌더링 되어서 일어난 것이었다.
                  // 같은 자리에 여러 개가 겹쳐서... 그렇게 보이는 것이었다.
                  // 이러한 부분을 해결하기 위해 svg위에 투명한 버튼을 올려서 해결~

                  key={`${date}-hit-area`}
                  type="button"
                  aria-label={`${date}: ${value}문제`}
                  onMouseEnter={() => setHovered({ date, value, cx, cy })}
                  onMouseLeave={() => setHovered(null)}
                  className="absolute cursor-pointer appearance-none rounded-full border-0 bg-transparent p-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B64FA]"
                  style={{
                    left: cx - CELL / 2,
                    top: cy - CELL / 2,
                    width: CELL,
                    height: CELL,
                  }}
                />
              );
            })}
            {hovered && (
              <div
                className="pointer-events-none absolute z-50"
                style={{
                  left: hovered.cx,
                  top: hovered.cy + CELL / 2,
                }}
              >
                <Tooltip
                  message={`${hovered.date}: ${hovered.value}문제`}
                  position={
                    hovered.cx < 72
                      ? "right"
                      : hovered.cx >= HEATMAP_WIDTH - 72
                        ? "left"
                        : hovered.cy >= 72
                          ? "top"
                          : "bottom"
                  }
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default History;
