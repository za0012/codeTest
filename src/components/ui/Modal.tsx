import { X } from "lucide-react";

interface modalProps {
  title: string;
  subTitle: string;
  children: React.ReactNode;
}

function Modal({ title, subTitle, children }: modalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4 antialiased selection:bg-blue-100">
      {/* 1. 바깥쪽 카드: 여기 있던 no-scrollbar와 style 속성을 제거했습니다. */}
      <div className="w-full max-w-lg bg-white rounded-4xl p-8 flex flex-col gap-6 shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
        {/* Webkit 전용 스크롤바 숨기기 확실한 안전장치 추가 */}
        <style>{`
          .no-scrollbar::-webkit-scrollbar { display: none; }
        `}</style>
        {/* 헤더 영역 */}
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1.5 pl-1">
            <div className="flex items-center gap-2.5">
              <div className="w-[3.5px] h-6 bg-blue-600 rounded-full" />
              <h2 className="text-[#191F28] text-2xl font-bold tracking-tight">
                {title}
              </h2>
            </div>
            <p className="text-sm font-medium text-gray-400 ml-3.5">
              {subTitle}
            </p>
          </div>
          <button
            type="button"
            className="p-2 hover:bg-gray-100 active:bg-gray-200 text-gray-400 hover:text-gray-600 rounded-full transition-colors"
          >
            <X size={22} strokeWidth={2.5} />
          </button>
        </div>
        {/* 2. 입력 필드 영역: 실제로 스크롤이 발생하는 여기에 no-scrollbar와 style을 넣어야 합니다! */}
        {children}
        {/* 하단 저장 버튼 */}
        <div className="flex flex-col gap-2 pt-2">
          <button
            type="button"
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold rounded-2xl transition-all text-base tracking-wide"
          >
            저장하기
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
