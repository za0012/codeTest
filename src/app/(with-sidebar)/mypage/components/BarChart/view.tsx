import { useQuery } from "@tanstack/react-query";
import {
  Bar,
  BarChart,
  type BarShapeProps,
  CartesianGrid,
  Label,
  LabelList,
  type LabelProps,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CustomTooltip } from "@/components/ChartToolTip";
import { getDifficultyStatsCount } from "./service";

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7300",
  "#387cff",
  "#ff3838",
];

const getPath = (x: number, y: number, width: number, height: number) => {
  return `M${x},${y + height}C${x + width / 3},${y + height} ${x + width / 2},${y + height / 3}
  ${x + width / 2}, ${y}
  C${x + width / 2},${y + height / 3} ${x + (2 * width) / 3},${y + height} ${x + width}, ${y + height}
  Z`;
};

const CustomColorLabel = (props: LabelProps) => {
  const fill = COLORS[(props.index ?? 0) % COLORS.length];
  return <Label {...props} fill={fill} />;
};

const TriangleBar = (props: BarShapeProps) => {
  const { x, y, width, height, index } = props;

  const color = COLORS[index % COLORS.length];

  return (
    <path
      strokeWidth={props.isActive ? 5 : 0}
      d={getPath(Number(x), Number(y), Number(width), Number(height))}
      stroke={color}
      fill={color}
      style={{
        transition: "stroke-width 0.3s ease-out",
      }}
    />
  );
};

function DifficultCount({ id }: { id: number }) {
  const { data } = useQuery({
    queryKey: ["barChart"],
    queryFn: () => getDifficultyStatsCount(id),
  });
  console.log(data);
  return (
    <div>
      <p className="font-bold text-[#191F28] text-base tracking-tight mb-2">
        난이도별 풀이
      </p>
      <div className="w-full max-w-108 aspect-[1.618] bg-white rounded-3xl py-5 px-4 border border-[#F2F4F6]">
        <ResponsiveContainer>
          <BarChart data={data}>
            <CartesianGrid stroke="#f3f4f6" vertical={false} />
            <XAxis
              dataKey="difficulty"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9ca3af", fontSize: 11 }}
            />
            <YAxis
              width="auto"
              dataKey="count"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9ca3af", fontSize: 11 }}
            />
            <Tooltip content={CustomTooltip} />
            <Bar dataKey="count" fill="#1B64FA" radius={[4, 4, 0, 0]} />
            {/* <Bar
              dataKey="uv"
              shape={TriangleBar}
              activeBar
              radius={[10, 10, 0, 0]}
            >
              <LabelList content={CustomColorLabel} position="top" />
            </Bar> */}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default DifficultCount;
