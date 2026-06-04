import { useQuery } from "@tanstack/react-query";
import { Pencil } from "lucide-react";
import { getMyMemberInfo } from "@/lib/api/study";
import type { UserProfile } from "@/lib/types/study";

function ProfileSetting() {
  const { data: MyInfoInStudy, isLoading } = useQuery<UserProfile>({
    queryKey: ["getMyMemberInfo"],
    queryFn: getMyMemberInfo,
  });

  return (
    MyInfoInStudy && (
      <div className="flex flex-col gap-2.5">
        <p className="text-xs text-gray-400 font-bold tracking-wider ml-1 uppercase">
          프로필
        </p>
        <button
          type="button"
          className="flex flex-row items-center justify-between p-5 bg-white rounded-3xl w-full text-left shadow-[0_4px_20px_rgba(0,0,0,0.015)] hover:bg-gray-50 active:scale-[0.99] transition-all duration-200 group"
        >
          <div className="flex flex-row items-center gap-4">
            <div className="w-14 h-14 bg-[#F2F4F6] rounded-full flex items-center justify-center text-2xl shadow-inner group-hover:scale-105 transition-transform">
              {MyInfoInStudy.emoji}
            </div>

            <div className="flex flex-col gap-1">
              <p className="font-bold text-gray-900 text-lg leading-tight">
                {MyInfoInStudy.name}
              </p>
              {MyInfoInStudy?.bio && (
                <p className="text-sm text-gray-400 font-medium leading-normal">
                  {MyInfoInStudy.bio}
                </p>
              )}
            </div>
          </div>

          <div className="p-2 bg-[#F2F4F6] text-gray-400 rounded-full group-hover:text-gray-600 group-hover:bg-[#E5E8EB] transition-colors">
            <Pencil size={16} strokeWidth={2.5} />
          </div>
        </button>
      </div>
    )
  );
}

export default ProfileSetting;
