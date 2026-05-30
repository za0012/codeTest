"use client";

import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { getMyMemberInfo } from "@/lib/api/members";
import type { UserProfile } from "@/lib/types/study";
import DifficultCount from "./components/BarChart/view";
import History from "./components/Heatmap/view";
import MonthlySolve from "./components/LineChart/view";
import MySolves from "./components/MySolves/view";
import User from "./components/User";

function page() {
  const { data: userInfo } = useQuery<UserProfile>({
    queryKey: ["userInfo"],
    queryFn: getMyMemberInfo,
  });
  return (
    <div className="min-h-screen bg-[#f9fafb]">
      {userInfo ? (
        <div className="mx-auto flex w-full max-w-245 flex-col gap-6 bg-white py-8 px-8">
          <User userInfo={userInfo} />
          <History id={userInfo.id} />
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <MonthlySolve id={userInfo.id} />
            <DifficultCount id={userInfo.id} />
          </div>
          <MySolves id={userInfo.id} />
        </div>
      ) : (
        <div className="mx-auto flex w-full max-w-224.5 flex-col gap-6">
          <Skeleton className="h-32 w-full max-w-2xl rounded-2xl" />
          <Skeleton className="h-44 w-full rounded-2xl" />
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <Skeleton className="aspect-[1.618] w-full rounded-3xl" />
            <Skeleton className="aspect-[1.618] w-full rounded-3xl" />
          </div>
        </div>
      )}
    </div>
  );
}

export default page;
