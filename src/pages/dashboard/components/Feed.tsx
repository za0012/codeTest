import { Clock } from "lucide-react";
import { DIFFICULTY_CONFIG, PLATFORM_CONFIG, type Member, type Problem } from "../../../data/mockData";

interface feedProp {
    // members: Member[] | undefined
    problems: Problem[];
    members: Member[];
    selectedDate: string;
    setModalProblem:  (value: Problem | null) => void;
      today_local: string;
}

function Feed({problems,members, selectedDate, setModalProblem, today_local}: feedProp) {
    function formatFeedDate(dateStr: string) {
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}월 ${d.getDate()}일 ${days[d.getDay()]}요일`;
}
  const feedProblems = problems?.filter((p) => p.date === selectedDate);
  const groupedByMember = members
    .map((member) => ({
      member,
      problems: feedProblems?.filter((p) => p.memberId === member.id),
    }))
    .filter((g) => g.problems.length > 0);

  return (
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
            {selectedDate === today_local && (
              <span
                className="ml-2 text-violet-500 text-xs bg-violet-50 px-2 py-0.5 rounded-full"
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
                  <div className="w-8 h-8 rounded-full bg-violet-50 flex items-center justify-center text-lg border border-violet-100">
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
                        className="flex items-center gap-4 p-3.5 rounded-2xl border border-gray-100 hover:border-violet-100 hover:bg-violet-50/30 transition-all text-left group w-full"
                      >
                        {/* Check circle */}
                        <div className="w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center shrink-0 shadow-sm shadow-violet-200 group-hover:bg-violet-600 transition-colors">
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
  )
}

export default Feed