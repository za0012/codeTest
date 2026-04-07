import { Link, Outlet, createRootRoute } from "@tanstack/react-router";
import { StudyProvider, useStudy } from "../context/StudyContext";
import {
  LayoutDashboard,
  FileCode2,
  User,
  Code2,
  CheckCircle2,
  Circle,
  TestTubeDiagonal,
} from "lucide-react";

const navItems = [
  { to: "/", label: "대시보드", icon: LayoutDashboard },
  { to: "/problems", label: "문제풀이", icon: FileCode2 },
  { to: "/mypage", label: "마이페이지", icon: User },
  { to: "/test", label: "테스트 페이지", icon: TestTubeDiagonal },
];

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <StudyProvider>
      <div className="flex min-h-screen bg-gray-50/50">
        <SidebarInner />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </StudyProvider>
  );
}

export function SidebarInner() {
  const { members } = useStudy();
  const me = members[0];

  return (
    <aside className="w-55 min-w-55 bg-white border-r border-gray-100 flex flex-col h-screen sticky top-0 overflow-y-auto">
      {/* Logo */}
      <div className="px-5 pt-6 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-violet-600 flex items-center justify-center shadow-sm">
            <Code2 size={16} className="text-white" />
          </div>
          <div>
            <p
              className="text-sm text-gray-800"
              style={{ fontWeight: 700, lineHeight: 1.3 }}
            >
              코테 스터디
            </p>
            <p className="text-[10px] text-gray-400">알고리즘 정복하기 🔥</p>
          </div>
        </div>
      </div>

      {/* My Profile */}
      <div className="px-4 pb-4">
        <div className="bg-violet-50 rounded-2xl p-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-xl shadow-sm border border-violet-100">
              {me.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p
                  className="text-sm text-gray-800 truncate"
                  style={{ fontWeight: 600 }}
                >
                  {me.name}
                </p>
                <span className="text-[10px] px-1.5 py-0.5 bg-violet-600 text-white rounded-full shrink-0">
                  {me.role}
                </span>
              </div>
              <p className="text-[11px] text-gray-500 truncate">{me.bio}</p>
            </div>
          </div>
          <div className="flex gap-2 mt-2.5">
            <div className="flex-1 bg-white rounded-xl p-1.5 text-center border border-violet-100">
              <p
                className="text-xs text-violet-700"
                style={{ fontWeight: 700 }}
              >
                {me.solvedCount}
              </p>
              <p className="text-[10px] text-gray-400">풀었어요</p>
            </div>
            <div className="flex-1 bg-white rounded-xl p-1.5 text-center border border-violet-100">
              <p
                className="text-xs text-orange-500"
                style={{ fontWeight: 700 }}
              >
                🔥{me.streak}
              </p>
              <p className="text-[10px] text-gray-400">연속일</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="px-3 flex flex-col gap-0.5">
        {navItems.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            activeProps={{ className: "bg-violet-50 text-violet-700" }}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all text-gray-500 hover:bg-gray-50 hover:text-gray-700"
          >
            {({ isActive }) => (
              <>
                <Icon size={16} style={{ strokeWidth: isActive ? 2.5 : 1.8 }} />
                <span style={{ fontWeight: isActive ? 600 : 400 }}>
                  {label}
                </span>
              </>
            )}
          </Link>
        ))}
      </nav>

      {/* Divider */}
      <div className="mx-4 my-3 border-t border-gray-100" />

      {/* Members */}
      <div className="px-4 flex-1">
        <p
          className="text-[11px] text-gray-400 px-1 mb-2"
          style={{ fontWeight: 600 }}
        >
          스터디원 {members.length}
        </p>
        <div className="flex flex-col gap-1">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div className="relative">
                <div className="w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center text-base border border-gray-100">
                  {member.emoji}
                </div>
                <div
                  className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${member.todaySolved ? "bg-emerald-400" : "bg-gray-300"}`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="text-xs text-gray-700 truncate"
                  style={{ fontWeight: member.id === 1 ? 600 : 400 }}
                >
                  {member.name}
                </p>
              </div>
              <div className="shrink-0">
                {member.todaySolved ? (
                  <CheckCircle2 size={13} className="text-emerald-500" />
                ) : (
                  <Circle size={13} className="text-gray-300" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom hint */}
      <div className="p-4">
        <div className="bg-violet-50 rounded-xl p-2.5 text-center">
          <p className="text-[10px] text-violet-500">오늘도 한 문제씩! 💪</p>
        </div>
      </div>
    </aside>
  );
}
