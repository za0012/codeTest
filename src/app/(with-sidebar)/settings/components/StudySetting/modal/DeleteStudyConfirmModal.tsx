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
      {/* 1. 이모지 대신 세련된 Lucide 아이콘 배치 (토스 경고용 소프트 핑크/레드 배경) */}
      <div className="w-14 h-14 bg-[#FEE2E2] rounded-full flex items-center justify-center mb-5 animate-fade-in">
        <AlertTriangle className="w-6 h-6 text-[#F04452]" strokeWidth={2.5} />
      </div>

      {/* 2. 타이틀: 폰트 크기를 더 키우고 글자색을 아주 깊고 선명한 네이비/블랙 계열로 변경 */}
      <h3 className="text-[20px] font-bold text-[#191F28] tracking-tight mb-2.5">
        스터디를 삭제할까요?
      </h3>

      {/* 3. 설명문: 폰트 크기와 자간을 조절하고, '다시는 복구할 수 없어요'를 강조 */}
      <p className="text-[15px] font-medium text-[#4E5968] leading-relaxed tracking-tight mb-9">
        삭제된 스터디 정보는 <br />
        <span className="text-[#F04452] font-semibold">
          다시는 복구할 수 없어요.
        </span>
      </p>

      {/* 4. 버튼: 높이를 더 넓히고 자간(tracking-wide)과 부드러운 텍스트 색상 매칭 */}
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
          label="삭제하기"
        />
      </div>
    </div>
  );
}
