import { Moon } from "lucide-react";

function ScreenSetting() {
  return (
    <div className="flex flex-col gap-2.5">
      <p className="text-xs text-gray-400 font-bold tracking-wider ml-1 uppercase">
        화면
      </p>
      <div className="flex flex-col bg-white rounded-3xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.015)]">
        <div className="flex flex-row items-center justify-between w-full p-5 opacity-50">
          <div className="flex flex-row items-center gap-4">
            <div className="bg-[#F2F4F6] p-3 rounded-2xl flex items-center justify-center text-gray-600">
              <Moon strokeWidth={2} size={20} />
            </div>
            <div className="flex flex-col gap-0.5">
              <p className="font-bold text-gray-800 text-[15px]">다크 모드</p>
              <p className="text-xs text-gray-400 font-medium">준비 중이에요</p>
            </div>
          </div>
          <span className="text-xs font-bold text-gray-400 bg-[#F2F4F6] px-2.5 py-1 rounded-lg">
            수정 불가
          </span>
        </div>
      </div>
    </div>
  );
}

export default ScreenSetting;
