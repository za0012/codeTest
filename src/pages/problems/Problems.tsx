import { useState, useMemo, useEffect } from "react";
import {
  PLATFORM_CONFIG,
  DIFFICULTY_BY_PLATFORM,
  ALL_TAGS,
  type Platform,
  type FormData,
  type Member,
} from "../../data/mockData";
import { Plus, Search, FileCode2 } from "lucide-react";
import { ProblemModal } from "@/components/ProblemModal";
import ModalCustomProb from "./components/ModalCustomProb";
import { getMembers, getProblems } from "@/lib/api";
import ListCatd from "./components/ListCatd";
import { SelectC } from "@/components/custom";
import { Button, Input, Skeleton } from "@/components/index";

type FilterPlatform = Platform | "all";

export function Problems() {
  const [search, setSearch] = useState("");
  const [filterPlatform, setFilterPlatform] = useState<FilterPlatform>("all");
  const [filterDifficulty, setFilterDifficulty] = useState("all");
  const [filterTag, setFilterTag] = useState("all");
  const [filterMember, setFilterMember] = useState("all");

  const [filter, setFilter] = useState({
    search: "",
    platform: "all" as Platform,
    difficulty: "all",
    tag: "all",
    member: "all",
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [detailProblem, setDetailProblem] = useState<FormData | null>(null);
  const [problems, setProblems] = useState<FormData[]>([]);
  const [member, setMember] = useState<Member[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const filtered = useMemo(() => {
    return [...problems].filter((p) => {
      if (filterPlatform !== "all" && p.platform !== filterPlatform)
        return false;
      if (filterDifficulty !== "all" && p.difficulty !== filterDifficulty)
        return false;
      if (filterTag !== "all" && !p.tags.includes(filterTag)) return false;
      if (filterMember !== "all" && String(p.members?.name) !== filterMember)
        return false;
      if (search && !p.title.toLowerCase().includes(search.toLowerCase()))
        return false;
      return true;
    });
  }, [
    problems,
    filterPlatform,
    filterDifficulty,
    filterTag,
    filterMember,
    search,
  ]);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const resProblem = await getProblems();
        const resMembers = await getMembers();
        setProblems(resProblem);
        setMember(resMembers);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        alert(
          "데이터를 불러오던 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
        );
        setIsLoading(false);
      }
    };
    fetchProblems();
  }, []);

  const difficultiesForFilter = useMemo(() => {
    return filterPlatform === "all"
      ? ["all", ...Object.values(DIFFICULTY_BY_PLATFORM).flat()]
      : ["all", ...DIFFICULTY_BY_PLATFORM[filterPlatform as Platform]];
  }, [filterPlatform]);

  const members = useMemo(() => {
    return member.map((m) => `${m.emoji} ${m.name}`);
  }, [member]);

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
            type="button"
            onClick={() => {
              setShowAddModal(true);
            }}
            className="text-[13px] font-semibold flex items-center gap-2 bg-blue-500 text-white px-4 py-2.5 rounded-2xl hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200"
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
            <Input
              placeholder="검색"
              className="text-[11px] pl-8 pr-3 py-2 w-44"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Platform pills */}
          <div className="flex items-center gap-1.5">
            {(["all", ...Object.keys(PLATFORM_CONFIG)] as const).map((p) => (
              <Button
                key={p}
                size="xs"
                variant="blueOut"
                onClick={() => {
                  setFilterPlatform(p as FilterPlatform);
                  setFilterDifficulty("all");
                }}
                className={`font-normal! ${
                  filterPlatform === p
                    ? p === "all"
                      ? "font-semibold! bg-gray-800 text-white"
                      : `font-semibold! ${PLATFORM_CONFIG[p as Platform].bg} ${PLATFORM_CONFIG[p as Platform].text} border-transparent`
                    : ""
                }`}
              >
                {p === "all" ? "전체" : PLATFORM_CONFIG[p as Platform].label}
              </Button>
            ))}
          </div>
          <div className="w-px h-5 bg-gray-200 mx-1" />
          <div className="grid grid-cols-3 gap-2">
            {/* Difficulty select */}
            <SelectC
              selectLabel={"난이도"}
              selectItem={difficultiesForFilter}
              placeholder="전체 난이도"
              onSelect={setFilterDifficulty}
            />
            {/* Member select */}
            <SelectC
              selectLabel={"멤버"}
              selectItem={["all", ...members]}
              placeholder="전체 멤버"
              onSelect={setFilterMember}
            />
            {/* Tag select */}
            <SelectC
              selectLabel={"태그"}
              selectItem={["all", ...ALL_TAGS]}
              placeholder="전체 태그"
              onSelect={setFilterTag}
            />
          </div>
          <span className="ml-auto text-xs text-gray-400">
            <span className="text-gray-600 font-semibold">
              {filtered.length}
            </span>
            개
          </span>
        </div>
      </div>

      {/* ─── Problem list ─── */}
      <div className="flex-1 overflow-y-auto px-8 py-5">
        {isLoading ? (
          new Array(3)
            .fill(0)
            .map((_, i) => <Skeleton key={i} className="h-18 w-full my-3" />)
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <FileCode2 size={40} className="text-gray-200 mb-3" />
            <p className="text-gray-400 font-medium">문제가 없어요</p>
            <p className="text-gray-300 text-sm mt-1">
              필터를 조정하거나 새 문제를 추가해보세요
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {filtered.map((problem) => (
              <ListCatd
                problem={problem}
                onClicks={setDetailProblem}
                key={problem.id}
              />
            ))}
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
      {showAddModal && (
        <ModalCustomProb setShowAddModal={setShowAddModal} members={members} />
      )}
    </div>
  );
}
