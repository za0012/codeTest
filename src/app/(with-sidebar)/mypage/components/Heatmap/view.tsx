import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getHeatmapDataDaily } from "./model";
import { Skeleton } from "@/components/ui/skeleton";
import Tooltip from "@/components/ui/Tooltip";
import { createAndFillHeatmap, getColor } from "./controller";

const CELL = 12; // 원 지름 느낌
const GAP = 4; // 원 사이 간격
const STEP = CELL + GAP; // 한 칸이 차지하는 거리
const HEATMAP_WIDTH = 53 * STEP; // 53주 * 16 = 848
const HEATMAP_HEIGHT = 8 * STEP; // 7요일 * 16 = 112

function History2({ id }: { id: number }) {
  const [hovered, setHovered] = useState<{
    date: string;
    value: number;
    cx: number;
    cy: number;
  } | null>(null);

  const { data: heatmap, isLoading } = useQuery<Record<string, number>>({
    queryKey: ["heatmap"],
    queryFn: () => getHeatmapDataDaily(id),
    select: (heatmap) => createAndFillHeatmap(heatmap),
  });

  const today = new Date();
  const startDate = new Date(today.getFullYear(), today.getMonth() - 11, 1); //상황에 따라 유동적으로 길이 줄이기와 관련해 고민 해봐야 함. 안에 스크롤바를 두면 될듯 지금은 사이드바까지 침범함.
  const startDayOfWeek = startDate.getDay(); // 첫날 요일 (offset용)

  console.log(heatmap);

  if (isLoading || !heatmap) {
    return <Skeleton className="w-225 h-50" />;
  }

  return (
    <div>
      <div className="flex flex-row justify-between items-center">
        <p className="font-bold text-[#191F28] text-base tracking-tight mb-2">
          활동 히스토리
        </p>
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
      <div className="w-full rounded-2xl bg-white px-6 pt-6 pb-2 border border-[#F2F4F6]">
        {/* 2. 상단 헤더 영역 여백 및 타이포그래피 정돈 */}

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
    </div>
  );
}

export default History2;
