"use client";

import { useQuery } from "@tanstack/react-query";
import User from "./components/User";
import { getMyMemberInfo } from "@/lib/api/members";
import { UserProfile } from "@/lib/types/study";
import History from "./components/History";

function page() {
  const { data: userInfo } = useQuery<UserProfile>({
    queryKey: ["userInfo"],
    queryFn: getMyMemberInfo,
  });
  return (
    <div className="flex justify-center">
      {userInfo ? (
        <div>
          <User userInfo={userInfo} />
          <History id={userInfo.id} />
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}

export default page;
