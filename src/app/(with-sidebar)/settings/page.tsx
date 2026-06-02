"use client";

import AccountSetting from "./components/AccountSetting/view";
import AlarmSetting from "./components/AlarmSetting/view";
import ProfileSetting from "./components/ProfileSetting/view";
import ScreenSetting from "./components/ScreenSetting/view";
import StudySetting from "./components/StudySetting/view";

function page() {
  return (
    <div className="min-h-screen bg-[#F9FAFB] flex justify-center items-start antialiased selection:bg-blue-100">
      <div className="w-full max-w-xl flex flex-col gap-6 py-8 px-5">
        {/* 타이틀 영역 */}
        <div className="px-1 pt-2">
          <h1 className="text-gray-900 text-2xl font-bold tracking-tight">
            설정
          </h1>
        </div>
        {/* 1. 프로필 섹션 */}
        <ProfileSetting />
        {/* 2. 스터디 섹션 */}
        <StudySetting />
        {/* 3. 알림 섹션 */}
        <AlarmSetting />
        {/* 4. 화면 섹션 */}
        <ScreenSetting />
        {/* 5. 계정 섹션 */}
        <AccountSetting />
      </div>
    </div>
  );
}

export default page;
