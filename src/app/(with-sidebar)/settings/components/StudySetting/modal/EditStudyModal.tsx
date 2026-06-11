import { QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { AlertCircle, Info } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { alertAtom } from "@/lib/store/alertStore";
import { updateStudyInfo } from "../service";

interface deleteStudyModalProp {
  studyId: number;
  studyName: string;
  studyDescription: string;
}

interface studySubmitForm {
  name: string;
  description: string;
}

export function EditStudyModal({
  studyId,
  studyName,
  studyDescription,
}: deleteStudyModalProp) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<studySubmitForm>();

  const setAlert = useSetAtom(alertAtom);
  // const queryClient = QueryClientProvider();
  const queryClient = useQueryClient();

  const submitStudyEditForm = async (formValues: studySubmitForm) => {
    setIsSubmitting(true);
    if (!studyId) {
      return setAlert({
        title: "호출 실패",
        content: "사용자 정보가 존재하지 않습니다",
        variant: true,
      });
    }
    try {
      await updateStudyInfo(1, {
        name: formValues.name,
        description: formValues.description,
      });
      setAlert({
        title: "저장 성공",
        content: "변경한 스터디 정보가 저장되었습니다.",
        variant: false,
      });
      setIsSubmitting(false);
      queryClient.invalidateQueries({ queryKey: ["studyInfo"] });
    } catch {
      setIsSubmitting(false);
      return setAlert({
        title: "저장 실패",
        content: "다시 시도해주세요",
        variant: true,
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(submitStudyEditForm)}
      className="flex flex-col h-full"
    >
      <div className="pb-6 pt-2">
        <p className="text-[15px] text-gray-500 leading-relaxed">
          팀원들이 보게 될 <br />
          <span className="font-semibold text-gray-700">스터디 정보</span>를
          변경할게요.
        </p>
      </div>
      <div className="flex flex-col gap-8">
        {/* 스터디 이름 입력 섹션 */}
        <div className="flex flex-col gap-2">
          <Input
            label="스터디 이름"
            {...register("name", {
              required: "스터디 이름은 필수입니다",
              minLength: { value: 2, message: "2자 이상 입력해주세요" },
            })}
            className={`w-full px-4 py-4 bg-[#f9fafb] border-none rounded-2xl text-[16px] text-gray-800 focus:bg-white focus:ring-2 transition-all outline-none ${
              errors.name ? "focus:ring-red-200" : "focus:ring-blue-500/20"
            }`}
            placeholder="스터디 이름을 입력해주세요"
            defaultValue={studyName}
          />
          {errors.name ? (
            <div className="flex items-center gap-1 ml-1 text-red-500">
              <AlertCircle size={14} strokeWidth={2.5} />
              <p className="text-[13px] font-medium">
                {errors.name.message as string}
              </p>
            </div>
          ) : (
            <p className="ml-1 text-[12px] text-gray-400">
              대시보드와 사이드바에 표시되는 이름이에요.
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Input
            label="한 줄 소개"
            {...register("description", {
              required: "소개글을 작성해주세요",
              minLength: { value: 2, message: "2자 이상 입력해주세요" },
            })}
            className={`w-full px-4 py-4 bg-[#f9fafb] border-none rounded-2xl text-[16px] text-gray-800 focus:bg-white focus:ring-2 transition-all outline-none ${
              errors.description
                ? "focus:ring-red-200"
                : "focus:ring-blue-500/20"
            }`}
            placeholder="스터디를 한 줄로 소개해볼까요?"
            defaultValue={studyDescription}
          />
          {errors.description ? (
            <div className="flex items-center gap-1 ml-1 text-red-500">
              <AlertCircle size={14} strokeWidth={2.5} />
              <p className="text-[13px] font-medium">
                {errors.description.message as string}
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-1 ml-1 text-gray-400">
              <Info size={12} />
              <p className="text-[12px]">우리 스터디원들에게만 공유돼요.</p>
            </div>
          )}
        </div>
      </div>
      <div className="pt-8">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4.5 bg-[#3182f6] hover:bg-[#1b64da] active:scale-[0.98] disabled:bg-gray-100 disabled:text-gray-400 text-white font-bold rounded-2xl transition-all text-[17px] shadow-lg shadow-blue-500/10"
          label={isSubmitting ? "변경사항 저장 중..." : "확인"}
        />
      </div>
    </form>
  );
}
