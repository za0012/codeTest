import { useState } from "react";
import { useStudy } from "../../context/StudyContext";
import { type Problem } from "../../data/mockData";
import { ProblemModal } from "../../components/ProblemModal";
import { PROBLEMSFix } from "../../data/mockData";
import Calendar from "./components/Calendar";
import Feed from "./components/Feed";

// const TODAY_STR = new Date().toLocaleDateString();
const TODAY_STR = new Date();
// const TODAY_STR_LOCAL = new Date().toLocaleDateString();
const TODAY_STR_LOCAL = new Intl.DateTimeFormat("sv-SE").format(new Date());

export function Dashboard() {
  const ctx = useStudy();
  //   const problems = ctx?.problems;
  const problems = PROBLEMSFix;
  const members = ctx?.members;

  if (!members || !problems) return console.log("멤버 / 프라블럼 로딩 실패!!");

  const [viewYear, setViewYear] = useState(2026);
  const [viewMonth, setViewMonth] = useState(3);
  const [selectedDate, setSelectedDate] = useState(TODAY_STR_LOCAL);
  const [modalProblem, setModalProblem] = useState<Problem | null>(null);

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const problemsByDate: Record<string, number> = {};
  problems?.forEach((p) => {
    problemsByDate[p.date] = (problemsByDate[p.date] || 0) + 1;
  });

  return (
    <div className="flex h-screen bg-white">
      <Calendar
        viewYear={viewYear}
        viewMonth={viewMonth}
        daysInMonth={daysInMonth}
        problemsByDate={problemsByDate}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        setViewYear={setViewYear}
        setViewMonth={setViewMonth}
        today={TODAY_STR}
        today_local={TODAY_STR_LOCAL}
        problems={problems}
        me={members[0]}
      />
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
