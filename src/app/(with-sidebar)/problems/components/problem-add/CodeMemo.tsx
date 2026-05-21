import { useFormContext } from "react-hook-form";

function CodeMemo() {
  const { register } = useFormContext();
  return (
    <section className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-1 bg-[#3182f6] rounded-full" />
          <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
            Solution Code
          </h3>
        </div>
        <textarea
          {...register("code")}
          placeholder="여기에 코드를 붙여넣으세요"
          className="w-full h-40 bg-[#191f28] rounded-2xl p-6 text-[13px] font-mono text-blue-100/80 focus:ring-2 focus:ring-[#3182f6] outline-none transition-all resize-none shadow-inner"
        />
      </div>
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-1 bg-[#3182f6] rounded-full" />
          <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
            Review Memo
          </h3>
        </div>
        <textarea
          {...register("memo")}
          placeholder="오늘 풀이에서 기억하고 싶은 점은 무엇인가요?"
          className="w-full h-28 bg-[#f9fafb] border-none rounded-2xl p-6 text-[15px] text-[#4e5968] focus:bg-blue-50/30 focus:ring-2 focus:ring-[#3182f6] outline-none transition-all resize-none"
        />
      </div>
    </section>
  );
}

export default CodeMemo;
