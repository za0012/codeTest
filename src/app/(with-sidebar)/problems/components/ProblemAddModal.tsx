import { X } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import type { PlatformType } from "@/constants/problem";
import { addProblem } from "@/lib/api/problems";
import CodeMemo from "./problem-add/CodeMemo";
import PlatformTitle from "./problem-add/PlatformTitle";
import TagSection from "./problem-add/TagSection";
import TimeDateDiff from "./problem-add/TimeDateDiff";

interface problemType {
  platform: PlatformType;
  title: string;
  url: string;
  tags: string[];
  difficulty: string;
  time: number;
  date: Date;
  code: string;
  memo: string;
}

interface problemModalType {
  onClose: React.Dispatch<React.SetStateAction<boolean>>;
  study_id: number;
  member_id: number;
}

const ProblemAddModal = ({
  onClose,
  study_id,
  member_id,
}: problemModalType) => {
  const form = useForm<problemType>({
    defaultValues: {
      tags: [],
    },
  });

  const onSubmit = async (data: problemType) => {
    // console.log(study_id);
    // console.log(member_id);
    // console.log(data);
    const stringDate = `${data.date.getFullYear()}-${String(data.date.getMonth() + 1).padStart(2, "0")}-${String(data.date.getDate()).padStart(2, "0")}`;
    await addProblem({
      study_id: study_id,
      member_id: member_id,
      title: data.title,
      platform: data.platform,
      difficulty: data.difficulty,
      tags: data.tags,
      date: stringDate,
      solution: data.code,
      memo: data.memo,
      time_spent: data.time,
      url: data.url,
    });
    onClose(false);
  };

  return (
    <div className="fixed inset-0 bg-black/25 backdrop-blur-[2px] flex items-center justify-center z-50 p-6">
      {/* no-scrollbar 클래스와 style 속성으로 스크롤바 완전 제거 */}
      <div
        className="bg-white rounded-4xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto relative p-10 no-scrollbar"
        style={{
          msOverflowStyle: "none" /* IE and Edge */,
          scrollbarWidth: "none" /* Firefox */,
        }}
      >
        {/* Webkit 전용 스크롤바 숨기기 스타일 (Global CSS에 없다면 여기에 추가) */}
        <style>{`
          .no-scrollbar::-webkit-scrollbar { display: none; }
        `}</style>

        <button
          type="button"
          onClick={() => onClose(false)}
          className="absolute top-8 right-8 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>

        <header className="mb-10">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1 h-5 bg-[#3182f6] rounded-full" />
            <h2 className="text-2xl font-bold text-[#191f28]">문제 기록하기</h2>
          </div>
          <p className="text-sm text-[#8b95a1] ml-3">
            오늘의 성장을 기록으로 남겨보세요.
          </p>
        </header>

        <FormProvider {...form}>
          <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
            <PlatformTitle />
            <TagSection />
            <TimeDateDiff />
            <CodeMemo />
            <footer className="pt-4 flex items-center gap-4">
              <button
                type="button"
                onClick={() => onClose(false)}
                className="px-6 py-4 text-[#6b7684] font-bold hover:bg-[#f2f4f6] rounded-2xl transition-colors"
              >
                취소
              </button>
              <button
                type="submit"
                className="flex-1 py-4 bg-[#3182f6] text-white font-bold rounded-2xl hover:bg-[#1b64da] transition-all active:scale-[0.98]"
              >
                기록 완료하기
              </button>
            </footer>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};
export default ProblemAddModal;
