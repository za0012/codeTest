import {
  DIFFICULTY_CONFIG,
  PLATFORM_CONFIG,
  type FormData,
} from "@/data/mockData";
import { Clock } from "lucide-react";

interface dataType {
  problem: FormData;
  onClickCard: (problem: number) => void;
}

function ListCard({ problem, onClickCard }: dataType) {
  const member = problem.members;
  const pc = PLATFORM_CONFIG[problem.platform];
  const dc = DIFFICULTY_CONFIG[problem.difficulty];

  interface BageType {
    text: string;
    className: string;
    key?: string;
  }

  const Badge = ({ text, className, key }: BageType) => (
    <span
      key={key}
      className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${className}`}
    >
      {text}
    </span>
  );

  return (
    <button
      type="button"
      key={problem.id}
      onClick={() => onClickCard(problem.id)}
      className="flex items-center gap-4 px-4 py-3.5 rounded-2xl border border-gray-100 hover:border-[#e8f3ff] hover:bg-blue-50/20 transition-all text-left group w-full"
    >
      <div className="w-8 h-8 rounded-full bg-[#e8f3ff] flex items-center justify-center shrink-0 group-hover:bg-blue-500 transition-colors">
        <span className="text-blue-500 group-hover:text-white text-xs transition-colors font-bold">
          ✓
        </span>
      </div>

      {/* tags... 난이도, 플랫폼, 태그 등... */}
      <div className="flex-1 min-w-0">
        <p className="text-gray-800 truncate text-sm font-semibold">
          {problem.title}
        </p>
        <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
          <Badge text={pc.label} className={`${pc.bg} ${pc.text}`} />
          <Badge
            text={problem.difficulty}
            className={`${dc?.bg ?? "bg-gray-100"} ${dc?.text ?? "text-gray-500"}`}
          />
          {problem.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} text={tag} className="bg-gray-100 text-gray-400" />
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

export default ListCard;
