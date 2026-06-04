import { Clock, ExternalLink } from "lucide-react";
import { useState } from "react";
import { PLATFORM_TAGS, type PlatformType } from "@/constants/problem";
import type { ProblemCardType } from "@/lib/types/study";

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

function ProblemCard({
  title,
  url,
  tags,
  study_members,
  time_spent,
  difficulty,
  platform,
  date,
  onClick,
}: ProblemCardType) {
  const color = PLATFORM_TAGS[platform as PlatformType];
  const [hovered, setHovered] = useState(false);

  const hasStudyMember = Boolean(study_members);

  return (
    <button
      type="button"
      className="flex items-center gap-4 px-4 py-3.5 rounded-2xl border border-gray-100 hover:border-[#e8f3ff] hover:bg-blue-50/20 transition-all text-left group w-full"
      onMouseEnter={!hasStudyMember ? () => setHovered(true) : undefined}
      onMouseLeave={!hasStudyMember ? () => setHovered(false) : undefined}
      onClick={onClick}
    >
      <div className="flex items-center gap-4 flex-1">
        {hasStudyMember && (
          <div className="w-8 h-8 rounded-full bg-[#e8f3ff] flex items-center justify-center shrink-0 group-hover:bg-blue-600 transition-colors">
            <span className="text-blue-600 group-hover:text-white text-xs transition-colors font-bold">
              ✓
            </span>
          </div>
        )}

        {/* 제목과 태그들 */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-row items-center gap-2">
            <p className="text-gray-800 truncate text-sm font-semibold leading-tight">
              {title}
            </p>
            {!hasStudyMember && hovered && (
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center text-gray-400 hover:text-[#3182f6] transition-colors font-medium"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink size={12} />
              </a>
            )}
          </div>
          <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
            {/* 플랫폼 태그 (예: 프로그래머스) */}
            <span
              className={`text-[11px] px-2 py-1 rounded-full font-medium leading-none`}
              style={{ backgroundColor: color.bg, color: color.text }}
            >
              {platform}
            </span>
            {/* 레벨 태그 */}
            <span className="text-[11px] px-2 py-1 rounded-full font-medium text-blue-600 bg-blue-50 leading-none">
              {difficulty}
            </span>
            {/* 일반 태그들 */}
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] px-2 py-1 rounded-full font-medium text-gray-500 bg-gray-100 leading-none"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 2. 오른쪽 영역: 멤버, 시간, 날짜 */}
      <div className="flex items-center gap-2 shrink-0">
        {study_members?.emoji && (
          <div className="flex items-center gap-1.5">
            <span className="text-sm">{study_members.emoji}</span>
            <span className="text-xs text-gray-400">{study_members.name}</span>
          </div>
        )}
        <div className="flex items-center gap-1 text-gray-300">
          <Clock size={11} />
          <span className="text-xs text-gray-400">{time_spent}분</span>
        </div>
        <span className="text-xs text-gray-300 w-10 text-right">
          {new Date(date)
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

export default ProblemCard;
