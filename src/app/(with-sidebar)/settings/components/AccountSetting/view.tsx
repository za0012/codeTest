import { ChevronRight, LogOut, Trash2 } from "lucide-react";

function AccountSetting() {
  return (
    <div className="flex flex-col gap-2.5">
      <p className="text-xs text-gray-400 font-bold tracking-wider ml-1 uppercase">
        계정
      </p>
      <div className="flex flex-col bg-white rounded-3xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.015)]">
        <button
          type="button"
          className="flex flex-row items-center justify-between w-full p-5 text-left hover:bg-gray-50 active:bg-gray-100 transition-colors group"
        >
          <div className="flex flex-row items-center gap-4">
            <div className="bg-[#F2F4F6] p-3 rounded-2xl flex items-center justify-center text-gray-500">
              <LogOut strokeWidth={2} size={20} />
            </div>
            <p className="font-bold text-gray-700 text-[15px]">로그아웃</p>
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
        <button
          type="button"
          className="flex flex-row items-center justify-between w-full p-5 text-left hover:bg-red-50 active:bg-red-100 transition-colors group"
        >
          <div className="flex flex-row items-center gap-4">
            <div className="bg-[#FFEAEA] p-3 rounded-2xl flex items-center justify-center text-red-500 transition-colors">
              <Trash2 strokeWidth={2} size={20} />
            </div>
            <div className="flex flex-col gap-0.5">
              <p className="font-bold text-red-500 text-[15px]">
                스터디 나가기
              </p>
              <p className="text-xs text-red-400 font-medium">
                스터디에서 탈퇴하면 모든 기록이 삭제돼요
              </p>
            </div>
          </div>
          <ChevronRight
            strokeWidth={2.5}
            className="text-red-300 group-hover:text-red-400 transition-colors"
            size={18}
          />
        </button>
      </div>
    </div>
  );
}

export default AccountSetting;
