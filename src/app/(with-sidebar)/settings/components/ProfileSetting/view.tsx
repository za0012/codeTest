import { useQueryClient } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import { Skeleton } from "@/components/ui/skeleton";
import {
  MY_MEMBER_INFO_KEY,
  useMyMemberInfo,
} from "@/lib/query/useMyMemberInfo";
import { alertAtom } from "@/lib/store/alertStore";
import { updateMemberProfile } from "./service";

interface ProfileEditFormValues {
  name: string;
  bio?: string;
  github_url?: string;
  blog_url?: string;
}

function ProfileSetting() {
  const [isEditing, setIsEditing] = useState(false);
  // const mutation = useMutation({ mutationFn: updateMemberProfile });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileEditFormValues>();
  const setAlert = useSetAtom(alertAtom);
  const queryClient = useQueryClient();

  const { data: MyInfoInStudy, isLoading } = useMyMemberInfo();

  const submitProfileEditForm = async (formValues: ProfileEditFormValues) => {
    if (!MyInfoInStudy?.id)
      return setAlert({
        title: "호출 실패",
        content: "사용자 정보가 존재하지 않습니다",
        variant: true,
      });
    try {
      await updateMemberProfile(MyInfoInStudy.id, {
        name: formValues.name,
        bio: formValues.bio,
        github_url: formValues.github_url,
        blog_url: formValues.blog_url,
      });
      // 내 멤버 정보를 보는 화면이 여럿이지만 키가 하나라 한 줄이면 전부 갱신된다.
      queryClient.invalidateQueries({ queryKey: MY_MEMBER_INFO_KEY });
      queryClient.invalidateQueries({ queryKey: ["getMembers"] });
      setIsEditing(false);
    } catch {
      return setAlert({
        title: "저장 실패",
        content: "다시 시도해주세요",
        variant: true,
      });
    }
  };

  if (isLoading) {
    return <Skeleton className="w-full h-25" />;
  }

  return (
    MyInfoInStudy && (
      <div className="flex flex-col gap-2.5">
        <p className="text-xs text-gray-400 font-bold tracking-wider ml-1 uppercase">
          프로필
        </p>
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="flex flex-row items-center justify-between p-5 bg-white rounded-3xl w-full text-left shadow-[0_4px_20px_rgba(0,0,0,0.015)] active:scale-[0.99] transition-all duration-200 group"
        >
          <div className="flex flex-row items-center gap-4">
            <div className="w-14 h-14 bg-[#F2F4F6] rounded-full flex items-center justify-center text-2xl shadow-inner transition-transform">
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

          <div className="p-2 bg-[#F2F4F6] text-gray-400 rounded-full hover:text-gray-600 hover:bg-[#E5E8EB] transition-colors">
            <Pencil size={16} strokeWidth={2.5} />
          </div>
        </button>
        {isEditing && ( //이 아래에 넣는 내용 따로 컴포넌트로 빼야할 것 같음... 모달 고민 필요
          <Modal
            title="프로필 설정"
            subTitle=""
            onClose={() => setIsEditing(false)}
          >
            <form onSubmit={handleSubmit(submitProfileEditForm)}>
              <div className="flex flex-col items-center justify-center gap-2 py-1">
                <button
                  type="button"
                  className="relative group w-24 h-24 bg-[#F2F4F6] hover:bg-[#E5E8EB] rounded-full flex items-center justify-center text-5xl shadow-inner transition-colors"
                >
                  {MyInfoInStudy.emoji}
                  <div className="absolute inset-0 bg-black/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Pencil
                      size={22}
                      strokeWidth={2.5}
                      className="text-white"
                    />
                  </div>
                </button>
                <span className="text-xs font-bold text-gray-400 tracking-tight mt-1">
                  이모지 변경
                </span>
              </div>
              <div className="flex flex-col gap-4 pt-2">
                <Input
                  {...register("name", {
                    required: "닉네임은 필수입니다",
                    minLength: {
                      value: 2,
                      message: "닉네임은 2자 이상이어야 합니다.",
                    },
                  })}
                  label="닉네임"
                  size={"sm"}
                  defaultValue={MyInfoInStudy.name}
                />
                {errors.name && (
                  <p className="ml-2 text-red-400 text-sm">
                    {errors.name?.message?.toString()}
                  </p>
                )}
                <Input
                  {...register("bio")}
                  label="한 줄 소개"
                  size={"sm"}
                  defaultValue={MyInfoInStudy.bio}
                />
                <Input
                  {...register("github_url", {
                    pattern: {
                      value: /^https:\/\/github\.com\/.+/,
                      message: "올바른 웹 URL 형식이 아닙니다.",
                    },
                  })}
                  label="깃허브 주소"
                  size={"sm"}
                  placeholder="https://github.com/username"
                  defaultValue={MyInfoInStudy.github_url || undefined}
                />
                {errors.github_url && (
                  <p className="ml-2 text-red-400 text-sm">
                    {errors.github_url?.message?.toString()}
                  </p>
                )}
                <Input
                  {...register("blog_url")}
                  label="블로그 주소"
                  size={"sm"}
                  placeholder="https://velog.io/@username"
                  defaultValue={MyInfoInStudy.blog_url || undefined}
                />
              </div>
              <div className="flex flex-col pt-8">
                <button
                  type="submit"
                  // disabled={mutation.isPending}
                  // onClick={() => mutation.mutate()}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold rounded-2xl transition-all text-base tracking-wide"
                >
                  저장하기
                </button>
              </div>
            </form>
          </Modal>
        )}
      </div>
    )
  );
}

export default ProfileSetting;
