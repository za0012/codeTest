import { useEffect, useState } from "react";
import {
  PLATFORM_CONFIG,
  DIFFICULTY_CONFIG,
  ALL_TAGS,
  type FormData,
  type PlatformConfig,
  type DifficultyConfig,
} from "../data/mockData";
import { X, ExternalLink, Edit3, Trash2 } from "lucide-react";
import { useStudy } from "../context/StudyContext";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import { getProblemById, updateProblem } from "@/lib/api";
import { WrapWithLabel } from "./custom";
import { Input } from "./ui/input";
import { useForm } from "react-hook-form";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { useQuery } from "@tanstack/react-query";

interface Props {
  // problem: FormData;
  onClose: () => void;
  onDelete?: (id: number) => void;
  onUpdate?: (p: FormData) => void;
  id: number;
}

export function ProblemModal({
  // problem,
  onClose,
  onDelete,
  onUpdate,
  id,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<FormData>();
  // const [problem, setProblem] = useState<FormData>();
  const [platform, setPlatform] = useState<PlatformConfig>();
  const [difficulty, setDifficulty] = useState<DifficultyConfig>();

  const {
    register,
    control,
    handleSubmit,
    formState: { isValid },
    watch,
    setValue,
  } = useForm<FormData>({
    defaultValues: {
      platform: "BOJ",
      tags: [],
    },
  });

  // const pc = PLATFORM_CONFIG[problem.platform];
  // const dc = DIFFICULTY_CONFIG[problem.difficulty];

  const handleUpdate = () => {
    // updateProblem(form);
    // onUpdate?.(form);
    setIsEditing(false);
  };

  const handleDelete = () => {
    // deleteProblem(problem?.id);
    // onDelete?.(problem?.id);
    onClose();
  };

  const selectedTags = watch("tags");

  const toggleTag = (tag: string) => {
    const nextTags = selectedTags.includes(tag)
      ? selectedTags.filter((t: string) => t !== tag)
      : [...selectedTags, tag]; // 없으면 추가

    setValue("tags", nextTags, { shouldValidate: true }); //실시간 유효성 검사
  };

  const {
    data: problem,
    error: isError,
    isLoading,
  } = useQuery<FormData>({
    queryKey: ["updateProblem", isEditing, id],
    queryFn: () => getProblemById(id),
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
    updateProblem(id, data);
    setIsEditing(false);
    // API 호출 등의 로직
  };

  // useEffect(() => {
  //   if (!id) return;
  //   const fetchData = async () => {
  //     try {
  //       // const res = await getProblemById(id);
  //       // console.log(res);
  //       // useUpdateEdit(isEditing);
  //       // setProblem(res);
  //       setPlatform(PLATFORM_CONFIG[res.platform]);
  //       setDifficulty(DIFFICULTY_CONFIG[res.difficulty]);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   console.log(isEditing);
  //   fetchData();
  // }, [id]);

  if (isLoading) {
    return <p>로딩중...</p>;
  }

  if (isError) {
    return alert("데이터를 불러오던 중 문제가 발생했습니다.");
  }

  if (!problem) return;

  if (!isLoading)
    return (
      <div
        className="fixed inset-0 bg-black/25 backdrop-blur-[2px] flex items-center justify-center z-50 p-6"
        // onClick={onClose}
      >
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[88vh] overflow-y-auto no-scrollbar">
          <div className="p-7">
            {/* Header */}
            <div className="flex items-start justify-between mb-5">
              <div className="flex-1 min-w-0 pr-4">
                {/* Badges row */}
                <div className="flex items-center gap-2 flex-wrap mb-2.5">
                  <span
                    className={`text-[11px] px-2.5 py-1 rounded-full font-semibold ${PLATFORM_CONFIG[problem?.platform]?.bg} ${PLATFORM_CONFIG[problem?.platform]?.text}`}
                  >
                    {PLATFORM_CONFIG[problem?.platform]?.label}
                  </span>
                  <span
                    className={`text-[11px] px-2.5 py-1 rounded-full font-semibold ${DIFFICULTY_CONFIG[problem.difficulty]?.bg ?? "bg-gray-100"} ${DIFFICULTY_CONFIG[problem.difficulty]?.text ?? "text-gray-500"}`}
                  >
                    {problem.difficulty}
                  </span>
                  {problem.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] px-2.5 py-1 rounded-full bg-gray-100 text-gray-500"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                {/* Title */}
                <h2
                  className="text-gray-900 font-extrabold text-xl"
                  style={{
                    letterSpacing: "-0.3px",
                  }}
                >
                  {problem.title}
                </h2>
                {/* Meta */}
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">{problem.members?.emoji}</span>
                    <span className="text-gray-500 text-sm font-medium">
                      {problem.members?.name}
                    </span>
                  </div>
                  <span className="text-gray-200">·</span>
                  <span className="text-gray-400 text-xs">
                    {new Date(problem.created_at).toLocaleDateString()}
                  </span>
                  <span className="text-gray-200">·</span>
                  <span className="text-gray-400 text-xs">
                    ⏱ {problem.time_spent}분
                  </span>
                  {problem.url && (
                    <>
                      <span className="text-gray-200">·</span>
                      <a
                        href={problem.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-xs text-blue-400 hover:text-[#3182f6] transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink size={12} />
                        문제 보기
                      </a>
                    </>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-1 shrink-0">
                {!isEditing && (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-colors"
                  >
                    <Edit3 size={15} />
                  </button>
                )}
                {/* <button
                onClick={handleDelete}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-400 hover:bg-red-50 rounded-xl transition-colors"
              >
                <Trash2 size={15} />
              </button>*/}
                <button
                  type="button"
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="border-t border-gray-50 mb-5" />

            {!isEditing ? (
              /* ── View mode ── */
              <div className="flex flex-col gap-5">
                {problem.solution && (
                  <div>
                    <p
                      className="text-xs text-gray-400 mb-2.5 font-semibold"
                      style={{
                        letterSpacing: "0.5px",
                        textTransform: "uppercase",
                      }}
                    >
                      💻 풀이 코드
                    </p>
                    <SyntaxHighlighter
                      language="javascript"
                      style={dracula}
                      className="text-xs"
                      customStyle={{ padding: 20, borderRadius: 10 }}
                    >
                      {problem.solution}
                    </SyntaxHighlighter>
                  </div>
                )}
                {problem.memo && (
                  <div>
                    <p
                      className="text-xs text-gray-400 mb-2.5"
                      style={{
                        fontWeight: 600,
                        letterSpacing: "0.5px",
                        textTransform: "uppercase",
                      }}
                    >
                      📝 메모
                    </p>
                    <div
                      className="bg-amber-50/60 border border-amber-100 rounded-2xl p-4 text-sm text-gray-700"
                      style={{ lineHeight: 1.7 }}
                    >
                      {problem.memo}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* ── Edit mode ── */
              <form className="flex flex-col gap-4">
                <WrapWithLabel title={"태그"}>
                  <div className="flex flex-wrap gap-1.5 p-3 border border-gray-100 rounded-2xl bg-gray-50/50">
                    {ALL_TAGS.map((tag) => (
                      <Button
                        key={tag}
                        type="button"
                        size="xss"
                        variant={
                          selectedTags.includes(tag) ? "blue" : "blueOut"
                        }
                        onClick={() => toggleTag(tag)}
                      >
                        {tag}
                      </Button>
                    ))}
                  </div>
                </WrapWithLabel>

                <WrapWithLabel title={"시간(분)"}>
                  <Input
                    className="w-full"
                    placeholder="시간(분)"
                    defaultValue={problem.time_spent}
                    type="number"
                    {...register("time_spent", { valueAsNumber: true })}
                  />
                </WrapWithLabel>

                <WrapWithLabel title={"풀이 코드"}>
                  <Textarea
                    placeholder="코드를 입력해주세요"
                    rows={16}
                    defaultValue={problem.solution}
                    className="text-xs! field-sizing-fixed! font-mono py-3"
                    {...register("solution", {
                      required: "코드를 입력해주세요",
                    })}
                  />
                </WrapWithLabel>
                <WrapWithLabel title={"메모"}>
                  <Textarea
                    placeholder="풀이 접근법, 주의사항, 배운 점 등..."
                    rows={5}
                    defaultValue={problem.memo}
                    className="field-sizing-fixed! py-3"
                    {...register("memo")}
                  />
                </WrapWithLabel>

                <div className="flex gap-2 justify-end pt-1">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 rounded-xl text-sm text-gray-500 hover:bg-gray-50 transition-colors"
                  >
                    취소
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit(onSubmit)}
                    className="font-semibold px-5 py-2 rounded-xl text-sm bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200"
                  >
                    저장
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    );
}
