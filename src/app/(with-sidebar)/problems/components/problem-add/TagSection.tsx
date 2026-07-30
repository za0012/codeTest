import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { useForm, useFormContext, useWatch } from "react-hook-form";
import { ALGORITHM_TAGS } from "@/constants/problem";

function TagSection() {
  const [isOpen, setIsOpen] = useState(false);
  const { setValue, control, watch } = useFormContext();

  // const { watch } = useForm({ defaultValues: { tags: [] } });
  const selectedTags = useWatch({ control, name: "tags" });
  // const selectedTags = watch("tags") ?? [];

  const toggleTag = (tag: string) => {
    const nextTags = selectedTags.includes(tag)
      ? selectedTags.filter((t: string) => t !== tag)
      : [...selectedTags, tag];
    // const nextTags = setSelectTags((prev) =>
    //   prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    // );
    setValue("tags", nextTags);

    // setValue가 통하지 않음... 그래서 아무리 값을 넣어도 undifined가 뜸
    // 뭐 수정하고 렌더링이 바뀌면 바뀌긴 함... 그러니까 값이 실시간으로 바뀌진 않는다는 것.
    // 선택 후 렌더링이 되고 나서 값이 적용이 된다.
    // 그러니까 버튼 선택으로 값 삽입 후 리렌더링이 일어나야 selectedTags에 값이 들어간다는 것이댜. da

    // console.log(selectedTags);
  };

  return (
    <div className="pt-2">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full group"
      >
        <div className="flex items-center gap-2">
          <p className="text-[11px] font-bold text-gray-400 group-hover:text-blue-500 transition-colors uppercase tracking-tight cursor-pointer">
            Algorithm Tags
          </p>
          {selectedTags.length > 0 && (
            <div className="flex gap-1">
              {/* 선택된 태그 개수 표시 배지 */}
              <span className="bg-blue-50 text-blue-500 text-[10px] font-bold px-1.5 py-0.5 rounded">
                {selectedTags.length}
              </span>
            </div>
          )}
        </div>
        {isOpen ? (
          <ChevronUp size={14} className="text-gray-300" />
        ) : (
          <ChevronDown
            size={14}
            className="text-gray-300 group-hover:text-blue-500"
          />
        )}
      </button>
      {isOpen ? (
        <div className="mt-4 p-5 bg-[#f9fafb] rounded-2xl border border-gray-50 flex flex-wrap gap-1.5 transition-all animate-in fade-in slide-in-from-top-1">
          {ALGORITHM_TAGS.map((tag) => {
            const isSelected = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 rounded-full text-[12px] font-semibold transition-all ${
                  isSelected
                    ? "bg-blue-500 text-white"
                    : "bg-white text-[#6b7684] border border-gray-100 hover:border-gray-200"
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="mt-2 flex flex-wrap gap-1 min-h-5">
          {selectedTags.length > 0 ? (
            selectedTags.map((tag) => (
              <span
                key={tag}
                className="text-[12px] text-[#8b95a1] font-medium"
              >
                #{tag}
              </span>
            ))
          ) : (
            <p className="text-[13px] text-gray-300 pl-1">
              어떤 유형의 문제인가요?
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default TagSection;
