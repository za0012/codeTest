import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Tooltip from "@/components/ui/Tooltip";
import { getHeatmapData } from "@/lib/api/mypage";

const CELL = 12;
const GAP = 4;
const STEP = CELL + GAP;

// 범위 내 모든 날짜를 0으로 채우고, 실제 데이터로 덮어씀
// 대충 이해해봤는데, result를 반환함... 이건 객체임...
// 오늘 변수 선언 후 가져옴
// 6개월 전 날짜를 가져옴
// end에는 이번달 마지막일을 가져옴 (일쪽에 0을 넣으면 마지막날짜가 되나봄)
// cur로는 시작날짜를 넣음
// while로 돌면서 cur가 end가 될 때까지 돎... cur이 end가 될 때까지 돌기 때문에 cur부터 end까지의 개수만큼 생김.
// key라는 변수에는 날짜를 담아서 base에 해당 날짜가 있으면 값으로 그걸 넣고 없으면 0을 넣음...
// result key는 어떻게 할당하고 value는 어떻게 할당하는지 모루겠으ㅜㅁ
function fillActivityData(base: Record<string, number>) {
  const result: Record<string, number> = {}; //Record 가 무엇인지 알아보기
  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth() - 11, 1);
  const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  console.log("today ||", today);
  console.log(" today.getMonth() ||", today.getMonth());
  console.log("startdate ||", start);
  console.log("endDate ||", end);

  const cur = new Date(start);
  console.log("cur ||", cur);
  console.log("cur ||", cur.getDate());
  console.log("---------------------------------------");
  while (cur <= end) {
    const key = cur.toISOString().slice(0, 10);
    result[key] = base[key] ?? 0;
    cur.setDate(cur.getDate() + 1);
  }
  return result;
}

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
  const { data: heatmap } = useQuery({
    queryKey: ["heatmap"],
    queryFn: () => getHeatmapData(id),
  });

  const activityData = fillActivityData({
    // 2025년 6월 (시작)
    "2025-06-03": 1,
    "2025-06-04": 3,
    "2025-06-10": 2,
    "2025-06-11": 5,
    "2025-06-17": 4,
    "2025-06-18": 1,
    "2025-06-24": 2,
    "2025-06-25": 3,

    // 2025년 7월 (꾸준한 참여기)
    "2025-07-01": 5,
    "2025-07-02": 4,
    "2025-07-08": 2,
    "2025-07-15": 1,
    "2025-07-22": 3,
    "2025-07-23": 4,
    "2025-07-29": 5,
    "2025-07-30": 2,

    // 2025년 8월 (여름 폭풍 성장기 - 연속 활동)
    "2025-08-04": 2,
    "2025-08-05": 5,
    "2025-08-06": 4,
    "2025-08-07": 3,
    "2025-08-12": 1,
    "2025-08-13": 2,
    "2025-08-19": 5,
    "2025-08-20": 4,
    "2025-08-25": 3,
    "2025-08-26": 2,
    "2025-08-27": 1,

    // 2025년 9월
    "2025-09-02": 4,
    "2025-09-03": 3,
    "2025-09-09": 1,
    "2025-09-16": 5,
    "2025-09-17": 2,
    "2025-09-23": 3,
    "2025-09-24": 4,
    "2025-09-30": 1,

    // 2025년 10월 (주말에도 반짝 활동)
    "2025-10-04": 2,
    "2025-10-07": 5,
    "2025-10-08": 3,
    "2025-10-14": 1,
    "2025-10-15": 4,
    "2025-10-21": 2,
    "2025-10-22": 5,
    "2025-10-26": 3,

    // 2025년 11월
    "2025-11-04": 1,
    "2025-11-05": 3,
    "2025-11-06": 2,
    "2025-11-11": 4,
    "2025-11-12": 2,
    "2025-11-18": 1,
    "2025-11-19": 5,
    "2025-11-20": 3,
    "2025-11-25": 2,
    "2025-11-26": 4,

    // 2025년 12월 (연말 스퍼트)
    "2025-12-02": 1,
    "2025-12-03": 3,
    "2025-12-09": 2,
    "2025-12-10": 4,
    "2025-12-16": 1,
    "2025-12-17": 5,
    "2025-12-23": 2,
    "2025-12-24": 3,
    "2025-12-30": 1,
    "2025-12-31": 5,

    // 2026년 1월 (새해 다짐 효과)
    "2026-01-01": 4,
    "2026-01-02": 3,
    "2026-01-06": 2,
    "2026-01-07": 4,
    "2026-01-13": 1,
    "2026-01-14": 3,
    "2026-01-20": 5,
    "2026-01-21": 2,
    "2026-01-27": 1,
    "2026-01-28": 4,

    // 2026년 2월
    "2026-02-03": 3,
    "2026-02-10": 2,
    "2026-02-17": 4,
    "2026-02-24": 1,

    // 2026년 3월
    "2026-03-03": 2,
    "2026-03-04": 5,
    "2026-03-10": 3,
    "2026-03-11": 4,
    "2026-03-17": 1,
    "2026-03-18": 5,
    "2026-03-24": 2,
    "2026-03-25": 3,
    "2026-03-31": 4,

    // 2026년 4월 (가장 활발한 시기)
    "2026-04-01": 3,
    "2026-04-02": 5,
    "2026-04-03": 4,
    "2026-04-07": 2,
    "2026-04-08": 5,
    "2026-04-09": 3,
    "2026-04-10": 4,
    "2026-04-14": 5,
    "2026-04-21": 2,
    "2026-04-22": 4,
    "2026-04-28": 1,
    "2026-04-29": 3,

    // 2026년 5월 (최근 현재 진행형)
    "2026-05-01": 2,
    "2026-05-05": 4,
    "2026-05-08": 3,
    "2026-05-12": 5,
    "2026-05-15": 2,
    "2026-05-19": 4,
    "2026-05-22": 3,
    "2026-05-26": 5,
  });

  const today = new Date();
  const startDate = new Date(today.getFullYear(), today.getMonth() - 11, 1); //상황에 따라 유동적으로 길이 줄이기와 관련해 고민 해봐야 함. 안에 스크롤바를 두면 될듯 지금은 사이드바까지 침범함.
  const startDayOfWeek = startDate.getDay(); // 첫날 요일 (offset용)

  console.log(heatmap);
  return (
    // 1. 과한 shadow를 제거하고 토스 특유의 얇고 고급스러운 border 구조로 변경
    <div className="w-full rounded-2xl bg-white p-6 border border-[#F2F4F6]">
      {/* 2. 상단 헤더 영역 여백 및 타이포그래피 정돈 */}
      <div className="flex flex-row justify-between items-center mb-6">
        <p className="font-bold text-[#191F28] text-base tracking-tight">
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
      <div className="flex justify-center items-center w-full overflow-x-auto py-1">
        <div className="relative overflow-x-auto">
          <svg
            width={53 * STEP}
            height={7 * STEP}
            className="block pointer-events-none"
          >
            <title>활동 히스토리 히트맵</title>
            {Object.entries(activityData).map(([date, value]) => {
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
          {Object.entries(activityData).map(([date, value]) => {
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
                className="absolute rounded-full bg-transparent p-0 cursor-pointer"
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
                position={hovered.cy >= 72 ? "top" : "bottom"}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default History;
