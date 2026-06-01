"use client";

import { useQuery } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import {
  Circle,
  CircleCheckBig,
  Code2,
  FileCode2,
  LayoutDashboard,
  LogOut,
  Settings,
  TestTubeDiagonal,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getUser, signOut } from "@/lib/api/auth";
import { getMyStudy, getMyStudyInfo, getStudyMembers } from "@/lib/api/study";
import { alertAtom } from "@/lib/store/alertStore";
import type { Study, UserProfile } from "@/lib/types/study";

function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const setAlert = useSetAtom(alertAtom);

  const { data: study } = useQuery({
    // 타입으로 <Study>를 붙이면 undifined일 수도 있다고 나옴...
    queryKey: ["studyInfo"],
    queryFn: getMyStudy,
  });

  const { data: user } = useQuery<UserProfile>({
    queryKey: ["userInfo"],
    queryFn: getMyStudyInfo,
  });

  const { data: members } = useQuery({
    queryKey: ["getMembers"],
    queryFn: () => getStudyMembers(study.id),
    enabled: !!study,
  });

  const handleLogout = async () => {
    await signOut();
    // alert("로그아웃 되었습니다");
    setAlert({
      title: "알람",
      content: "로그아웃 되었습니다",
      variant: false,
    });
    router.push("/login");
  };
  // console.log("getMyStudy", study);
  // console.log("getMyStudyInfo", user);
  // console.log("membersmembers", members);

  const navItems = [
    { to: "/home", label: "대시보드", icon: LayoutDashboard },
    { to: "/problems", label: "문제풀이", icon: FileCode2 },
    { to: "/mypage", label: "마이페이지", icon: User },
    { to: "/settings", label: "설정", icon: Settings },
    { to: "/test", label: "테스트", icon: TestTubeDiagonal },
    { to: "/test2", label: "UI 테스트", icon: TestTubeDiagonal },
  ];

  return (
    <aside className="w-56 min-w-56 flex h-screen sticky top-0 flex-col overflow-y-auto border-r border-gray-100 bg-white select-none">
      {/* Header Section */}
      <div className="px-6 pt-7 pb-5">
        <div className="flex items-center gap-3">
          {/* 로고 박스: 둥근 모서리를 살짝 더 다듬고 그림자 제거 */}
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600">
            <Code2 size={18} className="text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-[15px] font-bold leading-tight text-[#191f28] truncate">
              {study?.name}
            </p>
            <p className="text-[11px] text-gray-400 mt-0.5 truncate font-medium">
              {study?.description}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      {/* 패딩을 넓혀 시각적 안정감을 줍니다 */}
      <nav className="flex flex-col gap-1 px-3">
        {navItems.map(({ to, label, icon: Icon }) => {
          const isActive = to.includes(pathname);
          return (
            <Link
              key={to}
              href={to}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] transition-all
              ${
                isActive
                  ? "bg-[#191f28] font-bold text-[#f2f4f6]"
                  : "font-medium text-[#4e5968] hover:bg-gray-50 hover:text-[#191f28]"
              }`}
            >
              <Icon
                size={18}
                strokeWidth={isActive ? 2.2 : 1.8}
                className={isActive ? "text-[#f2f4f6]" : "text-[#8b95a1]"}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* 구분선 지우고 큰 마진 여백으로 대체하여 공간 분리 */}
      <div className="mt-8" />

      {/* Members Section */}
      {/* 나중에 클릭 액션이 들어갈 예정이므로 cursor-pointer와 hover 효과 보강 */}
      <div className="flex-1 px-3">
        <p className="mb-2 px-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
          스터디원 {members?.length}
        </p>
        <div className="flex flex-col gap-0.5">
          {members?.map((member) => (
            <div
              key={member.name}
              className="flex items-center justify-between rounded-xl px-3 py-2 transition-colors hover:bg-gray-50 cursor-pointer group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative shrink-0">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-100 bg-[#f2f4f6] text-sm">
                    {member.emoji}
                  </div>
                  <div
                    className={`absolute -right-0.5 -bottom-0.5 h-2 w-2 rounded-full border border-white
                  ${member.today_solved ? "bg-emerald-500" : "bg-gray-300"}`}
                  />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-semibold text-[#4e5968] group-hover:text-[#191f28] transition-colors">
                    {member.name}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-center shrink-0 pl-1">
                {member.today_solved ? (
                  <CircleCheckBig className="h-4 w-4 text-emerald-500 stroke-[1.8px]" />
                ) : (
                  <Circle className="h-4 w-4 text-gray-200 stroke-[1.5px]" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-auto border-t border-gray-100 px-5 py-4.5 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative shrink-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f2f4f6] text-xl">
              {user?.emoji}
            </div>
            <div className="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-[14px] font-bold text-[#191f28]">
              {user?.name}
            </p>
            <p className="text-[11px] text-gray-400 font-medium mt-0.5">
              {user?.role}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="shrink-0 text-gray-400 hover:text-gray-600 transition-colors p-1.5 rounded-lg hover:bg-gray-50"
          aria-label="로그아웃"
        >
          <LogOut size={16} strokeWidth={2} />
        </button>
      </div>
    </aside>
  );
}
export default Sidebar;
