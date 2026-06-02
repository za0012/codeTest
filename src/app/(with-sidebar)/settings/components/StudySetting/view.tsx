import { useQuery } from "@tanstack/react-query";
import { ChevronRight, Copy, Earth, Sparkle } from "lucide-react";
import { getMyStudy } from "@/lib/api/study";
import type { Study } from "@/lib/types/study";
import { handleCopyClipBoard } from "./hook";

function StudySetting() {
  const { data: studyInfo, isLoading: studyInfoLoading } = useQuery<Study>({
    queryKey: ["studyInfo"],
    queryFn: getMyStudy,
  });

  if (studyInfoLoading) {
    return <div></div>;
  }

  return (
    studyInfo && (
      <div className="flex flex-col gap-2.5">
        <p className="text-xs text-gray-400 font-bold tracking-wider ml-1 uppercase">
          스터디
        </p>
        <div className="flex flex-col bg-white rounded-3xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.015)]">
          {/* 스터디 이름 로우 */}
          <button
            type="button"
            className="flex flex-row items-center justify-between w-full p-5 text-left hover:bg-[#F9FAFB] active:bg-[#F2F4F6] transition-colors group"
          >
            <div className="flex flex-row items-center gap-4">
              {/* 아이콘 배경을 무채색으로 통일하여 시선을 분산시키지 않음 */}
              <div className="bg-[#F2F4F6] p-3 rounded-2xl flex items-center justify-center text-gray-600">
                <Earth strokeWidth={2} size={20} />
              </div>
              <div className="flex flex-col gap-0.5">
                <p className="text-xs text-gray-400 font-semibold">
                  스터디 이름
                </p>
                <p className="font-bold text-gray-800 text-[16px]">
                  {studyInfo?.name}
                </p>
              </div>
            </div>
            <ChevronRight
              strokeWidth={2.5}
              className="text-gray-300 group-hover:text-gray-400 transition-colors"
              size={18}
            />
          </button>

          <div className="px-5">
            <div className="w-full h-px bg-gray-100" />
          </div>

          {/* 초대 코드 로우 */}
          <div className="flex flex-row items-center justify-between w-full p-5">
            <div className="flex flex-row items-center gap-4">
              <div className="bg-[#F2F4F6] p-3 rounded-2xl flex items-center justify-center text-gray-600">
                <Sparkle strokeWidth={2} size={20} />
              </div>
              <div className="flex flex-col gap-0.5">
                <p className="text-xs text-gray-400 font-semibold">초대 코드</p>
                <p className="text-[16px] font-bold text-blue-600 tracking-wide">
                  {studyInfo?.invite_code}
                </p>
              </div>
            </div>

            {/* 메인 컬러인 파란색(blue-600) 계열로 변경하여 일관성 확보 */}
            <button
              type="button"
              onClick={() => handleCopyClipBoard(studyInfo.invite_code)}
              className="flex flex-row items-center gap-1.5 bg-[#E8F3FF] hover:bg-[#DAEBFF] active:scale-95 transition-all px-3.5 py-2 rounded-xl text-blue-600"
            >
              <Copy size={13} strokeWidth={2.5} />
              <span className="text-xs font-bold">복사</span>
            </button>
          </div>
        </div>
      </div>
    )
  );
}

export default StudySetting;
