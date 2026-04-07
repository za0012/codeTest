import { useMemo, useState } from "react";
import { useStudy } from "../../context/StudyContext";
import {
  PLATFORM_CONFIG,
  DIFFICULTY_CONFIG,
  getDayActivity,
} from "../../data/mockData";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  AreaChart,
  Area,
  CartesianGrid,
} from "recharts";
import {
  Star,
  Edit3,
  Check,
  X,
  StickyNote,
  ExternalLink,
  Clock,
} from "lucide-react";

const TODAY_DATE = new Date(2026, 3, 6);

function getDateStr(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// Generate past 20 weeks of dates
function generateHeatmapWeeks(memberId: number, realProblemDates: string[]) {
  const today = new Date(TODAY_DATE);
  const dayOfWeek = today.getDay(); // 0=Sun
  // Align to Monday
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));

  const weeks: { date: string; count: number }[][] = [];
  for (let w = 19; w >= 0; w--) {
    const week: { date: string; count: number }[] = [];
    for (let d = 0; d < 7; d++) {
      const day = new Date(monday);
      day.setDate(monday.getDate() - w * 7 + d);
      if (day > today) {
        week.push({ date: "", count: -1 });
        continue;
      }
      const dateStr = getDateStr(day);
      const realCount = realProblemDates.filter((ds) => ds === dateStr).length;
      const fakeCount = realCount > 0 ? 0 : getDayActivity(dateStr, memberId);
      week.push({ date: dateStr, count: realCount + fakeCount });
    }
    weeks.push(week);
  }
  return weeks;
}

function heatmapColor(count: number) {
  if (count < 0) return "transparent";
  if (count === 0) return "#f3f4f6";
  if (count === 1) return "#ddd6fe";
  if (count === 2) return "#a78bfa";
  return "#7c3aed";
}

const DAY_LABELS = ["월", "화", "수", "목", "금", "토", "일"];

