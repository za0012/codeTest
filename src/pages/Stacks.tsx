import { useMemo } from "react";
import { useStudy } from "../context/StudyContext";
import { ALL_TAGS, PLATFORM_CONFIG } from "../data/mockData";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Layers } from "lucide-react";

const TAG_COLORS = [
  "#7c3aed",
  "#6d28d9",
  "#8b5cf6",
  "#a78bfa",
  "#c4b5fd",
  "#0ea5e9",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#f97316",
  "#ec4899",
  "#14b8a6",
  "#64748b",
  "#84cc16",
  "#8b5cf6",
  "#06b6d4",
  "#7c3aed",
];

export function Stacks() {
  const { problems, members } = useStudy();

  // Tag stats
  const tagStats = useMemo(() => {
    return ALL_TAGS.map((tag, i) => {
      const tagProblems = problems.filter((p) => p.tags.includes(tag));
      const memberBreakdown = members
        .map((m) => ({
          name: m.name,
          emoji: m.emoji,
          count: tagProblems.filter((p) => p.memberId === m.id).length,
        }))
        .filter((x) => x.count > 0);

      return {
        tag,
        count: tagProblems.length,
        color: TAG_COLORS[i % TAG_COLORS.length],
        memberBreakdown,
        platforms: Object.keys(PLATFORM_CONFIG).reduce(
          (acc, p) => {
            acc[p] = tagProblems.filter((prob) => prob.platform === p).length;
            return acc;
          },
          {} as Record<string, number>,
        ),
      };
    })
      .filter((t) => t.count > 0)
      .sort((a, b) => b.count - a.count);
  }, [problems, members]);

  // Member tag matrix
  const memberTagMatrix = useMemo(() => {
    return members.map((m) => {
      const myProblems = problems.filter((p) => p.memberId === m.id);
      const tags = ALL_TAGS.map((tag) => ({
        tag,
        count: myProblems.filter((p) => p.tags.includes(tag)).length,
      }))
        .filter((t) => t.count > 0)
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
      return { member: m, tags, total: myProblems.length };
    });
  }, [problems, members]);

  return (
    <div className="p-8 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-gray-800" style={{ fontSize: 22, fontWeight: 700 }}>
          알고리즘 스택
        </h1>
        <p className="text-gray-400 text-sm mt-0.5">
          스터디에서 다룬 알고리즘 유형 분석
        </p>
      </div>

      {/* Tag cards grid */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {ALL_TAGS.map((tag, i) => {
          const stat = tagStats.find((t) => t.tag === tag);
          const count = stat?.count ?? 0;
          const color = TAG_COLORS[i % TAG_COLORS.length];
          return (
            <div
              key={tag}
              className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-4 transition-all hover:shadow-md hover:-translate-y-0.5 ${count === 0 ? "opacity-50" : ""}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className="text-xs px-2.5 py-1 rounded-full text-white"
                  style={{ backgroundColor: color, fontWeight: 600 }}
                >
                  {tag}
                </span>
                <span
                  className="text-lg text-gray-800"
                  style={{ fontWeight: 700 }}
                >
                  {count}
                </span>
              </div>
              <p className="text-[11px] text-gray-400">
                {count > 0
                  ? `${members.filter((m) => stat?.memberBreakdown.some((mb) => mb.name === m.name)).length}명 참여`
                  : "아직 없어요"}
              </p>
              {count > 0 && (
                <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.min((count / (tagStats[0]?.count || 1)) * 100, 100)}%`,
                      backgroundColor: color,
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-5 gap-4">
        {/* Bar chart */}
        <div className="col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2
            className="text-gray-700 mb-4"
            style={{ fontSize: 15, fontWeight: 700 }}
          >
            태그별 문제 수
          </h2>
          {tagStats.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
              <Layers size={32} className="mr-2 text-gray-300" />
              아직 데이터가 없어요
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart
                data={tagStats}
                layout="vertical"
                margin={{ top: 0, right: 20, left: 20, bottom: 0 }}
                barSize={14}
              >
                <XAxis
                  type="number"
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <YAxis
                  type="category"
                  dataKey="tag"
                  tick={{ fontSize: 11, fill: "#6b7280" }}
                  axisLine={false}
                  tickLine={false}
                  width={70}
                />
                <Tooltip
                  contentStyle={{
                    fontSize: 11,
                    borderRadius: 10,
                    border: "1px solid #f3f4f6",
                  }}
                  formatter={(v: number) => [`${v}문제`]}
                  cursor={{ fill: "#f5f3ff" }}
                />
                <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                  {tagStats.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Member breakdown */}
        <div className="col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2
            className="text-gray-700 mb-4"
            style={{ fontSize: 15, fontWeight: 700 }}
          >
            멤버별 주요 태그
          </h2>
          <div className="flex flex-col gap-4">
            {memberTagMatrix.map(({ member, tags, total }) => (
              <div key={member.id}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center text-base border border-gray-100">
                    {member.emoji}
                  </div>
                  <div>
                    <span
                      className="text-sm text-gray-700"
                      style={{ fontWeight: 600 }}
                    >
                      {member.name}
                    </span>
                    <span className="text-[11px] text-gray-400 ml-1.5">
                      총 {total}문제
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 ml-9">
                  {tags.length === 0 ? (
                    <span className="text-xs text-gray-400">아직 없어요</span>
                  ) : (
                    tags.map(({ tag, count }, i) => (
                      <span
                        key={tag}
                        className="text-[10px] px-2 py-0.5 rounded-full text-white"
                        style={{
                          backgroundColor:
                            TAG_COLORS[
                              ALL_TAGS.indexOf(tag) % TAG_COLORS.length
                            ],
                          opacity: 0.85 + i * 0.03,
                        }}
                      >
                        {tag} {count}
                      </span>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Platform × Tag matrix */}
      <div className="mt-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2
          className="text-gray-700 mb-4"
          style={{ fontSize: 15, fontWeight: 700 }}
        >
          플랫폼 × 알고리즘 분포
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th
                  className="text-left pb-2 pr-4 text-xs text-gray-400"
                  style={{ fontWeight: 600 }}
                >
                  태그
                </th>
                {Object.entries(PLATFORM_CONFIG).map(([key, { label }]) => (
                  <th
                    key={key}
                    className="text-center pb-2 px-3 text-xs text-gray-400"
                    style={{ fontWeight: 600 }}
                  >
                    {label}
                  </th>
                ))}
                <th
                  className="text-center pb-2 px-3 text-xs text-gray-400"
                  style={{ fontWeight: 600 }}
                >
                  합계
                </th>
              </tr>
            </thead>
            <tbody>
              {tagStats.map(({ tag, color, platforms, count }) => (
                <tr
                  key={tag}
                  className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                >
                  <td className="py-2 pr-4">
                    <span
                      className="text-[11px] px-2 py-0.5 rounded-full text-white"
                      style={{ backgroundColor: color, fontWeight: 500 }}
                    >
                      {tag}
                    </span>
                  </td>
                  {Object.keys(PLATFORM_CONFIG).map((p) => (
                    <td key={p} className="text-center py-2 px-3">
                      {platforms[p] > 0 ? (
                        <span
                          className="text-xs text-gray-700"
                          style={{ fontWeight: 600 }}
                        >
                          {platforms[p]}
                        </span>
                      ) : (
                        <span className="text-gray-200 text-xs">—</span>
                      )}
                    </td>
                  ))}
                  <td className="text-center py-2 px-3">
                    <span
                      className="text-xs text-[#3182f6]"
                      style={{ fontWeight: 700 }}
                    >
                      {count}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
