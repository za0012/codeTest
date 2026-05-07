import { ArrowLeft } from "lucide-react";
import type { phaseType } from "@/lib/types/step";

function MakeStudy({ moveStep }: phaseType) {
  return (
    <div>
      <button
        type="button"
        onClick={() => moveStep(0)}
        className="w-full flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors text-[16px] font-medium mb-4"
      >
        <ArrowLeft size={18} />

        <span>이전으로</span>
      </button>
      MakeStudy
    </div>
  );
}

export default MakeStudy;
