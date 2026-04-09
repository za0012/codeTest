import { useState, useMemo } from "react";
import { useStudy } from "../../context/StudyContext";
import {
  PLATFORM_CONFIG,
  DIFFICULTY_CONFIG,
  DIFFICULTY_BY_PLATFORM,
  ALL_TAGS,
  type Platform,
  type Problem,
} from "../../data/mockData";
import { Plus, Search, X, Clock, ChevronDown, FileCode2 } from "lucide-react";
import { ProblemModal } from "../../components/ProblemModal";
import ModalCustomProb from "./components/ModalCustomProb";

type FilterPlatform = Platform | "all";

export const emptyForm = (): Omit<Problem, "id"> => ({
  title: "",
  number: "",
  platform: "BOJ",
  difficulty: "Silver",
  tags: [],
  date: "2026-04-06",
  memberId: 1,
  solution: "",
  memo: "",
  timeSpent: 0,
  url: "",
});

export function Problems() {
  const { problems, members } = useStudy();

  const [search, setSearch] = useState("");
  const [filterPlatform, setFilterPlatform] = useState<FilterPlatform>("all");
  const [filterDifficulty, setFilterDifficulty] = useState("all");
  const [filterTag, setFilterTag] = useState("all");
  const [filterMember, setFilterMember] = useState("all");

  const [showAddModal, setShowAddModal] = useState(false);
  const [detailProblem, setDetailProblem] = useState<Problem | null>(null);
  const [form, setForm] = useState<Omit<Problem, "id">>(emptyForm());

  const filtered = useMemo(() => {
    return [...problems]
      .filter((p) => {
        if (filterPlatform !== "all" && p.platform !== filterPlatform)
          return false;
        if (filterDifficulty !== "all" && p.difficulty !== filterDifficulty)
          return false;
        if (filterTag !== "all" && !p.tags.includes(filterTag)) return false;
        if (filterMember !== "all" && String(p.memberId) !== filterMember)
          return false;
        if (
          search &&
          !p.title.toLowerCase().includes(search.toLowerCase()) &&
          !p.number.includes(search)
        )
          return false;
        return true;
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [
    problems,
    filterPlatform,
    filterDifficulty,
    filterTag,
    filterMember,
    search,
  ]);

  // const handleAdd = () => {
  //   if (!form.title.trim()) return;
  //   addProblem(form);
  //   setShowAddModal(false);
  //   setForm(emptyForm());
  // };

  const hasFilter =
    filterPlatform !== "all" ||
    filterDifficulty !== "all" ||
    filterTag !== "all" ||
    filterMember !== "all" ||
    search;
  const clearFilter = () => {
    setFilterPlatform("all");
    setFilterDifficulty("all");
    setFilterTag("all");
    setFilterMember("all");
    setSearch("");
  };

  const difficultiesForFilter =
    filterPlatform === "all"
      ? [
          "all",
          ...Array.from(new Set(Object.values(DIFFICULTY_BY_PLATFORM).flat())),
        ]
      : ["all", ...DIFFICULTY_BY_PLATFORM[filterPlatform as Platform]];

  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden">
      {/* ─── Top header ─── */}
      <div className="px-8 pt-8 pb-0 shrink-0">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1
              className="text-gray-900"
              style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.3px" }}
            >
              문제풀이
            </h1>
            <p className="text-gray-400 text-xs mt-0.5">
              총 {problems.length}문제 기록됨
            </p>
          </div>
          <button
            onClick={() => {
              setShowAddModal(true);
              setForm(emptyForm());
            }}
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2.5 rounded-2xl hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200"
            style={{ fontSize: 13, fontWeight: 600 }}
          >
            <Plus size={15} />
            문제 추가
          </button>
        </div>

        {/* ─── Filter bar ─── */}
        <div className="flex items-center gap-2 flex-wrap pb-5 border-b border-gray-100">
          {/* Search */}
          <div className="relative">
            <Search
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300"
            />
            <input
              className="bg-gray-50 border border-gray-100 rounded-xl pl-8 pr-3 py-2 text-gray-700 focus:outline-none focus:border-blue-200 focus:ring-1 focus:ring-[#e8f3ff] w-44"
              style={{ fontSize: 13 }}
              placeholder="검색..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Platform pills */}
          <div className="flex items-center gap-1.5">
            {(["all", ...Object.keys(PLATFORM_CONFIG)] as const).map((p) => (
              <button
                key={p}
                onClick={() => {
                  setFilterPlatform(p as FilterPlatform);
                  setFilterDifficulty("all");
                }}
                className={`text-xs px-3 py-1.5 rounded-xl border transition-colors ${
                  filterPlatform === p
                    ? p === "all"
                      ? "bg-gray-800 text-white border-transparent"
                      : `${PLATFORM_CONFIG[p as Platform].bg} ${PLATFORM_CONFIG[p as Platform].text} border-transparent`
                    : "border-gray-200 text-gray-500 hover:border-gray-300 bg-white"
                }`}
                style={{ fontWeight: filterPlatform === p ? 600 : 400 }}
              >
                {p === "all" ? "전체" : PLATFORM_CONFIG[p as Platform].label}
              </button>
            ))}
          </div>

          <div className="w-px h-5 bg-gray-200 mx-1" />

          {/* Difficulty select */}
          <div className="relative">
            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              className="appearance-none bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 pr-7 text-gray-600 focus:outline-none focus:border-blue-200 cursor-pointer"
              style={{ fontSize: 12 }}
            >
              {difficultiesForFilter.map((d) => (
                <option key={d} value={d}>
                  {d === "all" ? "전체 난이도" : d}
                </option>
              ))}
            </select>
            <ChevronDown
              size={11}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none"
            />
          </div>

          {/* Member select */}
          <div className="relative">
            <select
              value={filterMember}
              onChange={(e) => setFilterMember(e.target.value)}
              className="appearance-none bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 pr-7 text-gray-600 focus:outline-none focus:border-blue-200 cursor-pointer"
              style={{ fontSize: 12 }}
            >
              <option value="all">전체 멤버</option>
              {members.map((m) => (
                <option key={m.id} value={String(m.id)}>
                  {m.emoji} {m.name}
                </option>
              ))}
            </select>
            <ChevronDown
              size={11}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none"
            />
          </div>

          {/* Tag select */}
          <div className="relative">
            <select
              value={filterTag}
              onChange={(e) => setFilterTag(e.target.value)}
              className="appearance-none bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 pr-7 text-gray-600 focus:outline-none focus:border-blue-200 cursor-pointer"
              style={{ fontSize: 12 }}
            >
              <option value="all">전체 태그</option>
              {ALL_TAGS.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
            <ChevronDown
              size={11}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none"
            />
          </div>

          {hasFilter && (
            <button
              onClick={clearFilter}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors ml-1"
            >
              <X size={12} /> 초기화
            </button>
          )}

          <span className="ml-auto text-xs text-gray-400">
            <span className="text-gray-600" style={{ fontWeight: 600 }}>
              {filtered.length}
            </span>
            개
          </span>
        </div>
      </div>

      {/* ─── Problem list ─── */}
      <div className="flex-1 overflow-y-auto px-8 py-5">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <FileCode2 size={40} className="text-gray-200 mb-3" />
            <p className="text-gray-400" style={{ fontWeight: 500 }}>
              문제가 없어요
            </p>
            <p className="text-gray-300 text-sm mt-1">
              필터를 조정하거나 새 문제를 추가해보세요
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {filtered.map((problem) => {
              const member = members.find((m) => m.id === problem.memberId);
              const pc = PLATFORM_CONFIG[problem.platform];
              const dc = DIFFICULTY_CONFIG[problem.difficulty];
              return (
                <button
                  key={problem.id}
                  onClick={() => setDetailProblem(problem)}
                  className="flex items-center gap-4 px-4 py-3.5 rounded-2xl border border-gray-100 hover:border-[#e8f3ff] hover:bg-blue-50/20 transition-all text-left group w-full"
                >
                  <div className="w-8 h-8 rounded-full bg-[#e8f3ff] flex items-center justify-center shrink-0 group-hover:bg-blue-500 transition-colors">
                    <span
                      className="text-blue-500 group-hover:text-white text-xs transition-colors"
                      style={{ fontWeight: 700 }}
                    >
                      ✓
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p
                      className="text-gray-800 truncate"
                      style={{ fontSize: 14, fontWeight: 600 }}
                    >
                      {problem.number ? `${problem.number}. ` : ""}
                      {problem.title}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                      <span
                        className={`text-[11px] px-2 py-0.5 rounded-full ${pc.bg} ${pc.text}`}
                        style={{ fontWeight: 500 }}
                      >
                        {pc.label}
                      </span>
                      <span
                        className={`text-[11px] px-2 py-0.5 rounded-full ${dc?.bg ?? "bg-gray-100"} ${dc?.text ?? "text-gray-500"}`}
                        style={{ fontWeight: 500 }}
                      >
                        {problem.difficulty}
                      </span>
                      {problem.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-400"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm">{member?.emoji}</span>
                      <span className="text-xs text-gray-400">
                        {member?.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-300">
                      <Clock size={11} />
                      <span className="text-xs text-gray-400">
                        {problem.timeSpent}분
                      </span>
                    </div>
                    <span className="text-xs text-gray-300 w-10 text-right">
                      {problem.date.slice(5)}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {detailProblem && (
        <ProblemModal
          problem={detailProblem}
          onClose={() => setDetailProblem(null)}
          onDelete={() => setDetailProblem(null)}
          onUpdate={(updated) => setDetailProblem(updated)}
        />
      )}

      {/* Add Modal */}
      {showAddModal && <ModalCustomProb setShowAddModal={setShowAddModal} />}
    </div>
  );
}
