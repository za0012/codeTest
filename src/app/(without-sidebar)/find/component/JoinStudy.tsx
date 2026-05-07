import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { getUser } from "@/lib/api/auth";
import { joinStudy } from "@/lib/api/study";
import type { phaseType } from "@/lib/types/step";

function JoinStudy({ moveStep }: phaseType) {
  const [inviteCode, setInviteCode] = useState("");
  const router = useRouter();

  const handleJoinStudy = async () => {
    const userName = await getUser();
    console.log(userName?.user_metadata.name);
    try {
      await joinStudy(inviteCode, userName?.user_metadata.name);
      alert("스터디에 입장되었습니다.");
      router.push("/home");
    } catch (error) {
      console.log(error);
      alert("스터디가 존재하지 않습니다"); //여기 케이스 좀 더 세부적으로 할 필요가 있음 우선 뼈대만
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
            초대 코드를
            <br /> 입력해주세요
          </p>
          <p className="text-sm font-medium text-slate-400 mt-2">
            스터디장에게 받은 코드를 입력해주세요
          </p>
        </div>
        {/* 2. 초대 코드 입력 영역 */}
        <div>
          <Input
            onChange={(e) => setInviteCode(e.currentTarget.value)}
            placeholder="예) ABCD1234"
            maxLength={8}
            className="text-center text-2xl font-bold text-slate-900 tracking-[0.25em] h-16"
          />
        </div>
        {/* 3. 입장하기 버튼 영역 (사진에 있는 것 추가) */}
        <div>
          <Button
            type="button"
            label="입장하기"
            onClick={handleJoinStudy}
            className="w-full h-15 bg-blue-600 text-white text-[16px] font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
          >
            <ArrowRight />
          </Button>
        </div>
        <div className="bg-blue-200/40 p-4 rounded-2xl mt-4 text-blue-700 font-semibold">
          <p className="text-center break-keep">
            💡 초대 코드는 스터디장의 마이페이지에서
            <br /> 확인할 수 있어요
          </p>
        </div>
      </div>
    </div>
  );
}

export default JoinStudy;
