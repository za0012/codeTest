"use client";

import { useQuery } from "@tanstack/react-query";
import SelectDemo from "@/components/SelectCustom";
import { getMyMemberInfo } from "@/lib/api/members";
import { getProblems } from "@/lib/api/problems";
import ProblemCard from "./components/ProblemCard";
import type { Problem, UserProfile } from "@/lib/types/study";
import {
  ALGORITHM_TAGS,
  DIFFICULT_TAGS,
  PLATFORM_TAGS,
  type PlatformType,
} from "@/constants/problem";
import { useState } from "react";
import Input from "@/components/ui/Input";
import { Skeleton } from "@/components/ui/skeleton";
import { FileCode2, Plus } from "lucide-react";
import { getStudyMembers } from "@/lib/api/study";
import ProblemModal from "./components/ProblemModal";
import ProblemAddModal from "./components/ProblemAddModal";

function page() {
  // const [platform, setPlatform] = useState("all");
  const [search, setSearch] = useState("");
  const [platform, setPlatform] = useState("all");
  const [difficulty, setDifficulty] = useState("all");
  const [memberName, setMemberName] = useState("all");
  const [openProblem, setOpenProblem] = useState(0);
  const [openAddProblem, setOpenAddProblem] = useState(false);

  // const handleReset = () => {
  //   setPlatform("all");
  //   setDifficulty("all");
  //   setMemberName("all");
  // };

  // 내 멤버 정보 먼저
  // const { data: myInfo } = useQuery<UserProfile>({
  const { data: myInfo } = useQuery({
    queryKey: ["myInfo"],
    queryFn: getMyMemberInfo,
  });

  // memberInfo 있으면 problems 조회
  const { data: problems, isLoading: isProblemLoading } = useQuery<Problem[]>({
    queryKey: [
      "problems",
      platform,
      difficulty,
      memberName,
      search,
      openProblem,
      openAddProblem,
    ],
    queryFn: () =>
      getProblems(myInfo.study_id, {
        platform,
        difficulty,
        memberName,
        search,
      }),
    enabled: !!myInfo?.study_id,
  });
  console.log(myInfo);
  const { data: members } = useQuery({
    queryKey: ["memberList"],
    queryFn: () => getStudyMembers(myInfo.study_id),
    select: (data) => data.map((member) => member.name),
  });

  const selectData = [
    {
      array: Object.keys(PLATFORM_TAGS),
      value: platform,
      change: setPlatform,
      placeholder: "플랫폼",
    },
    {
      array:
        platform && DIFFICULT_TAGS[platform as PlatformType]
          ? Object.values(DIFFICULT_TAGS[platform as PlatformType])
          : [...new Set(Object.values(DIFFICULT_TAGS).flat())],
      // DIFFICULT_TAGS[platform as PlatformType] 기존엔 안 넣었으나, platform 값이 DIFFICULT_TAGS의 키에 없을 때 라는 가정이 오류를 불러와, 추가하게 됨.
      value: difficulty,
      change: setDifficulty,
      placeholder: "난이도",
    },
    {
      array: members,
      value: memberName,
      change: setMemberName,
      placeholder: "풀이자",
    },
    {
      array: ALGORITHM_TAGS,
      value: platform,
      change: setPlatform,
      placeholder: "태그",
    },
  ];

  return (
    <div className="px-8 pt-8 pb-0 shrink-0 h-screen overflow-hidden">
      <div>
        <h1
          className="text-gray-900"
          style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.3px" }}
        >
          문제풀이
        </h1>
        <p className="text-gray-400 text-xs mt-0.5">
          총 {problems?.length || 0}문제 기록됨
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 my-6 w-full border-b border-gray-50">
        {/* 왼쪽: 검색 및 필터 그룹 */}
        <div className="flex flex-wrap items-center gap-2">
          {/* 검색창: 고정 너비 및 깔끔한 라운딩 */}
          <div className="w-60 shrink-0">
            <Input
              placeholder="어떤 문제를 찾으시나요?"
              size="sm"
              className="w-full border-none text-[#191f28] placeholder:text-gray-400 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-[#3182f6] outline-none transition-all"
              onChange={(e) => setSearch(e.currentTarget.value)}
            />
          </div>
          <div className="border-r-[1.5px] border-gray-200/75 py-4 mx-2" />

          {/* 나머지 필터 버튼들 */}
          {selectData.map((select) => (
            <SelectDemo
              key={select.placeholder}
              value={select.value}
              selectArray={select.array}
              selectChange={select.change}
              placeholder={select.placeholder}
              size="xs"
              variant={"outline"}
            />
          ))}

          {/* 초기화 버튼 (주석 해제 시 토스 스타일) */}
          {/* <button 
              type="button" 
              onClick={handleReset}
              className="flex items-center gap-1 px-3 py-2 text-xs font-semibold text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
            >
              <RotateCcw size={14} />
              초기화
            </button> */}
        </div>

        {/* 오른쪽: 문제 추가 메인 버튼 (CTA) */}
        <button
          type="button"
          onClick={() => setOpenAddProblem(true)}
          className="flex items-center gap-1.5 px-5 py-2.5 bg-blue-500 text-white font-bold text-sm rounded-xl hover:bg-[#1b64da] active:scale-[0.98] transition-all shadow-sm shadow-blue-100 shrink-0"
        >
          <Plus size={16} />
          문제 추가
        </button>
      </div>
      <div className="flex flex-col gap-3 overflow-y-auto">
        {isProblemLoading ? (
          new Array(3)
            .fill(0)
            .map((_, i) => <Skeleton key={`${i}`} className="h-18 w-full" />)
        ) : problems?.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-20 text-center">
            <FileCode2 size={40} className="text-gray-200 mb-3" />
            <p className="text-gray-400 font-medium">문제가 없어요</p>
            <p className="text-gray-300 text-sm mt-1">
              필터를 조정하거나 새 문제를 추가해보세요
            </p>
          </div>
        ) : (
          problems?.map((problem) => (
            <ProblemCard
              key={problem.id}
              date={problem.date}
              difficulty={problem.difficulty}
              id={problem.id}
              platform={problem.platform}
              study_members={problem.study_members}
              tags={problem.tags}
              time_spent={problem.time_spent}
              title={problem.title}
              onClick={() => setOpenProblem(problem.id)}
            />
          ))
        )}
      </div>
      {openProblem !== 0 && (
        <ProblemModal
          id={openProblem}
          onClose={setOpenProblem}
          user_id={myInfo.id}
        />
      )}
      {openAddProblem && (
        <ProblemAddModal
          onClose={setOpenAddProblem}
          study_id={myInfo.study_id}
          member_id={myInfo.id}
        />
      )}
    </div>
  );
}

export default page;
