import { Bell, Flame } from "lucide-react";

function AlarmSetting() {
  return (
    <div className="flex flex-col gap-2.5">
      <p className="text-xs text-gray-400 font-bold tracking-wider ml-1 uppercase">
        알림
      </p>
      <div className="flex flex-col bg-white rounded-3xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.015)]">
        {/* 새 풀이 알림 */}
        <div className="flex flex-row items-center justify-between w-full p-5">
          <div className="flex flex-row items-center gap-4">
            <div className="bg-[#F2F4F6] p-3 rounded-2xl flex items-center justify-center text-gray-600">
              <Bell strokeWidth={2} size={20} />
            </div>
            <div className="flex flex-col gap-0.5">
              <p className="font-bold text-gray-800 text-[15px]">
                새 풀이 알림
              </p>
              <p className="text-xs text-gray-400 font-medium">
                스터디원이 문제를 풀면 알려드려요
              </p>
            </div>
          </div>
          {/* 메인 컬러 blue-600 반영 */}
          <div className="w-11 h-6 bg-blue-600 rounded-full p-0.5 cursor-pointer flex items-center justify-end transition-colors">
            <div className="w-5 h-5 bg-white rounded-full shadow-md" />
          </div>
        </div>

        <div className="px-5">
          <div className="w-full h-px bg-gray-100" />
        </div>

        {/* 스트릭 알림 */}
        <div className="flex flex-row items-center justify-between w-full p-5">
          <div className="flex flex-row items-center gap-4">
            {/* 일반 아이콘과 배경 톤을 맞춰 시선을 차분하게 만듦 */}
            <div className="bg-[#F2F4F6] p-3 rounded-2xl flex items-center justify-center text-gray-600">
              <Flame strokeWidth={2} size={20} />
            </div>
            <div className="flex flex-col gap-0.5">
              <p className="font-bold text-gray-800 text-[15px]">스트릭 알림</p>
              <p className="text-xs text-gray-400 font-medium">
                스트릭이 끊기기 전에 알려드려요
              </p>
            </div>
          </div>
          <div className="w-11 h-6 bg-[#E5E8EB] rounded-full p-0.5 cursor-pointer flex items-center justify-start transition-colors">
            <div className="w-5 h-5 bg-white rounded-full shadow-sm" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AlarmSetting;
