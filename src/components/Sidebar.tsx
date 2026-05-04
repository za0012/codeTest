"use client";

import { getMyStudy, getMyStudyInfo } from "@/lib/api/study";
import { getUser, signOut } from "@/lib/api/auth";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileCode2,
  User,
  Code2,
  TestTubeDiagonal,
} from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import type { Study, UserProfile } from "@/lib/types/study";

function Sidebar() {
  const router = useRouter();

  const { data: study } = useQuery<Study>({
    queryKey: ["studyInfo"],
    queryFn: getMyStudy,
  });

  const { data: user } = useQuery<UserProfile>({
    queryKey: ["userInfo"],
    queryFn: getMyStudyInfo,
  });

  console.log(user);

  const handleLogout = async () => {
    await signOut();
    alert("로그아웃 되었습니다");
    router.push("/login");
  };
  console.log(study);

  const members = [
    { name: "더미데이터", status: "online", completed: true, emoji: "🦊" },
    { name: "이서연", status: "online", completed: true, emoji: "🐰" },
    { name: "박지호", status: "offline", completed: false, emoji: "🐻" },
    { name: "최유나", status: "online", completed: true, emoji: "🦋" },
    { name: "정태양", status: "offline", completed: false, emoji: "🐯" },
  ];

  const navItems = [
    { to: "/home", label: "대시보드", icon: LayoutDashboard },
    { to: "/problems", label: "문제풀이", icon: FileCode2 },
    { to: "/mypage", label: "마이페이지", icon: User },
    { to: "/test", label: "테스트", icon: TestTubeDiagonal },
    { to: "/test2", label: "UI 테스트", icon: TestTubeDiagonal },
  ];

  return (
    <aside className="w-55 min-w-55 flex h-screen sticky top-0 flex-col overflow-y-auto border-r border-gray-100 bg-white">
      {/* Header Section */}
      <div className="px-5 pt-6 pb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 shadow-sm">
            <Code2 size={16} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-bold leading-tight text-gray-800">
              {study?.name}
            </p>
            <p className="text-[10px] text-gray-400">{study?.description}</p>
          </div>
        </div>
      </div>

      {/* My Profile Section */}
      <div className="px-4 pb-4">
        <div className="rounded-2xl bg-blue-50 p-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e8f3ff] bg-white text-xl shadow-sm">
              {user?.emoji}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p className="truncate text-sm font-semibold text-gray-800">
                  {user?.name}
                </p>
                <span className="shrink-0 rounded-full bg-blue-600 px-1.5 py-0.5 text-[10px] text-white">
                  {user?.role}
                </span>
              </div>
              <p className="truncate text-[11px] text-gray-500">{user?.bio}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-2.5 flex gap-2">
            <div className="flex-1 rounded-xl border border-[#e8f3ff] bg-white p-1.5 text-center">
              <p className="text-xs font-bold text-blue-700">
                {user?.solved_count}
              </p>
              <p className="text-[10px] text-gray-400">풀었어요</p>
            </div>
            <div className="flex-1 rounded-xl border border-[#e8f3ff] bg-white p-1.5 text-center">
              <p className="text-xs font-bold text-orange-500">
                🔥{user?.streak}
              </p>
              <p className="text-[10px] text-gray-400">연속일</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-0.5 px-3 text-sm font-medium">
        {navItems.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            href={to}
            className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-gray-500 transition-all hover:bg-gray-50 hover:text-gray-700"
          >
            <Icon size={16} strokeWidth={1.8} />
            {label}
          </Link>
        ))}
      </nav>

      {/* Divider */}
      <div className="mx-4 my-3 border-t border-gray-100" />

      {/* Members Section */}
      <div className="flex-1 px-4">
        <p className="mb-2 px-1 text-[11px] font-semibold text-gray-400">
          스터디원 {members.length}
        </p>
        <div className="flex flex-col gap-1">
          {members.map((member) => (
            <div
              key={member.name}
              className="flex items-center gap-2.5 rounded-xl px-2 py-1.5 transition-colors hover:bg-gray-50"
            >
              <div className="relative">
                <div className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-100 bg-gray-50 text-base">
                  {member.emoji}
                </div>
                <div className="absolute -right-0.5 -bottom-0.5 h-2.5 w-2.5 rounded-full border-2 border-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs text-gray-700">{member.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="p-4">
        <div className="rounded-xl bg-blue-50 p-2.5 text-center">
          <button
            type="button"
            onClick={handleLogout}
            className="text-xs font-bold text-blue-500 hover:text-blue-600 transition-colors"
          >
            로그아웃
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
