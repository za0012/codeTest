import { useState } from "react";
import { useStudy } from "../../context/StudyContext";
import { type Problem } from "../../data/mockData";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProblemModal } from "../../components/ProblemModal";
import { PROBLEMSFix } from "../../data/mockData";
import Calendar from "./components/Calendar";
import Feed from "./components/Feed";

// const TODAY_STR = new Date().toLocaleDateString();
const TODAY_STR = new Date();
const TODAY_STR_LOCAL = new Date().toLocaleDateString();

const DAYS_KOR_MON = ["월", "화", "수", "목", "금", "토", "일"];

export function Dashboard() {
  const ctx = useStudy();
  //   const problems = ctx?.problems;
  const problems = PROBLEMSFix;
  const members = ctx?.members;

  if (!members || !problems) return console.log("멤버 / 프라블럼 로딩 실패!!");

  const me = members[0];

  const [viewYear, setViewYear] = useState(2026);
  const [viewMonth, setViewMonth] = useState(3);
  const [selectedDate, setSelectedDate] = useState(TODAY_STR_LOCAL);
  const [modalProblem, setModalProblem] = useState<Problem | null>(null);

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const problemsByDate: Record<string, number> = {};
  problems?.forEach((p) => {
    problemsByDate[p.date] = (problemsByDate[p.date] || 0) + 1;
  });

  const monthTotal = Object.entries(problemsByDate)
    .filter(([dateKey]) => {
      const day = new Date(dateKey); // 키를 Date 객체로 변환
      // 연도와 월이 현재 보고 있는(viewYear, viewMonth)와 일치하는지 확인
      return day.getFullYear() === viewYear && day.getMonth() === viewMonth;
    })
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

  const todaySolved = problems?.filter(
    (p) => p.date === TODAY_STR_LOCAL,
  ).length;
  const totalSolved = problems?.length;

  return (
    <div className="flex h-screen bg-white">
      {/* ─── LEFT: Calendar panel ─── */}
      <div className="w-85 min-w-85 border-r border-gray-100 flex flex-col h-full overflow-y-auto px-7 py-8">
        {/* User profile */}
        <div className="flex items-center gap-3 mb-7">
          <div className="w-11 h-11 rounded-full bg-violet-100 flex items-center justify-center text-2xl border-2 border-violet-200 shrink-0">
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
          <div className="flex-1 bg-violet-50 rounded-2xl p-3 text-center">
            <p
              className="text-violet-700"
              style={{ fontSize: 18, fontWeight: 700 }}
            >
              {todaySolved}
            </p>
            <p className="text-violet-400 text-[11px] mt-0.5">오늘 풀었어요</p>
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
                className="flex items-center gap-0.5 text-[12px] text-violet-500"
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
        <Calendar
          viewYear={viewYear}
          viewMonth={viewMonth}
          daysInMonth={daysInMonth}
          problemsByDate={problemsByDate}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          today={TODAY_STR}
          today_local={TODAY_STR_LOCAL}
        />
      </div>
      <Feed
        problems={problems}
        members={members}
        selectedDate={selectedDate}
        setModalProblem={setModalProblem}
        today_local={TODAY_STR_LOCAL}
      />
      {modalProblem && (
        <ProblemModal
          problem={modalProblem}
          onClose={() => setModalProblem(null)}
        />
      )}
    </div>
  );
}
