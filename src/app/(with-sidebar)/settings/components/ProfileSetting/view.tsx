import { useQuery } from "@tanstack/react-query";
import { Pencil } from "lucide-react";
import { useState } from "react";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import { getMyMemberInfo } from "@/lib/api/study";
import type { UserProfile } from "@/lib/types/study";

function ProfileSetting() {
  const { data: MyInfoInStudy, isLoading } = useQuery<UserProfile>({
    queryKey: ["getMyMemberInfo"],
    queryFn: getMyMemberInfo,
  });

  const [isEditing, setIsEditing] = useState(false);

  return (
    MyInfoInStudy && (
      <div className="flex flex-col gap-2.5">
        <p className="text-xs text-gray-400 font-bold tracking-wider ml-1 uppercase">
          프로필
        </p>
        <button
          type="button"
          onClick={() => setIsEditing(true)}
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
        {isEditing && ( //이 아래에 넣는 내용 따로 컴포넌트로 빼야할 것 같음... 모달 고민 필요
          <Modal
            title="프로필 설정"
            subTitle=""
            onClose={() => setIsEditing(false)}
          >
            <div className="flex flex-col items-center justify-center gap-2 py-1">
              <button
                type="button"
                className="relative group w-24 h-24 bg-[#F2F4F6] hover:bg-[#E5E8EB] rounded-full flex items-center justify-center text-5xl shadow-inner transition-colors"
              >
                {MyInfoInStudy.emoji}
                <div className="absolute inset-0 bg-black/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Pencil size={22} strokeWidth={2.5} className="text-white" />
                </div>
              </button>
              <span className="text-xs font-bold text-gray-400 tracking-tight mt-1">
                이모지 변경
              </span>
            </div>
            <Input
              label="닉네임"
              size={"sm"}
              defaultValue={MyInfoInStudy.name}
            />
            <Input
              label="한 줄 소개"
              size={"sm"}
              defaultValue={MyInfoInStudy.bio}
            />
            <Input
              label="깃허브 주소"
              size={"sm"}
              defaultValue={MyInfoInStudy.bio}
            />
            <Input
              label="블로그 주소"
              size={"sm"}
              defaultValue={MyInfoInStudy.bio}
            />
          </Modal>
        )}
      </div>
    )
  );
}

export default ProfileSetting;
