import { AlertTriangle } from "lucide-react";
import Button from "@/components/ui/Button";

interface deleteStudyModalProp {
  onCancel: () => void;
  onConfirm: () => void;
}

export function ExitStudy({ onCancel, onConfirm }: deleteStudyModalProp) {
  return (
    <div className="flex flex-col items-center justify-center pb-2 text-center select-none">
      {/* 1. 이모지 대신 세련된 Lucide 아이콘 배치 (토스 경고용 소프트 핑크/레드 배경) */}
      <div className="w-14 h-14 bg-[#FEE2E2] rounded-full flex items-center justify-center mb-5 animate-fade-in">
        <AlertTriangle className="w-6 h-6 text-[#F04452]" strokeWidth={2.5} />
      </div>
      <h3 className="text-[20px] font-bold text-[#191F28] tracking-tight mb-2.5">
        스터디를 탈퇴하시겠습니까?
      </h3>
      <p className="text-[15px] font-medium text-[#4E5968] leading-relaxed tracking-tight mb-9">
        초대 코드만 있으면 언제든 다시 들어올 수 있어요.
        <br />
        <span className="text-[#F04452] font-semibold">
          정말 이 스터디를 나가시겠어요?
        </span>
      </p>
      <div className="flex gap-3 w-full px-0.5">
        <Button
          type="button"
          className="flex-1 py-4 px-2 rounded-[18px] bg-[#F2F4F6] text-[#4E5968] font-bold text-[16px] hover:bg-[#E5E8EB] active:scale-[0.97] transition-all duration-150"
          onClick={onCancel}
          label="취소"
        />
        <Button
          type="button"
          className="flex-1 py-4 px-2 rounded-[18px] bg-[#F04452] text-white font-bold text-[16px] hover:bg-[#DC3442] active:scale-[0.97] transition-all duration-150 shadow-sm"
          onClick={onConfirm}
          label="탈퇴하기"
        />
      </div>
    </div>
  );
}