export function MyPage() {
  const { problems, members, currentUserId } = useStudy();
  const me = members.find((m) => m.id === currentUserId)!;

  const [editMode, setEditMode] = useState(false);
  const [bio, setBio] = useState(me.bio);
  const [tempBio, setTempBio] = useState(me.bio);

  const myProblems = useMemo(
    () =>
      problems
        .filter((p) => p.memberId === currentUserId)
        .sort((a, b) => b.date.localeCompare(a.date)),
    [problems, currentUserId],
  );

  const heatmapWeeks = useMemo(
    () =>
      generateHeatmapWeeks(
        currentUserId,
        myProblems.map((p) => p.date),
      ),
    [myProblems, currentUserId],
  );

  // Platform distribution
  const platformData = useMemo(
    () =>
      Object.entries(PLATFORM_CONFIG)
        .map(([key, { label, color }]) => ({
          name: label,
          value: myProblems.filter((p) => p.platform === key).length,
          color,
        }))
        .filter((d) => d.value > 0),
    [myProblems],
  );

  // Difficulty distribution
  const difficultyData = useMemo(() => {
    const counts: Record<string, number> = {};
    myProblems.forEach((p) => {
      counts[p.difficulty] = (counts[p.difficulty] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [myProblems]);

  // Monthly trend (past 4 months)
  const monthlyTrend = useMemo(() => {
    const months: Record<string, number> = {};
    const today = new Date(TODAY_DATE);
    for (let i = 3; i >= 0; i--) {
      const d = new Date(today);
      d.setMonth(d.getMonth() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      months[key] = 0;
    }
    myProblems.forEach((p) => {
      const key = p.date.slice(0, 7);
      if (key in months) months[key] = (months[key] || 0) + 1;
    });
    return Object.entries(months).map(([key, count]) => ({
      name: `${parseInt(key.split("-")[1])}월`,
      count,
    }));
  }, [myProblems]);

  const totalSolved = myProblems.length;
  const activeDays = heatmapWeeks
    .flat()
    .filter((d) => d.count > 0 && d.date).length;

  const handleSaveBio = () => {
    setBio(tempBio);
    setEditMode(false);
  };

  const colorMap: Record<string, string> = {
    Bronze: "#d97706",
    Silver: "#94a3b8",
    Gold: "#ca8a04",
    Platinum: "#0891b2",
    Diamond: "#4f46e5",
    Ruby: "#e11d48",
    Easy: "#10b981",
    Medium: "#f59e0b",
    Hard: "#ef4444",
    "Lv.1": "#10b981",
    "Lv.2": "#0ea5e9",
    "Lv.3": "#7c3aed",
    "Lv.4": "#f97316",
    "Lv.5": "#ef4444",
  };

  return (
    <div className="p-8 min-h-screen">
      <div className="mb-6">
        <h1 className="text-gray-800" style={{ fontSize: 22, fontWeight: 700 }}>
          마이페이지
        </h1>
        <p className="text-gray-400 text-sm mt-0.5">
          나의 스터디 현황을 확인해요
        </p>
      </div>

      {/* Profile + Stats */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        {/* Profile card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-16 h-16 rounded-2xl bg-violet-50 flex items-center justify-center text-3xl border-2 border-violet-100">
              {me.emoji}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2
                  className="text-gray-800"
                  style={{ fontSize: 17, fontWeight: 700 }}
                >
                  {me.name}
                </h2>
                <span className="text-[10px] px-2 py-0.5 bg-violet-600 text-white rounded-full">
                  {me.role}
                </span>
              </div>
              <span
                className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${me.tierBg} ${me.tierColor}`}
                style={{ fontWeight: 600 }}
              >
                🏆 {me.tier}
              </span>
            </div>
          </div>

          {editMode ? (
            <div>
              <textarea
                value={tempBio}
                onChange={(e) => setTempBio(e.target.value)}
                rows={2}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-violet-300 resize-none mb-2"
              />
              <div className="flex gap-1.5">
                <button
                  onClick={handleSaveBio}
                  className="flex-1 flex items-center justify-center gap-1 bg-violet-600 text-white text-xs py-1.5 rounded-lg hover:bg-violet-700 transition-colors"
                >
                  <Check size={12} /> 저장
                </button>
                <button
                  onClick={() => {
                    setEditMode(false);
                    setTempBio(bio);
                  }}
                  className="flex-1 flex items-center justify-center gap-1 bg-gray-100 text-gray-500 text-xs py-1.5 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <X size={12} /> 취소
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-2">
              <p className="text-sm text-gray-500 flex-1">{bio}</p>
              <button
                onClick={() => {
                  setEditMode(true);
                  setTempBio(bio);
                }}
                className="text-gray-400 hover:text-violet-500 transition-colors shrink-0"
              >
                <Edit3 size={14} />
              </button>
            </div>
          )}

          <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-3 gap-2 text-center">
            <div>
              <p
                className="text-base text-gray-800"
                style={{ fontWeight: 700 }}
              >
                {totalSolved}
              </p>
              <p className="text-[10px] text-gray-400">총 문제</p>
            </div>
            <div>
              <p
                className="text-base text-orange-500"
                style={{ fontWeight: 700 }}
              >
                🔥{me.streak}
              </p>
              <p className="text-[10px] text-gray-400">연속 일수</p>
            </div>
            <div>
              <p
                className="text-base text-violet-600"
                style={{ fontWeight: 700 }}
              >
                {activeDays}
              </p>
              <p className="text-[10px] text-gray-400">활동 일수</p>
            </div>
          </div>
        </div>

        {/* Monthly trend */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3
            className="text-gray-700 mb-3"
            style={{ fontSize: 14, fontWeight: 700 }}
          >
            월별 풀이 현황
          </h3>
          <ResponsiveContainer width="100%" height={130}>
            <AreaChart
              data={monthlyTrend}
              margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  fontSize: 11,
                  borderRadius: 10,
                  border: "1px solid #f3f4f6",
                }}
                formatter={(v: number) => [`${v}문제`]}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#7c3aed"
                strokeWidth={2}
                fill="url(#grad)"
                dot={{ fill: "#7c3aed", r: 4 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Platform pie */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3
            className="text-gray-700 mb-1"
            style={{ fontSize: 14, fontWeight: 700 }}
          >
            플랫폼별 풀이
          </h3>
          {platformData.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-gray-400 text-sm">
              아직 없어요
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={140}>
              <PieChart>
                <Pie
                  data={platformData}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={50}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {platformData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    fontSize: 11,
                    borderRadius: 10,
                    border: "1px solid #f3f4f6",
                  }}
                  formatter={(v: number) => [`${v}문제`]}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
          <div className="flex flex-wrap gap-1.5 justify-center mt-1">
            {platformData.map((d) => (
              <div key={d.name} className="flex items-center gap-1">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: d.color }}
                />
                <span className="text-[10px] text-gray-500">
                  {d.name} {d.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Heatmap */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-5">
        <div className="flex items-center justify-between mb-4">
          <h3
            className="text-gray-700"
            style={{ fontSize: 15, fontWeight: 700 }}
          >
            기여 히트맵
          </h3>
          <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
            <span>적음</span>
            {[0, 1, 2, 3].map((v) => (
              <div
                key={v}
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: heatmapColor(v) }}
              />
            ))}
            <span>많음</span>
          </div>
        </div>
        <div className="flex gap-1 overflow-x-auto pb-1">
          {/* Day labels */}
          <div className="flex flex-col gap-1 mr-1">
            <div className="h-3" />
            {DAY_LABELS.map((d) => (
              <div key={d} className="h-3 w-4 flex items-center">
                <span className="text-[9px] text-gray-400">{d}</span>
              </div>
            ))}
          </div>
          {/* Weeks */}
          {heatmapWeeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-1">
              <div className="h-3">
                {week[0]?.date && week[0].date.endsWith("-01") ? (
                  <span className="text-[9px] text-gray-400 whitespace-nowrap">
                    {parseInt(week[0].date.split("-")[1])}월
                  </span>
                ) : null}
              </div>
              {week.map((day, di) => (
                <div
                  key={di}
                  className="w-3 h-3 rounded-sm transition-all hover:scale-125 cursor-default"
                  style={{ backgroundColor: heatmapColor(day.count) }}
                  title={
                    day.date
                      ? `${day.date}: ${day.count > 0 ? `${day.count}문제` : "없음"}`
                      : ""
                  }
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Difficulty chart + My problems */}
      <div className="grid grid-cols-5 gap-4">
        <div className="col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3
            className="text-gray-700 mb-3"
            style={{ fontSize: 15, fontWeight: 700 }}
          >
            난이도별 풀이
          </h3>
          {difficultyData.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
              아직 없어요
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={difficultyData}
                margin={{ top: 0, right: 10, left: -20, bottom: 0 }}
                barSize={20}
              >
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
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
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {difficultyData.map((entry, i) => (
                    <Cell key={i} fill={colorMap[entry.name] ?? "#7c3aed"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* My problems list */}
        <div className="col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <h3
              className="text-gray-700"
              style={{ fontSize: 15, fontWeight: 700 }}
            >
              내가 푼 문제
            </h3>
            <span className="text-xs text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full">
              {myProblems.length}개
            </span>
          </div>
          <div className="flex flex-col gap-1.5 max-h-[280px] overflow-y-auto pr-1">
            {myProblems.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-sm">
                <Star size={28} className="mx-auto mb-2 text-gray-300" />
                아직 풀이를 기록하지 않았어요
              </div>
            ) : (
              myProblems.map((p) => {
                const pc = PLATFORM_CONFIG[p.platform];
                const dc = DIFFICULTY_CONFIG[p.difficulty];
                return (
                  <div
                    key={p.id}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors group"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className="text-sm text-gray-700 truncate"
                          style={{ fontWeight: 500 }}
                        >
                          {p.number ? `${p.number}. ` : ""}
                          {p.title}
                        </span>
                        {p.solution && (
                          <StickyNote
                            size={11}
                            className="text-violet-400 shrink-0"
                          />
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-full ${pc.bg} ${pc.text}`}
                        >
                          {pc.label}
                        </span>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-full ${dc?.bg ?? "bg-gray-100"} ${dc?.text ?? "text-gray-600"}`}
                        >
                          {p.difficulty}
                        </span>
                        {p.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="flex items-center gap-1 text-gray-400">
                        <Clock size={11} />
                        <span className="text-[11px]">{p.timeSpent}분</span>
                      </div>
                      <span className="text-[11px] text-gray-400">
                        {p.date.slice(5)}
                      </span>
                      {p.url && (
                        <a
                          href={p.url}
                          target="_blank"
                          rel="noreferrer"
                          className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-violet-500 transition-all"
                        >
                          <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
