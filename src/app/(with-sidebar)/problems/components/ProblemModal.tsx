import { useQuery } from "@tanstack/react-query";
import { X, ExternalLink, Clock, BarChart3 } from "lucide-react";
import { getProblemById } from "@/lib/api/problems";
import type { problemType } from "@/lib/types/problems";

interface modalType {
  id: number;
  onClose: React.Dispatch<React.SetStateAction<number>>;
}

function ProblemModal({ id, onClose }: modalType) {
  const { data, isLoading } = useQuery<problemType>({
    queryKey: ["problem", id],
    queryFn: () => getProblemById(id),
  });

  console.log("🐹🐹", data);
  console.log("💩💩", id);

  const handleclose = () => {
    onClose(0);
  };
  return (
    <div className="fixed inset-0 bg-black/25 backdrop-blur-[2px] flex items-center justify-center z-50 p-6">
      <div
        className="bg-white rounded-4xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto no-scrollbar p-10 relative"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {/* 상단 닫기 버튼 */}
        <button
          type="button"
          onClick={handleclose}
          className="absolute top-8 right-8 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>

        {/* 헤더: 플랫폼 & 문제 링크 */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[#3182f6] font-bold text-sm">
            {data?.platform}
          </span>
          <span className="text-gray-200">·</span>
          <a
            href={data?.url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-sm text-gray-400 hover:text-[#3182f6] transition-colors font-medium"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink size={14} />
            문제 보기
          </a>
        </div>

        {/* 제목 */}
        <h2 className="text-2xl font-bold text-[#191f28] mb-8 leading-snug">
          {data?.title}
        </h2>

        {/* 스펙 섹션: 난이도 / 소요시간 / 푼 날짜 (가로 정렬) */}
        <div className="flex gap-8 mb-10 border-b border-gray-50 pb-8">
          <div>
            <p className="text-[11px] text-gray-400 mb-1 font-bold uppercase tracking-tight">
              난이도
            </p>
            <p className="text-[16px] font-semibold text-[#4e5968]">
              {data?.difficulty}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1 font-medium text-uppercase tracking-tight">
              소요 시간
            </p>
            <p className="text-[16px] font-semibold text-[#4e5968]">
              {data?.time_spent}분
            </p>
          </div>
          <div>
            <p className="text-[11px] text-gray-400 mb-1 font-bold uppercase tracking-tight">
              푼 날짜
            </p>
            <p className="text-[16px] font-semibold text-[#4e5968]">
              {data?.date}
            </p>
          </div>
        </div>

        {/* 본문 섹션들 */}
        <div className="space-y-10">
          {/* 코드 섹션 */}
          {data?.solution && (
            <div>
              <h3 className="text-[11px] font-bold text-gray-300 uppercase tracking-widest mb-4">
                SOLUTION
              </h3>
              <div className="bg-[#f9fafb] rounded-2xl p-6 overflow-x-auto border border-gray-100">
                <pre className="text-[13px] font-mono text-[#333d4b] leading-6">
                  <code>{data?.solution}</code>
                </pre>
              </div>
            </div>
          )}

          {/* 메모 섹션 */}
          <div>
            <h3 className="text-[11px] font-bold text-gray-300 uppercase tracking-widest mb-4">
              MEMO
            </h3>
            <p className="text-[16px] text-[#4e5968] leading-[1.6] whitespace-pre-wrap">
              {data?.memo || "기록된 메모가 없습니다."}
            </p>
          </div>

          {/* 태그 섹션 */}
          {data?.tags && (
            <div className="flex flex-wrap gap-1.5 pt-2">
              {data.tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 bg-[#f2f4f6] text-[#6b7684] text-[13px] font-medium rounded-lg hover:bg-gray-200 transition-colors cursor-default"
                >
                  #{tag.trim()}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 푸터: 작성자 정보 (간결하게 요약) */}
        <footer className="mt-12 pt-8 border-t border-gray-100 flex items-center gap-3">
          <div className="w-10 h-10 bg-[#f2f4f6] rounded-full flex items-center justify-center text-xl shadow-sm">
            {data?.study_members?.emoji}
          </div>
          <div>
            <p className="text-[14px] font-bold text-[#333d4b]">
              {data?.study_members?.name}
            </p>
            <p className="text-[12px] text-gray-400">Study Member</p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default ProblemModal;
