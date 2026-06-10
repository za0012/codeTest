import { AlertCircle } from "lucide-react";

export function DeleteScheduledBanner({
  deleteStudyAt,
}: {
  deleteStudyAt: string;
}) {
  const daysLeft = Math.ceil(
    (new Date(deleteStudyAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
  );

  return (
    <div className="w-full bg-red-50/60 backdrop-blur-sm border-b border-red-100 px-6 py-3.5 flex items-center justify-between transition-all">
      <div className="flex items-center gap-2.5">
        {/* 토스 특유의 깔끔한 라인 아이콘 적용 */}
        <AlertCircle
          className="w-4 h-4 text-red-500 shrink-0"
          strokeWidth={2.5}
        />
        <p className="text-[14px] tracking-tight text-gray-800 font-medium">
          <span className="text-red-500 font-semibold">{daysLeft}일 후</span>{" "}
          스터디가 삭제될 예정이에요
        </p>
      </div>

      {/* 우측에 빈 공간이나 닫기 버튼 등을 넣을 수 있도록 공간을 유지합니다 */}
    </div>
  );
}
