import { useState } from "react";
import { useStudy } from "../context/StudyContext";
import {
  PLATFORM_CONFIG,
  DIFFICULTY_CONFIG,
  type Problem,
} from "../data/mockData";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { ProblemModal } from "../components/ProblemModal";

const TODAY_STR = "2026-04-06";
const DAYS_KOR_MON = ["월", "화", "수", "목", "금", "토", "일"];

function localDateStr(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function formatFeedDate(dateStr: string) {
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  const d = new Date(dateStr + "T00:00:00");
  return `${d.getMonth() + 1}월 ${d.getDate()}일 ${days[d.getDay()]}요일`;
}

function mondayFirstDay(date: Date) {
  return (date.getDay() + 6) % 7;
}

export function Dashboard() {
  const ctx = useStudy();
  const problems = ctx?.problems;
  const members = ctx?.members;

  if (!members || !problems) return console.log("멤버 / 프라블럼 로딩 실패!!");

  const me = members[0];

  const [viewYear, setViewYear] = useState(2026);
  const [viewMonth, setViewMonth] = useState(3);
  const [selectedDate, setSelectedDate] = useState(TODAY_STR);
  const [modalProblem, setModalProblem] = useState<Problem | null>(null);

  const firstDay = mondayFirstDay(new Date(viewYear, viewMonth, 1));
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const problemsByDate: Record<string, number> = {};
  problems?.forEach((p) => {
    problemsByDate[p.date] = (problemsByDate[p.date] || 0) + 1;
  });

  const monthPrefix = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}`;
  const monthTotal = Object.entries(problemsByDate)
    .filter(([d]) => d.startsWith(monthPrefix))
    .reduce((s, [, v]) => s + v, 0);

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
    } else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
    } else setViewMonth((m) => m + 1);
  };

  // Feed: problems for selected date, grouped by member
  const feedProblems = problems?.filter((p) => p.date === selectedDate);
  const groupedByMember = members
    .map((member) => ({
      member,
      problems: feedProblems?.filter((p) => p.memberId === member.id),
    }))
    .filter((g) => g.problems.length > 0);

  const todaySolved = problems?.filter((p) => p.date === TODAY_STR).length;
  const totalSolved = problems?.length;

  return (
    <div className="flex h-screen bg-white">
      {/* ─── LEFT: Calendar panel ─── */}
      <div className="w-85 min-w-85 border-r border-gray-100 flex flex-col h-full overflow-y-auto px-7 py-8">
        {/* User profile */}
        <div className="flex items-center gap-3 mb-7">
          <div className="w-11 h-11 rounded-full bg-[#e8f3ff] flex items-center justify-center text-2xl border-2 border-blue-200 shrink-0">
            {me.emoji}
          </div>
          <div>
            <p
              className="text-gray-800"
              style={{ fontSize: 16, fontWeight: 700 }}
            >
              {me.name}
            </p>
            <p className="text-gray-400 text-xs mt-0.5">{me.bio}</p>
          </div>
        </div>

        {/* Quick stats */}
        <div className="flex items-center gap-2.5 mb-7">
          <div className="flex-1 bg-blue-50 rounded-2xl p-3 text-center">
            <p
              className="text-blue-700"
              style={{ fontSize: 18, fontWeight: 700 }}
            >
              {todaySolved}
            </p>
            <p className="text-blue-400 text-[11px] mt-0.5">오늘 풀었어요</p>
          </div>
          <div className="flex-1 bg-gray-50 rounded-2xl p-3 text-center">
            <p
              className="text-gray-700"
              style={{ fontSize: 18, fontWeight: 700 }}
            >
              {totalSolved}
            </p>
            <p className="text-gray-400 text-[11px] mt-0.5">총 누적 문제</p>
          </div>
          <div className="flex-1 bg-orange-50 rounded-2xl p-3 text-center">
            <p
              className="text-orange-500"
              style={{ fontSize: 17, fontWeight: 700 }}
            >
              🔥{me.streak}
            </p>
            <p className="text-orange-300 text-[11px] mt-0.5">연속 스트릭</p>
          </div>
        </div>

        {/* Month header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span
              className="text-gray-800"
              style={{ fontSize: 15, fontWeight: 700 }}
            >
              {viewYear}년 {viewMonth + 1}월
            </span>
            {monthTotal > 0 && (
              <span
                className="flex items-center gap-0.5 text-[12px] text-blue-500"
                style={{ fontWeight: 600 }}
              >
                ✓ {monthTotal}
              </span>
            )}
          </div>
          <div className="flex items-center gap-0.5">
            <button
              onClick={prevMonth}
              className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 transition-colors"
            >
              <ChevronLeft size={15} />
            </button>
            <button
              onClick={nextMonth}
              className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 transition-colors"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>

        {/* Day-of-week headers */}
        <div className="grid grid-cols-7 mb-1">
          {DAYS_KOR_MON.map((d) => (
            <div
              key={d}
              className="text-center text-[11px] py-1 text-gray-400"
              style={{ fontWeight: 500 }}
            >
              {d}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-y-0.5">
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`e${i}`} />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dateStr = localDateStr(viewYear, viewMonth, day);
            const count = problemsByDate[dateStr] || 0;
            const isToday = dateStr === TODAY_STR;
            const isSelected = dateStr === selectedDate;
            const isFuture = dateStr > TODAY_STR;

            return (
              <button
                key={day}
                onClick={() => setSelectedDate(dateStr)}
                disabled={isFuture}
                className="flex flex-col items-center py-0.5 group"
              >
                {count > 0 ? (
                  <div
                    className={`
                    w-9 h-9 rounded-full flex items-center justify-center transition-all
                    ${
                      isToday
                        ? "bg-blue-600 shadow-md shadow-blue-200"
                        : isSelected
                          ? "bg-blue-500"
                          : "bg-[#e8f3ff] group-hover:bg-blue-200"
                    }
                  `}
                  >
                    <span
                      className={`${isToday || isSelected ? "text-white" : "text-[#3182f6]"}`}
                      style={{ fontSize: 12, fontWeight: 700 }}
                    >
                      {count > 1 ? count : "✓"}
                    </span>
                  </div>
                ) : (
                  <div
                    className={`
                    w-9 h-9 rounded-full flex items-center justify-center transition-all
                    ${isToday ? "bg-gray-800" : isSelected ? "bg-gray-100" : isFuture ? "" : "group-hover:bg-gray-50"}
                  `}
                  >
                    <span
                      className={`${isToday ? "text-white" : isFuture ? "text-gray-200" : "text-gray-400"}`}
                      style={{ fontSize: 13, fontWeight: isToday ? 700 : 400 }}
                    >
                      {day}
                    </span>
                  </div>
                )}
                {count > 0 && (
                  <span
                    className={`text-[10px] mt-0.5 ${isSelected ? "text-blue-500" : "text-gray-400"}`}
                    style={{ fontWeight: isSelected ? 600 : 400 }}
                  >
                    {day}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── RIGHT: Feed panel ─── */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto px-10 py-8">
        {/* Feed header */}
        <div className="mb-7">
          <h1
            className="text-gray-900"
            style={{ fontSize: 30, fontWeight: 800, letterSpacing: "-0.5px" }}
          >
            Feed
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            {formatFeedDate(selectedDate)}
            {selectedDate === TODAY_STR && (
              <span
                className="ml-2 text-blue-500 text-xs bg-blue-50 px-2 py-0.5 rounded-full"
                style={{ fontWeight: 600 }}
              >
                오늘
              </span>
            )}
            {feedProblems.length > 0 && (
              <span className="ml-2 text-gray-400 text-xs">
                · {feedProblems.length}문제
              </span>
            )}
          </p>
        </div>

        {feedProblems.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 text-center">
            <div className="text-5xl mb-4">📭</div>
            <p className="text-gray-400" style={{ fontWeight: 500 }}>
              이 날은 풀이 기록이 없어요
            </p>
            <p className="text-gray-300 text-sm mt-1">
              달력에서 다른 날짜를 눌러보세요
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-7 max-w-2xl">
            {groupedByMember.map(({ member, problems: mProblems }) => (
              <div key={member.id}>
                {/* Member header */}
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-lg border border-[#e8f3ff]">
                    {member.emoji}
                  </div>
                  <span
                    className="text-gray-700"
                    style={{ fontSize: 14, fontWeight: 700 }}
                  >
                    {member.name}
                  </span>
                  <span className="text-xs text-gray-300 bg-gray-50 px-2 py-0.5 rounded-full">
                    {mProblems.length}문제
                  </span>
                </div>

                {/* Problems under this member */}
                <div className="flex flex-col gap-2 pl-1">
                  {mProblems.map((problem) => {
                    const pc = PLATFORM_CONFIG[problem.platform];
                    const dc = DIFFICULTY_CONFIG[problem.difficulty];
                    return (
                      <button
                        key={problem.id}
                        onClick={() => setModalProblem(problem)}
                        className="flex items-center gap-4 p-3.5 rounded-2xl border border-gray-100 hover:border-[#e8f3ff] hover:bg-blue-50/30 transition-all text-left group w-full"
                      >
                        {/* Check circle */}
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center shrink-0 shadow-sm shadow-blue-200 group-hover:bg-blue-600 transition-colors">
                          <span
                            className="text-white text-xs"
                            style={{ fontWeight: 700 }}
                          >
                            ✓
                          </span>
                        </div>

                        <div className="flex-1 min-w-0">
                          <p
                            className="text-gray-800 truncate"
                            style={{ fontSize: 14, fontWeight: 600 }}
                          >
                            {problem.number ? `${problem.number}. ` : ""}
                            {problem.title}
                          </p>
                          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                            <span
                              className={`text-[11px] px-2 py-0.5 rounded-full ${pc.bg} ${pc.text}`}
                              style={{ fontWeight: 500 }}
                            >
                              {pc.label}
                            </span>
                            <span
                              className={`text-[11px] px-2 py-0.5 rounded-full ${dc?.bg ?? "bg-gray-100"} ${dc?.text ?? "text-gray-500"}`}
                              style={{ fontWeight: 500 }}
                            >
                              {problem.difficulty}
                            </span>
                            {problem.tags.slice(0, 2).map((tag) => (
                              <span
                                key={tag}
                                className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-400"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center gap-1 text-gray-300 shrink-0">
                          <Clock size={11} />
                          <span className="text-[11px] text-gray-400">
                            {problem.timeSpent}분
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {modalProblem && (
        <ProblemModal
          problem={modalProblem}
          onClose={() => setModalProblem(null)}
        />
      )}
    </div>
  );
}
