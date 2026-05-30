import { useQuery } from "@tanstack/react-query";
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
import { createSixMonthObject } from "./hook";
import { getLineGhDataMonth } from "./service";

function MonthlySolve({ id }: { id: number }) {
  const { data } = useQuery({
    queryKey: ["lineGraph"],
    queryFn: () => getLineGhDataMonth(id),
    select: (data) =>
      createSixMonthObject(
        Object.entries(data).map(([date, value]) => ({ date, value })),
      ),
  });

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
              width="auto"
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
