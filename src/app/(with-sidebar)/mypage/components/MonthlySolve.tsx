import { useQuery } from "@tanstack/react-query";
import {
  type TooltipContentProps,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Area,
  ResponsiveContainer,
  AreaChart,
} from "recharts";
import { getLineGhDataMonth } from "@/lib/api/mypage";

interface lineDataType {
  date: string;
  value: number;
}

function createSixMonth(lineData: any[] | undefined) {
  const result: lineDataType[] = [];
  const today = new Date();
  const startMonth = new Date(today.getFullYear(), today.getMonth() - 4);
  const endMonth = new Date(today.getFullYear(), today.getMonth() + 1);
  const curMonth = new Date(startMonth);

  while (curMonth <= endMonth) {
    const key = curMonth.toISOString().slice(0, 7);
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

function MonthlySolve({ id }: { id: number }) {
  const { data } = useQuery({
    queryKey: ["linegh"],
    queryFn: () => getLineGhDataMonth(id),
    select: (data) =>
      createSixMonth(
        Object.entries(data).map(([date, value]) => ({ date, value })),
      ),
  });

  const CustomTooltip = ({ active, payload, label }: TooltipContentProps) => {
    const firstPayload = payload?.[0];
    const isVisible = active && firstPayload != null;

    if (!isVisible) return null; // 불필요한 렌더링 방지를 위해 null 반환 처리

    return (
      <div
        className="bg-white rounded-2xl px-4 py-3 border-0"
        style={{
          boxShadow:
            "0px 8px 24px rgba(0, 0, 0, 0.06), 0px 0px 1px rgba(0, 0, 0, 0.08)",
        }}
      >
        <div className="flex flex-col gap-1">
          <p className="text-[11px] font-medium text-[#8B95A1] tracking-tight">
            {label}
          </p>
          <p className="text-[14px] font-bold text-[#191F28] tracking-tight">
            <span className="text-[#1B64FA] mr-0.5">{firstPayload.value}</span>
            문제 풀이
          </p>
        </div>
      </div>
    );
  };

  console.log(data);

  return (
    <div>
      <p className="font-bold text-[#191F28] text-base tracking-tight mb-6">
        월별 풀이
      </p>

      {/* 너비를 350px에서 420px로 살짝 늘려 6개 항목이 들어갈 공간을 확보했습니다 */}
      <div className="w-full max-w-108 aspect-[1.618] bg-white rounded-3xl py-5 px-4 border border-[#F2F4F6]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -35, bottom: 0 }}
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
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9ca3af", fontSize: 11 }}
            />
            <Tooltip cursor={false} content={CustomTooltip} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#1B64FA"
              strokeWidth={3}
              fill="url(#chartGradient)"
              dot={{
                r: 4,
                fill: "#1B64FA",
                stroke: "#ffffff",
                strokeWidth: 2,
              }}
              activeDot={{
                r: 6,
                fill: "#1B64FA",
                stroke: "#ffffff",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
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
            dot={{ r: 3, fill: "#1B64FA" }}
          />
        </AreaChart>
      </div>
    </div>
  );
}

export default MonthlySolve;
