"use client";

import { UserProfile } from "@/lib/types/study";

interface userProps {
  userInfo: UserProfile;
}

function User({ userInfo }: userProps) {
  return (
    <div className="flex flex-row items-start p-6 bg-white rounded-2xl max-w-2xl">
      {/* 1. 프로필 이미지 (이모지 배경) */}
      <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-[#e8f3ff] text-4xl mb-4 sm:mb-0 sm:mr-6">
        {userInfo.emoji}
      </div>

      {/* 2. 우측 콘텐츠 영역 */}
      <div className="flex flex-col gap-4 w-full">
        {/* 유저 이름 & 뱃지 라인 */}
        <div className="flex flex-row items-center gap-2">
          <span className="font-bold text-2xl text-[#191f28]">
            {userInfo.name}
          </span>

          {/* 스터디장 뱃지 */}
          <span className="rounded-lg px-2 py-0.5 bg-[#191f28] text-white text-xs font-semibold">
            {userInfo.role}
          </span>

          {/* 골드 레벨 뱃지 */}
          {/* <span className="flex items-center gap-0.5 rounded-lg px-2 py-0.5 bg-[#fff9e6] text-[#ffbb00] text-xs font-bold">
            🏆 Gold
          </span> */}
        </div>

        {/* 한 줄 소개 & 수정 아이콘 */}
        {userInfo.bio && (
          <div className="flex items-center gap-1 text-[#4e5968] text-sm">
            <span>{userInfo.bio}</span>
            <button
              type="button"
              className="text-[#b0b8c1] hover:text-[#8b95a1] transition"
            >
              ✏️
            </button>
          </div>
        )}

        {/* 3. 하단 대시보드 통계 (시원한 여백과 일관된 서체 변화) */}
        <div className="flex flex-row gap-10 mt-2">
          {/* 총 문제 */}
          <div className="flex flex-col gap-1">
            <span className="font-bold text-2xl text-[#191f28]">
              {userInfo.solved_count}
            </span>
            <span className="text-xs font-medium text-[#8b95a1]">총 문제</span>
          </div>

          {/* 연속 일수 */}
          <div className="flex flex-col gap-1">
            <span className="font-bold text-2xl text-[#ff5f2e] flex items-center gap-0.5">
              🔥{userInfo.streak}
            </span>
            <span className="text-xs font-medium text-[#8b95a1]">
              연속 일수
            </span>
          </div>

          {/* 활동 일수 */}
          <div className="flex flex-col gap-1">
            {/* <span className="font-bold text-2xl text-[#191f28]">
              {userInfo.join_date}
            </span> */}
            <span className="font-bold text-2xl text-[#191f28]">
              {Math.floor(
                (Date.now() - new Date(userInfo.join_date).getTime()) /
                  (1000 * 60 * 60 * 24),
              )}
            </span>
            <span className="text-xs font-medium text-[#8b95a1]">
              활동 일수
            </span>
          </div>

          {/* 자주 푼 유형 */}
          <div className="flex flex-col gap-1">
            <span className="font-bold text-2xl text-[#191f28]">{"DP"}</span>
            <span className="text-xs font-medium text-[#8b95a1]">
              자주 푼 유형
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default User;
