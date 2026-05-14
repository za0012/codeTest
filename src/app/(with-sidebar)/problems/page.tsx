"use client";

import { useQuery } from "@tanstack/react-query";
import SelectDemo from "@/components/SelectCustom";
import { getMyMemberInfo } from "@/lib/api/members";
import { getProblems } from "@/lib/api/problems";
import ProblemCard from "./components/ProblemCard";
import type { Problem } from "@/lib/types/study";
import {
  ALGORITHM_TAGS,
  DIFFICULT_TAGS,
  PLATFORM_TAGS,
  type PlatformType,
} from "@/constants/problem";
import { useState } from "react";
import Input from "@/components/ui/Input";
import { Skeleton } from "@/components/ui/skeleton";
import { FileCode2 } from "lucide-react";
import { getStudyMembers } from "@/lib/api/study";
import ProblemModal from "./components/ProblemModal";

function page() {
  // const [platform, setPlatform] = useState("all");
  const [search, setSearch] = useState("");
  const [platform, setPlatform] = useState("all");
  const [difficulty, setDifficulty] = useState("all");
  const [memberName, setMemberName] = useState("all");
  const [openProblem, setOpenProblem] = useState(0);

  // const handleReset = () => {
  //   setPlatform("all");
  //   setDifficulty("all");
  //   setMemberName("all");
  // };

  console.log(memberName);
  // 내 멤버 정보 먼저
  const { data: myInfo } = useQuery({
    queryKey: ["myInfo"],
    queryFn: getMyMemberInfo,
  });

  // memberInfo 있으면 problems 조회
  const { data: problems, isLoading: isProblemLoading } = useQuery<Problem[]>({
    queryKey: ["problems", platform, difficulty, memberName, search],
    queryFn: () =>
      getProblems(myInfo.study_id, {
        platform,
        difficulty,
        memberName,
        search,
      }),
    enabled: !!myInfo?.study_id,
  });

  const { data: members } = useQuery({
    queryKey: ["memberList"],
    queryFn: () => getStudyMembers(myInfo.study_id),
    select: (data) => data.map((member) => member.name),
  });

  console.log("membersmembers", members);

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
          : Object.values(DIFFICULT_TAGS).flat(),
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
      <div className="flex flex-wrap items-center gap-2 my-3 w-full">
        {/* 검색창: 고정 너비를 주고, 공간이 부족해도 줄어들지 않게(shrink-0) 설정 */}
        <div className="w-62.5 shrink-0">
          <Input
            placeholder="검색..."
            size="sm"
            className="w-full"
            onChange={(e) => setSearch(e.currentTarget.value)}
          />
        </div>

        {/* 나머지 버튼들: 내용만큼만 너비를 차지하도록 설정 */}
        {selectData.map((select) => (
          <SelectDemo
            key={select.placeholder}
            value={select.value}
            selectArray={select.array}
            selectChange={select.change}
            placeholder={select.placeholder}
            size="w-[120px]" // 너비를 자동(내용만큼)으로
          />
        ))}
        {/* <button type="button" onClick={handleReset}>
          <RotateCcw />
          초기화
        </button> */}
      </div>
      <div className="flex flex-col gap-3 overflow-y-auto h-1/2">
        {isProblemLoading ? (
          new Array(3)
            .fill(0)
            .map((_, i) => <Skeleton key={`${i}`} className="h-18 w-full" />)
        ) : problems?.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
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
        <ProblemModal id={openProblem} onClose={setOpenProblem} />
      )}
    </div>
  );
}

export default page;
