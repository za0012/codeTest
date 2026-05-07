import { ChevronRight, Hash, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/api/auth";
import type { phaseType } from "@/lib/types/step";

function FirstStep({ moveStep }: phaseType) {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    alert("로그아웃 되었습니다");
    router.push("/login");
  };

  return (
    <div className="w-full max-w-100 flex flex-col gap-3 p-6">
      {/* 제목 섹션: 정렬을 위해 items-center 영향권에서 벗어나 기본 정렬(왼쪽) 유지 */}
      <div className="mb-6">
        <h2 className="text-[26px] font-extrabold text-gray-900 leading-tight">
          어떻게 시작할까요?
        </h2>
        <p className="text-gray-400 mt-2 text-[15px] leading-relaxed">
          기존 스터디에 참여하거나
          <br />
          새로 만들어보세요
        </p>
      </div>
      {/* 스터디 참여하기 카드 */}
      <button
        type="button"
        onClick={() => moveStep(1)}
        className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl cursor-pointer hover:bg-gray-100 transition-all border border-gray-100 w-full"
      >
        <div className="flex items-center gap-4">
          {/* 아이콘 박스: 흰색 배경에 그림자 살짝 */}
          <div className="flex items-center justify-center w-12 h-12 bg-white rounded-xl border border-gray-100 text-gray-400">
            <Hash size={20} />
          </div>
          <div>
            <p className="font-bold text-gray-900 text-[16px] text-left">
              스터디 참여하기
            </p>
            <p className="text-[13px] text-gray-400 mt-0.5">
              초대 코드로 입장해요
            </p>
          </div>
        </div>
        <ChevronRight size={20} className="text-gray-300" />
      </button>
      {/* 스터디 만들기 카드 */}
      <button
        type="button"
        onClick={() => moveStep(2)}
        className="flex items-center justify-between p-4 bg-blue-600 rounded-2xl cursor-pointer hover:bg-blue-700 transition-all text-white w-full"
      >
        <div className="flex items-center gap-4">
          {/* 아이콘 박스: 반투명 흰색 배경 */}
          <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-xl text-white">
            <Plus size={24} />
          </div>
          <div>
            <p className="font-bold text-[16px] text-left">스터디 만들기</p>
            <p className="text-[13px] text-purple-100 mt-0.5">
              내가 직접 스터디 개설
            </p>
          </div>
        </div>
        <ChevronRight size={20} className="text-white/70" />
      </button>
      <div className="w-full mt-5 text-center">
        <p className="text-slate-400 text-[15px]">
          잘못 로그인 하셨나요?
          <button
            type="button"
            onClick={handleLogout}
            className="text-blue-600 font-bold ml-2 hover:underline"
          >
            로그아웃
          </button>
        </p>
      </div>
    </div>
  );
}

export default FirstStep;
