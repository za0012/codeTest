import { X } from "lucide-react";
import { useForm } from "react-hook-form";

function ProblemAddModal() {
  const { register } = useForm();
  return (
    <div className="fixed inset-0 bg-black/25 backdrop-blur-[2px] flex items-center justify-center z-50 p-6">
      <div
        className="bg-white rounded-4xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto no-scrollbar p-10 relative"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {/* 상단 닫기 버튼 */}
        <button
          type="button"
          //   onClick={handleclose}
          className="absolute top-8 right-8 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>
      </div>
    </div>
  );
}

export default ProblemAddModal;
