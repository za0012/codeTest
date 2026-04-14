import {
  DIFFICULTY_CONFIG,
  PLATFORM_CONFIG,
  type FormData,
} from "@/data/mockData";
import { Clock } from "lucide-react";

interface dataType {
  problem: FormData;
  onClicks: (problem: FormData) => void;
}

function ListCatd({ problem, onClicks }: dataType) {
  const member = problem.members;
  const pc = PLATFORM_CONFIG[problem.platform];
  const dc = DIFFICULTY_CONFIG[problem.difficulty];

  return (
    <button
      key={problem.id}
      onClick={() => onClicks(problem)}
      className="flex items-center gap-4 px-4 py-3.5 rounded-2xl border border-gray-100 hover:border-[#e8f3ff] hover:bg-blue-50/20 transition-all text-left group w-full"
    >
      <div className="w-8 h-8 rounded-full bg-[#e8f3ff] flex items-center justify-center shrink-0 group-hover:bg-blue-500 transition-colors">
        <span
          className="text-blue-500 group-hover:text-white text-xs transition-colors"
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
          {problem.title}
        </p>
        <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
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
          {problem.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-400"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4 shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="text-sm">{member?.emoji}</span>
          <span className="text-xs text-gray-400">{member?.name}</span>
        </div>
        <div className="flex items-center gap-1 text-gray-300">
          <Clock size={11} />
          <span className="text-xs text-gray-400">{problem.time_spent}분</span>
        </div>
        <span className="text-xs text-gray-300 w-10 text-right">
          {new Date(problem.created_at)
            .toLocaleDateString("ko-KR", {
              month: "2-digit",
              day: "2-digit",
            })
            .replace(/\. /g, "-")
            .replace(".", "")}
        </span>
      </div>
    </button>
  );
}

export default ListCatd;
