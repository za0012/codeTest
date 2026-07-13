import { AlertTriangle } from "lucide-react";
import Button from "@/components/ui/Button";

interface deleteStudyModalProp {
  onCancel: () => void;
  onConfirm: () => void;
}

export function DeleteStudyConfirmModal({
  onCancel,
  onConfirm,
}: deleteStudyModalProp) {
  return (
    <div className="flex flex-col items-center justify-center pb-2 text-center select-none">
      <div className="w-14 h-14 bg-[#FEE2E2] rounded-full flex items-center justify-center mb-5 animate-fade-in">
        <AlertTriangle className="w-6 h-6 text-[#F04452]" strokeWidth={2.5} />
      </div>
      <h3 className="text-[20px] font-bold text-[#191F28] tracking-tight mb-2.5">
        스터디를 삭제할까요?
      </h3>
      <p className="text-[15px] font-medium text-[#4E5968] leading-relaxed tracking-tight mb-9">
        삭제된 스터디 정보는 <br />
        <span className="text-[#F04452] font-semibold">
          다시는 복구할 수 없어요.
        </span>
      </p>
      <div className="flex gap-5 w-2/3 px-0.5">
        <Button
          type="button"
          className="flex-1 py-3 px-4 rounded-2xl bg-[#F2F4F6] text-[#4E5968] font-bold text-[14px] hover:bg-[#E5E8EB] active:scale-[0.97] transition-all duration-150"
          onClick={onCancel}
          label="취소"
        />
        <Button
          type="button"
          className="flex-1 py-3 px-4 rounded-2xl bg-[#F04452] text-white font-bold text-[14px] hover:bg-[#DC3442] active:scale-[0.97] transition-all duration-150 shadow-sm"
          onClick={onConfirm}
          label="삭제하기"
        />
      </div>
    </div>
  );
}
