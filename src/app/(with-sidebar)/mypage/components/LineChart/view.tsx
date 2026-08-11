import { useCallback } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CustomTooltip } from "@/components/ChartToolTip";
import { useProblemDates } from "@/lib/query/useProblemDates";
import { countByMonth, createSixMonthObject } from "./hook";

function MonthlySolve({ id }: { id: number }) {
  // 원본(날짜 목록)은 히트맵과 같은 키로 한 번만 받고, 집계만 여기서 한다.
  const { data } = useProblemDates(
    id,
    useCallback(
      (dates: string[]) => createSixMonthObject(countByMonth(dates)),
      [],
    ),
  );

  return (
    <div>
      <p className="font-bold text-[#191F28] text-base tracking-tight mb-2">
        월별 풀이
      </p>
      <div className="w-full max-w-108 aspect-[1.618] bg-white rounded-3xl py-5 px-4 border border-[#F2F4F6] min-w-0">
        <ResponsiveContainer>
          <AreaChart
            data={data}
            margin={{
              top: 20,
              right: 10,
              left: 15,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1B64FA" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#1B64FA" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#f3f4f6" vertical={false} />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9ca3af", fontSize: 11 }}
              interval={0} // ⭐ 핵심: 0으로 설정하면 recharts가 라벨을 6개 모두 보여줌.
              dy={10}
            />
            <YAxis
              width={32}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9ca3af", fontSize: 11 }}
            />
            <Tooltip content={CustomTooltip} />

            <Area
              type="monotone"
              dataKey="value"
              stroke="#1B64FA"
              strokeWidth={2}
              fill="url(#chartGradient)"
              dot={{ r: 3, fill: "#1B64FA" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default MonthlySolve;
