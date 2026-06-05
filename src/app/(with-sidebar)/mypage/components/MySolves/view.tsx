import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import ProblemCard from "@/app/(with-sidebar)/problems/components/ProblemCard";
import ProblemModal from "@/app/(with-sidebar)/problems/components/ProblemModal";
import { getMyMemberInfo } from "@/lib/api/members";
import type { Problem } from "@/lib/types/study";
import { getMySolves } from "./service";

function MySolves({ id }: { id: number }) {
  const [openProblem, setOpenProblem] = useState(0);

  const { data, isLoading, isError } = useQuery<Problem[]>({
    queryKey: ["mySolves"],
    queryFn: () => getMySolves(id),
  });

  const { data: myInfo } = useQuery({
    queryKey: ["myInfo"],
    queryFn: getMyMemberInfo,
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error occurred</div>;

  console.log(data);

  return (
    <div>
      <div className="flex justify-between mb-3">
        <p className="font-bold text-[#191F28] text-base tracking-tight">
          내가 푼 문제
        </p>
        <p className="font-medium text-gray-500 text-sm tracking-tight">
          {data?.length}개
        </p>
      </div>
      <div className="flex flex-col gap-2 px-4">
        {data?.map((problem) => (
          <ProblemCard
            id={problem.id}
            key={problem.id}
            title={problem.title}
            tags={problem.tags}
            time_spent={problem.time_spent}
            difficulty={problem.difficulty}
            platform={problem.platform}
            date={problem.date}
            onClick={() => setOpenProblem(problem.id)}
            url={problem.url}
          />
        ))}
      </div>
      {openProblem !== 0 && (
        <ProblemModal
          id={openProblem}
          onClose={setOpenProblem}
          user_id={myInfo.id}
        />
      )}
    </div>
  );
}

export default MySolves;
