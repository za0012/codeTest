import { useQuery } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { ExternalLink, Pencil, Trash2, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { deleteProblem, getProblemById } from "@/lib/api/problems";
import { alertAtom } from "@/lib/store/alertStore";
import type { problemType } from "@/lib/types/problems";

interface modalType {
  id: number;
  user_id: number;
  onClose: React.Dispatch<React.SetStateAction<number>>;
}

function ProblemModal({ id, onClose, user_id }: modalType) {
  const { data, isLoading } = useQuery<problemType>({
    queryKey: ["problem", id],
    queryFn: () => getProblemById(id),
  });

  const setAlert = useSetAtom(alertAtom);

  const handleclose = () => {
    onClose(0);
  };

  const handleEdit = () => {};
  const handleDelete = async () => {
    try {
      await deleteProblem(id);
      setAlert({
        title: "알림",
        content: "게시글이 삭제되었습니다.",
        variant: false,
      });
      onClose(0);
    } catch (error) {
      setAlert({
        title: "삭제 실패",
        content: "다시 시도해주세요.",
        variant: true,
      });
    }
  };
  const detail = [
    { label: "난이도", width: "w-16" },
    { label: "소요 시간", width: "w-20" },
    { label: "푼 날짜", width: "w-24" },
  ];

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
        <div className="absolute top-8 right-8 flex items-center gap-4">
          {data?.member_id === user_id && (
            <div className="flex items-center gap-4.5 border-r border-gray-100 pr-3.5">
              <button
                type="button"
                // onClick={handleEdit} // 수정 핸들러 연결
                className="text-gray-400 hover:text-[#3182f6] transition-colors"
              >
                <Pencil size={20} />
              </button>
              <button
                type="button"
                onClick={handleDelete} // 삭제 핸들러 연결
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 size={20} />
              </button>
            </div>
          )}
          <button
            type="button"
            onClick={handleclose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* 헤더: 플랫폼 & 문제 링크 */}
        <div className="flex items-center gap-2 mb-2">
          {isLoading ? (
            <Skeleton className="w-16 h-5" />
          ) : (
            <span className="text-[#3182f6] font-bold text-sm">
              {data?.platform}
            </span>
          )}
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
          {isLoading ? <Skeleton className="w-3/4 h-8" /> : data?.title}
        </h2>

        {/* 스펙 섹션: 난이도 / 소요시간 / 푼 날짜 (가로 정렬) */}
        <div className="flex gap-8 mb-8 border-b border-gray-100 pb-4">
          {detail.map((item, idx) => (
            <div key={item.label}>
              <p className="text-[11px] text-gray-400 mb-1 font-bold uppercase tracking-tight">
                {item.label}
              </p>
              {isLoading ? (
                <Skeleton className={`${item.width} h-5 mt-1`} />
              ) : (
                <p className="text-[16px] font-semibold text-[#4e5968]">
                  {idx === 1
                    ? `${data?.time_spent}분`
                    : idx === 0
                      ? data?.difficulty
                      : data?.date}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* 본문 섹션들 */}
        <div className="space-y-10">
          {isLoading ? (
            // 로딩 중일 때 보여줄 가짜 본문
            <div className="space-y-6">
              <div>
                <Skeleton className="w-20 h-4 mb-4" />{" "}
                {/* SOLUTION 라벨 대용 */}
                <Skeleton className="w-full h-40 rounded-2xl" />{" "}
                {/* 코드 박스 대용 */}
              </div>
              <div>
                <Skeleton className="w-16 h-4 mb-4" /> {/* MEMO 라벨 대용 */}
                <div className="space-y-2">
                  <Skeleton className="w-full h-4" />
                  <Skeleton className="w-full h-4" />
                  <Skeleton className="w-2/3 h-4" />
                </div>
              </div>
            </div>
          ) : (
            <>
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
                  {data.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 bg-[#f2f4f6] text-[#6b7684] text-[13px] font-medium rounded-lg hover:bg-gray-200 transition-colors cursor-default"
                    >
                      #{tag.trim()}
                    </span>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* 푸터: 작성자 정보 (간결하게 요약) */}
        <footer className="mt-8 pt-8 border-t border-gray-100 flex items-center gap-3">
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
