import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Member, Problem } from "../../../data/mockData";

interface calendarProp {
  viewYear: number;
  viewMonth: number;
  daysInMonth: number;
  problemsByDate: Record<string, number>;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  setViewYear: (year: number) => void;
  setViewMonth: (month: number) => void;
  today: Date;
  today_local: string;
  problems: Problem[];
  me: Member;
}
function mondayFirstDay(date: Date) {
  return (date.getDay() + 6) % 7;
}

function Calendar({
  viewYear,
  viewMonth,
  daysInMonth,
  problemsByDate,
  selectedDate,
  setSelectedDate,
  setViewYear,
  setViewMonth,
  today,
  today_local,
  problems,
  me,
}: calendarProp) {
  const DAYS_KOR_MON = ["월", "화", "수", "목", "금", "토", "일"];
  const firstDay = mondayFirstDay(new Date(viewYear, viewMonth, 1));

  const monthTotal = Object.entries(problemsByDate)
    .filter(([dateKey]) => {
      const day = new Date(dateKey); // 키를 Date 객체로 변환
      // 연도와 월이 현재 보고 있는(viewYear, viewMonth)와 일치하는지 확인
      return day.getFullYear() === viewYear && day.getMonth() === viewMonth;
    })
    .reduce((s, [, v]) => s + v, 0);

  const changeMonth = (dir: 1 | -1) => {
    const newMonth = viewMonth + dir;
    console.log(newMonth);
    if (newMonth < 0) {
      setViewYear((y: number) => y - 1);
      setViewMonth(11);
    } else if (newMonth > 11) {
      setViewYear((y: number) => y + 1);
      setViewMonth(0);
    } else {
      setViewMonth(newMonth);
    }
  };

  const todaySolved = problems?.filter((p) => p.date === today_local).length;
  const totalSolved = problems?.length;

  return (
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
          {([-1, 1] as const).map((dir) => (
            <button
              key={dir}
              onClick={() => changeMonth(dir)}
              className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 transition-colors"
            >
              {dir === -1 ? (
                <ChevronLeft size={15} />
              ) : (
                <ChevronRight size={15} />
              )}
            </button>
          ))}
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
      <div className="grid grid-cols-7 gap-y-0.5">
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`e${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dateStr = new Date(viewYear, viewMonth, day);
          const dateStrLocal = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const count = problemsByDate[dateStrLocal] || 0;
          const isToday = dateStrLocal === today_local;
          const isSelected = dateStrLocal === selectedDate;
          const isFuture = dateStr > today;

          return (
            <button
              key={day}
              onClick={() => setSelectedDate(dateStrLocal)}
              disabled={isFuture}
              className="flex flex-col items-center py-0.5 group"
            >
              {count > 0 ? (
                <div
                  className={`
                    w-9 h-9 rounded-full flex items-center justify-center transition-all
                    ${
                      isToday
                        ? "bg-violet-600 shadow-md shadow-violet-200"
                        : isSelected
                          ? "bg-violet-500"
                          : "bg-violet-100 group-hover:bg-violet-200"
                    }
                  `}
                >
                  <span
                    className={`${isToday || isSelected ? "text-white" : "text-violet-600"}`}
                    style={{ fontSize: 12, fontWeight: 700 }}
                  >
                    {count > 1 ? count : "✓"}
                  </span>
                </div>
              ) : (
                <div
                  className={`
                    w-9 h-9 rounded-full flex items-center justify-center transition-all
                    ${isToday ? "bg-indigo-600" : isSelected ? "bg-gray-100" : isFuture ? "" : "group-hover:bg-gray-50"}
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
                  className={`text-[10px] mt-0.5 ${isSelected ? "text-violet-500" : "text-gray-400"}`}
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
  );
}

export default Calendar;
