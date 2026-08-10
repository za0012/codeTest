import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { createStudy } from "@/lib/api/study";
import type { phaseType } from "@/lib/types/step";

function MakeStudy({ moveStep }: phaseType) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const router = useRouter();

  const handleCreateStudy = async () => {
    try {
      await createStudy(name, description);
      alert("스터디가 생성되었습니다.");
      router.push("/home");
    } catch (error) {
      console.log(error);
      alert("스터디 생성에 실패했습니다");
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={() => moveStep(0)}
        className="w-full flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors text-[16px] font-medium mb-2"
      >
        <ArrowLeft size={18} />
        <span>이전으로</span>
      </button>
      <div className="flex flex-col gap-4 p-6 max-w-md mx-auto">
        {/* 1. 메인 텍스트 및 서브 텍스트 영역 */}
        <div className="mb-6">
          <p className="text-3xl font-extrabold text-slate-900 leading-snug">
            스터디를
            <br /> 만들어볼까요
          </p>
          <p className="text-sm font-medium text-slate-400 mt-2">
            스터디 이름과 소개를 입력해주세요
          </p>
        </div>
        {/* 2. 스터디 이름·소개 입력 영역 */}
        <div className="flex flex-col gap-3">
          <Input
            onChange={(e) => setName(e.currentTarget.value)}
            placeholder="스터디 이름"
            maxLength={20}
            className="text-lg font-bold text-slate-900 h-14"
          />
          <Input
            onChange={(e) => setDescription(e.currentTarget.value)}
            placeholder="스터디 소개"
            maxLength={40}
            className="text-slate-900 h-14"
          />
        </div>
        {/* 3. 만들기 버튼 영역 */}
        <div>
          <Button
            type="button"
            label="스터디 만들기"
            onClick={handleCreateStudy}
            className="w-full h-15 bg-blue-600 text-white text-[16px] font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
          >
            <ArrowRight />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default MakeStudy;
